'use client';

import UsernameProfileContent from 'apps/web/src/components/Unstablenames/UsernameProfileContent';
import UsernameProfileSidebar from 'apps/web/src/components/Unstablenames/UsernameProfileSidebar';
import UsernameProfileSettings from 'apps/web/src/components/Unstablenames/UsernameProfileSettings';
import { useUsernameProfile } from 'apps/web/src/components/Unstablenames/UsernameProfileContext';
import UsernameProfileSettingsProvider from 'apps/web/src/components/Unstablenames/UsernameProfileSettingsContext';
import { useUnstablenameExpirationBanner } from 'apps/web/src/hooks/useUnstablenameExpirationBanner';

export default function UsernameProfile() {
  const { showProfileSettings } = useUsernameProfile();
  const { expirationBanner } = useUnstablenameExpirationBanner();

  if (showProfileSettings)
    return (
      <UsernameProfileSettingsProvider>
        <UsernameProfileSettings />
      </UsernameProfileSettingsProvider>
    );

  return (
    <>
      {expirationBanner}
      <div className="flex flex-col items-center gap-10">
        <div className="mx-auto grid min-h-screen grid-cols-1 gap-10 md:grid-cols-[25rem_minmax(0,1fr)]">
          <div className="w-full">
            <UsernameProfileSidebar />
          </div>
          <div className="w-full">
            <UsernameProfileContent />
          </div>
        </div>
        <span className="mt-24">
          Content displayed on this profile page is rendered directly from the decentralized
          Unstablenames protocol, and is not maintained or moderated by, nor under the control of,
          TheAlxLabs.
        </span>
      </div>
    </>
  );
}
