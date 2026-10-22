/** Proposed technical limits; approve alongside privacy/operations before activation. */
export const policy = Object.freeze({
  maxBodyBytes: 16_384, bodyTimeoutMs: 5_000, verifyTimeoutMs: 5_000, sendTimeoutMs: 8_000,
  clientAttempts: 5, clientWindowMs: 600_000,
  globalAttempts: 100, globalWindowMs: 3_600_000,
  outboundAttempts: 100, outboundWindowMs: 86_400_000,
  duplicateWindowMs: 86_400_000,
});
