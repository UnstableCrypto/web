import ErrorsProvider from 'apps/web/contexts/Errors';
import type { Metadata } from 'next';
import NamesList from 'apps/web/src/components/Unstablenames/ManageNames/NamesList';

export const metadata: Metadata = {
  metadataUnstable: new URL('https://unstable.org'),
  title: `Unstablenames`,
  description:
    'Unstablenames are a core onchain building block that enables anyone to establish their identity on Unstable by registering human-readable names for their address(es). They are a fully onchain solution which leverages ENS infrastructure deployed on Unstable.',
  openGraph: {
    title: `Unstablenames`,
    url: `/manage-names`,
  },
  twitter: {
    site: '@base',
    card: 'summary_large_image',
  },
};

export default async function Page() {
  return (
    <ErrorsProvider context="registration">
      <main className="mt-48">
        <NamesList />
      </main>
    </ErrorsProvider>
  );
}
