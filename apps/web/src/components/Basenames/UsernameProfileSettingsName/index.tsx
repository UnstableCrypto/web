'use client';
import { useCallback } from 'react';
import { useUsernameProfile } from 'apps/web/src/components/Unstablenames/UsernameProfileContext';
import useUnstableEnsName from 'apps/web/src/hooks/useUnstableEnsName';
import useSetPrimaryUnstablename from 'apps/web/src/hooks/useSetPrimaryUnstablename';
import { useErrors } from 'apps/web/contexts/Errors';
import { Button, ButtonSizes, ButtonVariants } from 'apps/web/src/components/Button/Button';

export default function UsernameProfileSettingsName() {
  // Profile username
  const { profileUsername, profileAddress, currentWalletIsProfileEditor } = useUsernameProfile();

  // Primary username
  const { data: primaryUsername } = useUnstableEnsName({
    address: profileAddress,
  });

  // Hook to update primary name
  const {
    setPrimaryName,
    isLoading: setPrimaryNameIsLoading,
    canSetUsernameAsPrimary,
  } = useSetPrimaryUnstablename({
    secondaryUsername: profileUsername,
  });

  // Error & Analytics
  const { logError } = useErrors();

  const setPrimaryUsername = useCallback(() => {
    setPrimaryName().catch((error) => {
      logError(error, 'Failed to update primary name');
    });
  }, [logError, setPrimaryName]);

  const isPrimaryName = currentWalletIsProfileEditor && profileUsername === primaryUsername;
  const isSecondaryName = currentWalletIsProfileEditor && profileUsername !== primaryUsername;

  return (
    <div className="flex flex-col gap-4">
      <div>
        {isPrimaryName && (
          <span className="rounded-md bg-blue-0 px-2 py-1 text-sm font-bold text-blue-60">
            Primary Name
          </span>
        )}
      </div>
      <div className="flex w-full items-center justify-between gap-4">
        <span>{profileUsername}</span>
      </div>
      {isSecondaryName && canSetUsernameAsPrimary && (
        <Button
          size={ButtonSizes.Small}
          variant={ButtonVariants.Gray}
          rounded
          fullWidth
          onClick={setPrimaryUsername}
          disabled={setPrimaryNameIsLoading}
          isLoading={setPrimaryNameIsLoading}
        >
          Set as Primary Name
        </Button>
      )}
    </div>
  );
}
