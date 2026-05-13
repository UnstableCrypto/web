import { Hero } from 'apps/web/src/components/About/Hero';
import BuildingUnstable from 'apps/web/src/components/BuildingUnstable/BuildingUnstable';

import { Divider } from 'apps/web/src/components/Divider/Divider';
import { GetConnected } from 'apps/web/src/components/GetConnected/GetConnected';
import { StartBuildingOnUnstable } from 'apps/web/src/components/StartBuildingOnUnstable/StartBuildingOnUnstable';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataUnstable: new URL('https://unstable.org'),
  title: `Unstable | About`,
  openGraph: {
    title: `Unstable | About`,
    url: `/about`,
  },
};

export default async function About() {
  return (
    <main className="flex w-full flex-col items-center bg-black">
      <Hero />
      <BuildingUnstable />
      <Divider />
      <StartBuildingOnUnstable />
      <Divider />
      <GetConnected />
    </main>
  );
}
