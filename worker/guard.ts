import { policy } from './policy';

type Counter = { count: number; expires: number };
type RecordState = { digest: string; ticket: string; status: 'pending' | 'accepted' | 'uncertain'; expires: number };
type State = { counters: Record<string, Counter>; requests: Record<string, RecordState> };
/** One globally addressed object. Stores counters and keyed digests only, never inquiries/IPs/tokens. */
export class InquiryGuard {
  constructor(private state: any) {}
  private clean(data: State, now: number) {
    for (const [key, value] of Object.entries(data.counters)) if (value.expires <= now) delete data.counters[key];
    for (const [key, value] of Object.entries(data.requests)) if (value.expires <= now) delete data.requests[key];
  }
  private async update<T>(fn: (data: State, now: number) => T): Promise<T> {
    return this.state.storage.transaction(async (storage: any) => {
      const data: State = await storage.get('guard') ?? { counters: {}, requests: {} };
      const now = Date.now(); this.clean(data, now);
      const result = fn(data, now);
      await storage.put('guard', data);
      const expiries = [...Object.values(data.counters), ...Object.values(data.requests)].map(v => v.expires);
      if (expiries.length) await storage.setAlarm(Math.min(...expiries));
      else await storage.deleteAlarm();
      return result;
    });
  }
  async alarm() { await this.update(() => null); }
  async fetch(request: Request): Promise<Response> {
    // This object has no public route; callers need the private Worker binding.
    const input: any = await request.json();
    const hash = (s: unknown) => typeof s === 'string' && /^[a-f0-9]{64}$/.test(s);
    if (!['attempt', 'lookup', 'reserve', 'complete'].includes(input.op)) return new Response(null, { status: 400 });
    const result = await this.update((data, now) => {
      const take = (key: string, max: number, window: number) => {
        const item = data.counters[key] ?? { count: 0, expires: now + window };
        if (item.count >= max) return false;
        item.count++; data.counters[key] = item; return true;
      };
      if (input.op === 'attempt') {
        if (!hash(input.client)) return { status: 'invalid' };
        // Fixed global key is coordinated here, not a per-colo rate-limit approximation.
        if (!take('global', policy.globalAttempts, policy.globalWindowMs)
          || !take('client:' + input.client, policy.clientAttempts, policy.clientWindowMs)) return { status: 'limited' };
        return { status: 'allowed' };
      }
      if (!hash(input.key) || !hash(input.digest)) return { status: 'invalid' };
      const existing = data.requests[input.key];
      if (input.op === 'complete') {
        if (!existing || existing.digest !== input.digest || existing.ticket !== input.ticket) return { status: 'conflict' };
        if (existing.status === 'pending' && ['accepted', 'uncertain'].includes(input.status)) existing.status = input.status;
        return { status: existing.status };
      }
      if (existing) return { status: existing.digest === input.digest ? existing.status : 'conflict' };
      if (input.op === 'lookup') return { status: 'new' };
      if (!take('outbound', policy.outboundAttempts, policy.outboundWindowMs)) return { status: 'limited' };
      const ticket = crypto.randomUUID();
      data.requests[input.key] = { digest: input.digest, ticket, status: 'pending', expires: now + policy.duplicateWindowMs };
      return { status: 'reserved', ticket };
    });
    return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
  }
}
