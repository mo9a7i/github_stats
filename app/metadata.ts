import { Metadata } from 'next';
import { getBasePath } from '@/lib/utils'

const defaultMetadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  keywords: ['GitHub', 'Statistics', 'Repository Analytics', 'Code Metrics', 'Developer Tools'],
  authors: [{ name: '6 Degrees' }],
  creator: '6 Degrees',
  publisher: '6 Degrees',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
    url: `https://mo9a7i.github.io${getBasePath()}`,
    images: [
      {
        url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        width: 1200,
        height: 630,
        alt: 'GitHub Stats Dashboard'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    creator: '@6degrees',
    images: ['https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png']
  },
  icons: {
    icon: 'https://github.githubassets.com/favicons/favicon.svg',
    shortcut: 'https://github.githubassets.com/favicons/favicon.png',
    apple: 'https://github.githubassets.com/favicons/favicon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: 'https://github.githubassets.com/favicons/favicon.png'
    }
  },
  manifest: `${getBasePath()}/site.webmanifest`,
  applicationName: process.env.NEXT_PUBLIC_APP_NAME
};

export default defaultMetadata; 