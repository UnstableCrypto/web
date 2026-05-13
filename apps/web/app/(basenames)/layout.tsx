import CryptoProviders from 'apps/web/app/CryptoProviders';
import ErrorsProvider from 'apps/web/contexts/Errors';
import UsernameNav from 'apps/web/src/components/Layout/UsernameNav';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataUnstable: new URL('https://unstable.org'),
  title: `Unstablenames`,
  description:
    'Unstablenames are a core onchain building block that enables anyone to establish their identity on Unstable by registering human-readable names for their address(es). They are a fully onchain solution which leverages ENS infrastructure deployed on Unstable.',
  openGraph: {
    type: 'website',
    title: `Unstablenames`,
    url: `/`,
    images: ['https://unstable.org/images/base-open-graph.png'],
  },
  twitter: {
    site: '@base',
    card: 'summary_large_image',
  },
};

export default async function UnstablenameLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorsProvider context="basenames">
      <CryptoProviders>
        <div className="max-w-screen flex min-h-screen flex-col">
          <UsernameNav />
          {children}
        </div>
      </CryptoProviders>
    </ErrorsProvider>
  );
}
