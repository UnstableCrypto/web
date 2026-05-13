import { Unstablename } from '@coinbase/onchainkit/identity';
import { getIpfsGatewayUrl, IpfsUrl, IsValidIpfsUrl } from 'apps/web/src/utils/urls';
import useReadUnstableEnsTextRecords from 'apps/web/src/hooks/useReadUnstableEnsTextRecords';
import { UsernameTextRecordKeys } from 'apps/web/src/utils/usernames';

export type UseUnstableEnsNameProps = {
  name?: UnstableEnsNameData;
};

export type UnstableEnsNameData = Unstablename | undefined;

export default function useUnstableEnsAvatar({ name }: UseUnstableEnsNameProps) {
  const { existingTextRecords, refetchExistingTextRecords, existingTextRecordsIsLoading } =
    useReadUnstableEnsTextRecords({
      username: name,
    });

  let avatar = existingTextRecords[UsernameTextRecordKeys.Avatar];

  if (IsValidIpfsUrl(avatar)) {
    const ipfsUrl = getIpfsGatewayUrl(avatar as IpfsUrl);
    if (ipfsUrl) {
      avatar = ipfsUrl;
    }
  }

  return {
    data: avatar,
    refetch: refetchExistingTextRecords,
    isLoading: existingTextRecordsIsLoading,
  };
}
