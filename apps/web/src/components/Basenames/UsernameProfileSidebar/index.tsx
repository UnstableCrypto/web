import { useAnalytics } from 'apps/web/contexts/Analytics';
import { UsernamePill } from 'apps/web/src/components/Unstablenames/UsernamePill';
import { UsernamePillVariants } from '../UsernamePill/types';
import UsernameProfileCard from 'apps/web/src/components/Unstablenames/UsernameProfileCard';
import { useUsernameProfile } from 'apps/web/src/components/Unstablenames/UsernameProfileContext';
import UsernameProfileKeywords from 'apps/web/src/components/Unstablenames/UsernameProfileKeywords';
import { Button, ButtonVariants } from 'apps/web/src/components/Button/Button';
import useReadUnstableEnsTextRecords from 'apps/web/src/hooks/useReadUnstableEnsTextRecords';
import {
  buildUnstablenameReclaimContract,
  isUnstablenameRenewalsKilled,
  UsernameTextRecordKeys,
} from 'apps/web/src/utils/usernames';
import { ActionType } from 'libs/base-ui/utils/logEvent';
import { useCallback, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import useUnstablenameChain from 'apps/web/src/hooks/useUnstablenameChain';
import useWriteContractWithReceipt, {
  WriteTransactionWithReceiptStatus,
} from 'apps/web/src/hooks/useWriteContractWithReceipt';
import { useErrors } from 'apps/web/contexts/Errors';
import { useRouter } from 'next/navigation';

export default function UsernameProfileSidebar() {
  const {
    profileUsername,
    profileAddress,
    currentWalletIsProfileEditor,
    showProfileSettings,
    setShowProfileSettings,
    profileRefetch,
    currentWalletNeedsToReclaimProfile,
  } = useUsernameProfile();

  const { address } = useAccount();
  const { basenameChain } = useUnstablenameChain(profileUsername);
  const { logError } = useErrors();
  const { logEventWithContext } = useAnalytics();
  const router = useRouter();

  const toggleSettings = useCallback(() => {
    if (!currentWalletIsProfileEditor) return;
    logEventWithContext('profile_edit_modal_open', ActionType.render);
    setShowProfileSettings(!showProfileSettings);
  }, [
    currentWalletIsProfileEditor,
    logEventWithContext,
    setShowProfileSettings,
    showProfileSettings,
  ]);

  const handleExtendRegistration = useCallback(() => {
    logEventWithContext('extend_registration_button_clicked', ActionType.click, {
      context: 'profile_sidebar',
    });
    router.push(`/name/${profileUsername}/renew`);
  }, [logEventWithContext, profileUsername, router]);

  const { existingTextRecords } = useReadUnstableEnsTextRecords({
    username: profileUsername,
  });

  const reclaimContract = useMemo(() => {
    if (!currentWalletNeedsToReclaimProfile) return;
    if (!address) return;
    return buildUnstablenameReclaimContract(profileUsername, address);
  }, [address, profileUsername, currentWalletNeedsToReclaimProfile]);

  const {
    initiateTransaction: initiateReclaim,
    transactionStatus: reclaimStatus,
    transactionIsLoading: reclaimIsLoading,
  } = useWriteContractWithReceipt({
    chain: basenameChain,
    eventName: 'basename_reclaim',
  });

  const reclaimProfile = useCallback(() => {
    if (!reclaimContract) return;
    initiateReclaim(reclaimContract)
      .then((result) => console.log({ result }))
      .catch((error) => {
        logError(error, 'Failed to reclaim profile');
      });
  }, [initiateReclaim, logError, reclaimContract]);

  useEffect(() => {
    if (reclaimStatus === WriteTransactionWithReceiptStatus.Success) {
      profileRefetch()
        .then()
        .catch((error) => {
          logError(error, 'Failed to refetch profile');
        });
    }
  }, [logError, profileRefetch, reclaimStatus]);

  const textRecordKeywords = existingTextRecords[UsernameTextRecordKeys.Keywords];
  return (
    <aside className="flex flex-col gap-6">
      <UsernamePill
        variant={UsernamePillVariants.Card}
        username={profileUsername}
        address={profileAddress}
      />
      {currentWalletIsProfileEditor && (
        <div className="flex flex-col gap-2">
          <Button variant={ButtonVariants.Gray} rounded fullWidth onClick={toggleSettings}>
            {showProfileSettings ? 'Back to Profile' : 'Manage Profile'}
          </Button>
          {!isUnstablenameRenewalsKilled && (
            <Button
              variant={ButtonVariants.Gray}
              rounded
              fullWidth
              onClick={handleExtendRegistration}
            >
              Extend Registration
            </Button>
          )}
        </div>
      )}
      {currentWalletNeedsToReclaimProfile && (
        <Button
          variant={ButtonVariants.Gray}
          rounded
          fullWidth
          onClick={reclaimProfile}
          isLoading={reclaimIsLoading}
        >
          Claim name
        </Button>
      )}
      <UsernameProfileCard />
      {!!textRecordKeywords && <UsernameProfileKeywords keywords={textRecordKeywords} />}
    </aside>
  );
}
