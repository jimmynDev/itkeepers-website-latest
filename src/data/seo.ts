import legacyArticles from './legacy-articles.json';
// Geography/category: claims-register V2-POSITIONING-01. No office address inferred.
export const siteUrl = 'https://itkeepers.com';
export interface PageSEO {
  title: string;
  description: string;
  index?: boolean;
  service?: string;
  articleDate?: string;
}
export const pages: Record<string, PageSEO> = {
  '/blog/': {
    title: 'ITKeepers Blog Archive | AI, Machine Learning & Data',
    description: 'Explore retained ITKeepers articles on AI, machine learning and data use, with their original publication dates and links to current guidance.'
  },
  ...Object.fromEntries(legacyArticles.map(article => [article.path, {
    title: `${article.title} | ITKeepers Blog Archive`,
    description: article.description,
    articleDate: article.published
  }])),
  '/': {
    title: 'Managed IT, Cybersecurity & Cloud in Lebanon | ITKeepers',
    description: 'ITKeepers provides managed IT services, cybersecurity, Microsoft 365, networking and backup for businesses in Lebanon, backed by proactive engineering.'
  },
  '/about/': {
    title: 'About ITKeepers | Familiar Engineers, Shared Expertise',
    description: 'Meet the approach behind ITKeepers: familiar engineers, shared expertise, proactive IT operations and documented context that supports your business as it evolves.'
  },
  '/contact/': {
    title: 'Contact ITKeepers | Talk to Our Team',
    description: 'Contact ITKeepers in Lebanon about managed IT, cybersecurity, Microsoft 365, infrastructure, automation or a free IT review.'
  },
  '/how-we-work/': {
    title: 'How We Work: IT Monitoring & Follow-Up | ITKeepers',
    description: 'See how ITKeepers connects monitoring, shared documentation, internal escalation and follow-up, with illustrative examples and clear service boundaries.'
  },
  '/emergency/': {
    title: 'Under Attack? | ITKeepers Emergency Contact',
    description: 'ITKeepers accepts security incident enquiries from existing and new clients. Contact details and general guidance for suspected cyberattacks.'
  },
  '/privacy/': {
    title: 'Privacy | ITKeepers',
    description: 'Privacy notice preparation for the ITKeepers redesign, including the data-handling details that require confirmation before launch.',
    index: false // Existing page explicitly says the final notice is still pending.
  },
  '/it-keepers-pulse/': {
    title: 'IT Keepers Pulse | IT Visibility Platform in Development',
    description: 'IT Keepers Pulse is under development as ITKeepers’ client IT visibility platform. Explore planned views and a preview with sample data.'
  },
  '/resources/ai-governance/': {
    title: 'AI Governance Playbook: MSP Draft Framework | ITKeepers',
    description: 'Explore ITKeepers’ draft AI governance framework from its MSP environment: company-data boundaries, employee AI use and controls for review before adoption.'
  },
  '/services/': {
    title: 'Business IT Services in Lebanon | ITKeepers',
    description: 'Explore managed IT, cybersecurity, Microsoft 365, infrastructure, backup, AI and web services from ITKeepers, a Lebanon-based Managed Service Provider (MSP).'
  },
  '/services/managed-it/': {
    title: 'Managed IT Services in Lebanon | ITKeepers MSP',
    description: 'Day-to-day IT management from ITKeepers, a Lebanon-based MSP: familiar engineers, proactive attention, shared documentation and follow-up.',
    service: 'Managed IT'
  },
  '/services/microsoft-cloud/': {
    title: 'Microsoft 365 & Cloud Services in Lebanon | ITKeepers',
    description: 'Microsoft 365 user, identity, license and device administration from ITKeepers in Lebanon. Controls depend on licensing, configuration and agreed scope.',
    service: 'Microsoft 365 & Cloud'
  },
  '/services/cybersecurity/': {
    title: 'Cybersecurity Services in Lebanon | ITKeepers',
    description: 'Explore layered identity, endpoint and network security with ITKeepers in Lebanon. Suitable controls depend on risk, licensing, environment and agreed scope.',
    service: 'Cybersecurity'
  },
  '/services/networks-infrastructure/': {
    title: 'Networks & Infrastructure in Lebanon | ITKeepers',
    description: 'Plan and maintain business networks, Wi-Fi, servers and connectivity with ITKeepers in Lebanon, with infrastructure and resilience scope agreed for each site.',
    service: 'Networks & Infrastructure'
  },
  '/services/backup-recovery/': {
    title: 'Backup & Disaster Recovery in Lebanon | ITKeepers',
    description: 'ITKeepers monitors backup jobs and routinely performs restore tests. Test scope, retention and recovery objectives depend on the agreed service.',
    service: 'Backup & Disaster Recovery'
  },
  '/services/ai-automation/': {
    title: 'AI & Automation: Workflow Planning | ITKeepers',
    description: 'Explore AI governance and automation with ITKeepers: human review, company-data boundaries and an illustrative request workflow.',
    service: 'AI & Automation'
  },
  '/services/web-design-hosting/': {
    title: 'Web Design & Hosting: Project Planning | ITKeepers',
    description: 'Explore a website example from wireframe through launch and maintenance with ITKeepers. Hosting, updates and responsibilities need an agreed project scope.',
    service: 'Web Design & Hosting'
  }
};

export const canonicalPath = (path: string) => path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;

export function structuredData(path: string, page: PageSEO) {
  const url = `${siteUrl}${canonicalPath(path)}`;
  const organizationId = `${siteUrl}/#organization`;
  const entities: Record<string, unknown>[] = [{
    '@type': 'Organization', '@id': organizationId, name: 'ITKeepers', url: `${siteUrl}/`
  }];
  if (path === '/') entities.push({
    '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'ITKeepers',
    url: `${siteUrl}/`, description: page.description, publisher: { '@id': organizationId }
  });
  if (page.service) entities.push({
    '@type': 'Service', '@id': `${url}#service`, name: page.service,
    serviceType: page.service, url, description: page.description,
    provider: { '@id': organizationId }
  });
  // Reflect the existing navigation hierarchy without adding commercial claims.
  if (page.service) entities.push({
    '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services/` },
      { '@type': 'ListItem', position: 3, name: page.service, item: url }
    ]
  });
  if (page.articleDate) entities.push({
    '@type': 'Article', '@id': `${url}#article`,
    headline: legacyArticles.find(article => article.path === path)?.title,
    url, description: page.description, datePublished: page.articleDate,
    publisher: { '@id': organizationId }
  });
  if (path === '/it-keepers-pulse/') entities.push({
    '@type': 'WebApplication', '@id': `${url}#application`,
    name: 'IT Keepers Pulse', url, description: page.description,
    provider: { '@id': organizationId }
  });
  if (path === '/resources/ai-governance/') entities.push({
    '@type': 'DigitalDocument', '@id': `${url}#document`,
    name: 'ITKeepers AI Governance Playbook', url, description: page.description,
    author: { '@id': organizationId }, publisher: { '@id': organizationId },
    encoding: { '@type': 'MediaObject', contentUrl: `${siteUrl}/resources/itkeepers-ai-governance-playbook.pdf`, encodingFormat: 'application/pdf' }
  });
  return { '@context': 'https://schema.org', '@graph': entities };
}
