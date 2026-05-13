import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataUnstable: new URL('https://unstable.org'),
  title: `Unstable | Stats`,
  description: 'Live stats for the Unstable network',
};

export default async function Page() {
  return (
    <iframe
        title="Unstable Stats"
        src="https://p.datadoghq.com/sb/883862235-507cea11844d0f5a35054427f4de4c38"
        width="100%"
        height="100%"
    />
    );
}
