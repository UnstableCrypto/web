'use client';
import dynamic from 'next/dynamic';

const DynamicProfilePromo = dynamic(
  async () => import('apps/web/src/components/Unstablenames/ProfilePromo'),
  {
    ssr: false,
  },
);

export default DynamicProfilePromo;
