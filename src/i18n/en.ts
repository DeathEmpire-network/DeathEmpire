/**
 * English strings - DeathEmpire (default language)
 * Public voice: no build/SSG/pipeline/token jargon in hero copy.
 * The only public signature is Kramsuiakari.
 */

export const en = {
  lang: 'en' as const,
  nav: [
    { href: '/DeathEmpire/', label: 'Home' },
    { href: '/DeathEmpire/world/', label: 'The World' },
    { href: '/DeathEmpire/lore/', label: 'Lore' },
    { href: '/DeathEmpire/gameplay/', label: 'Gameplay' },
    { href: '/DeathEmpire/chronicles/', label: 'Chronicles' },
    { href: '/DeathEmpire/project/', label: 'The Project' },
    { href: '/DeathEmpire/collaborate/', label: 'Collaborate' },
  ],
  ui: {
    skipToContent: 'Skip to main content',
    mainNav: 'Main navigation',
    openMenu: 'Open menu',
    backToTop: 'Back to top',
    selectLanguage: 'Select language',
    language: 'Language',
    switchTo: 'Switch to Español',
  },
  header: {
    homeLabel: 'DeathEmpire - Home',
    cta: 'Explore the Lore',
    ctaHref: '/DeathEmpire/lore/',
  },
  footer: {
    tagline:
      'An independent dark-fantasy world in active development. Created and led by Kramsuiakari.',
    exploreTitle: 'Explore',
    explore: [
      { href: '/DeathEmpire/world/', label: 'The World' },
      { href: '/DeathEmpire/lore/', label: 'Lore' },
      { href: '/DeathEmpire/gameplay/', label: 'Gameplay' },
      { href: '/DeathEmpire/chronicles/', label: 'Chronicles' },
    ],
    projectTitle: 'Project',
    project: [
      { href: '/DeathEmpire/project/', label: 'The Project' },
      { href: '/DeathEmpire/roadmap/', label: 'Roadmap' },
      { href: '/DeathEmpire/status/', label: 'Status' },
      { href: '/DeathEmpire/repositories/', label: 'Repositories' },
    ],
    connectTitle: 'Connect',
    connect: [
      { href: '/DeathEmpire/collaborate/', label: 'Collaborate' },
      { href: 'https://github.com/DeathEmpire-network', label: 'GitHub' },
    ],
    note: 'DeathEmpire is in active development. Public gameplay access has not yet been announced.',
    rights: '© 2026 DeathEmpire · All rights reserved.',
    languageLabel: 'English · Español',
  },
  meta: {
    defaultDescription:
      'DeathEmpire is an independent dark-fantasy world in active development, created and led by Kramsuiakari.',
  },
};
