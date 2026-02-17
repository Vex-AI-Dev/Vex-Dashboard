import { Footer } from '@kit/ui/marketing';

import { AppLogo } from '~/components/app-logo';

const sections = [
  {
    heading: 'Product',
    links: [
      { href: 'https://docs.tryvex.dev', label: 'Docs' },
      { href: 'https://github.com/Vex-AI-Dev/Python-SDK', label: 'GitHub' },
      { href: 'https://api.tryvex.dev', label: 'API' },
      { href: 'https://x.com/tryvex', label: 'Twitter / X' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: 'https://oppla.ai', label: 'About' },
      { href: 'mailto:info@tryvex.dev', label: 'info@tryvex.dev' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
];

export function SiteFooter() {
  return (
    <Footer
      logo={<AppLogo href="/" />}
      description="Runtime reliability for AI agents in production."
      copyright={
        <>
          &copy; {new Date().getFullYear()} Vex. Built by the team behind
          Oppla.ai &amp; IMQA.
        </>
      }
      sections={sections}
    />
  );
}
