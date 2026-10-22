export type NavigationItem = { title: string; description: string; href?: string };
export type NavigationCategory = {
  id: string; label: string; href: string; overview: string;
  groups: { label: string; items: NavigationItem[] }[];
  feature: { eyebrow: string; title: string; description: string; label: string; href: string; playbook?: boolean };
};

// Only confirmed V2 topics are rendered. Held proposals and evidence are in
// docs/V2_MEGA_NAVIGATION.md. Descriptive topics deliberately have no fake href.
export const navigation: NavigationCategory[] = [
  {
    id: 'it', label: 'IT Services', href: '/services/', overview: 'View all IT Services',
    groups: [
      { label: 'Managed Operations', items: [
        { title: 'Managed IT Services', description: 'Proactive support, monitoring and IT operations.', href: '/services/managed-it/' },
        { title: 'Service Desk', description: 'Direct access to engineers who know your environment.', href: '/services/managed-it/#service-desk' },
        { title: 'Networking & Infrastructure', description: 'Firewalls, switching, Wi-Fi, servers and connectivity.', href: '/services/networks-infrastructure/' },
        { title: 'Backup & Disaster Recovery', description: 'Backup monitoring and recovery planning.', href: '/services/backup-recovery/' },
        { title: 'Endpoint Management', description: 'Patching and device oversight within your agreed IT scope.' },
      ] },
      { label: 'Projects & Advisory', items: [
        { title: 'Technology Planning', description: 'Equipment lifecycle decisions with your business context in view.', href: '/services/#operate-decisions-title' },
        { title: 'Free IT Review', description: 'Start a conversation about your environment and priorities.', href: '/contact/?type=review' },
      ] },
    ],
    feature: { eyebrow: 'Free IT Review', title: 'Know where your IT stands.', description: 'Get a clearer view of your infrastructure, security and operational priorities.', label: 'Book a free IT review', href: '/contact/?type=review' },
  },
  {
    id: 'security', label: 'Cybersecurity', href: '/services/cybersecurity/', overview: 'Explore Cybersecurity',
    groups: [
      { label: 'Protection', items: [
        { title: 'Managed Cybersecurity', description: 'Layered protection across users, endpoints and infrastructure.', href: '/services/cybersecurity/' },
        { title: 'Endpoint Security', description: 'Threat protection around user devices.' },
        { title: 'Application Control', description: 'Control which applications are allowed to execute.' },
      ] },
      { label: 'Identity & Risk', items: [
        { title: 'Identity & Access Security', description: 'Identity, authentication and account controls.' },
        { title: 'Security Hardening', description: 'Reduce avoidable exposure with suitable controls.' },
        { title: 'Phishing Awareness Example', description: 'Explore common attack techniques in an illustrative exercise.', href: '/services/cybersecurity/#phishing-decisions' },
      ] },
    ],
    feature: { eyebrow: 'Security Incident', title: 'Under attack?', description: 'If you suspect an active incident, contact our team immediately.', label: 'Get emergency help', href: '/emergency/' },
  },
  {
    id: 'cloud', label: 'Cloud', href: '/services/microsoft-cloud/', overview: 'Explore Microsoft 365 & Cloud',
    groups: [
      { label: 'Microsoft 365', items: [
        { title: 'Microsoft 365 Management', description: 'Administration for the services your people rely on.', href: '/services/microsoft-cloud/' },
      ] },
      { label: 'Identity & Devices', items: [
        { title: 'Microsoft Entra ID', description: 'Identity and access controls around your environment and licenses.' },
        { title: 'Microsoft Intune', description: 'Device policy and application deployment where appropriate.' },
      ] },
    ],
    feature: { eyebrow: 'Microsoft 365', title: 'Make your cloud environment work better.', description: 'Manage users, access, devices and cloud services with your business context in view.', label: 'Explore Cloud Services', href: '/services/microsoft-cloud/' },
  },
  {
    id: 'ai', label: 'AI & Automation', href: '/services/ai-automation/', overview: 'Explore AI & Automation',
    groups: [
      { label: 'AI for Business', items: [
        { title: 'AI & Automation', description: 'Explore a sample business workflow with human review.', href: '/services/ai-automation/' },
        { title: 'AI Governance', description: 'A practical starting point for permitted uses, data access and review.', href: '/resources/ai-governance/' },
      ] },
      { label: 'Build & Assess', items: [
        { title: 'Workflow Automation', description: 'Plan a repeatable task, its inputs and who checks the result.', href: '/services/ai-automation/#ai-automation-details' },
      ] },
    ],
    feature: { eyebrow: 'AI Governance', title: 'AI is already inside your business.', description: "Make sure your data isn't leaving with it.", label: 'View the AI Governance Playbook', href: '/resources/ai-governance/', playbook: true },
  },
  {
    id: 'digital', label: 'Web & Hosting', href: '/services/web-design-hosting/', overview: 'Explore Web Design & Hosting',
    groups: [
      { label: 'Web', items: [
        { title: 'Web Design & Development', description: 'Design, content and navigation around your business audience.', href: '/services/web-design-hosting/' },
        { title: 'Managed Hosting', description: 'Hosting and ongoing management with a clear scope.' },
        { title: 'Website Security', description: 'Discuss security needs as part of your website scope.' },
        { title: 'Website Maintenance', description: 'Updates, fixes and ongoing technical management.' },
      ] },
      { label: 'Performance & Growth', items: [
        { title: 'Plan Your Website', description: 'Start with your audience, the information they need and their next step.', href: '/services/web-design-hosting/#web-design-hosting-details' },
      ] },
    ],
    feature: { eyebrow: 'Digital Services', title: 'Your website is business infrastructure.', description: 'From initial design through hosting, security and ongoing maintenance, with an agreed scope.', label: 'Explore Web Design & Hosting', href: '/services/web-design-hosting/' },
  },
  {
    id: 'why', label: 'Why ITKeepers', href: '/#why-itkeepers', overview: 'Discover ITKeepers',
    groups: [
      { label: 'Our Approach', items: [
        { title: 'Why ITKeepers', description: 'How our operating model is different.', href: '/#why-itkeepers' },
        { title: 'How We Work', description: 'Monitoring, escalation, documentation and follow-up.', href: '/how-we-work/' },
        { title: 'Our Team', description: 'Your IT person is a team.', href: '/about/' },
        { title: 'Technology Ecosystem', description: 'The platforms and technologies behind our operations.', href: '/#technology' },
      ] },
      { label: 'Resources', items: [
        { title: 'IT Keepers Pulse', description: 'Client IT visibility platform under development.', href: '/it-keepers-pulse/' },
        { title: 'AI Governance Playbook', description: 'A practical guide to business AI policy and human review.', href: '/resources/ai-governance/' },
        { title: 'Contact', description: 'Talk directly with our team.', href: '/contact/' },
      ] },
    ],
    feature: { eyebrow: 'The ITKeepers Approach', title: 'Your IT person is a team.', description: "Engineers who know your environment, backed by broader technical expertise when it's needed.", label: 'Meet ITKeepers', href: '/#why-itkeepers' },
  },
];
