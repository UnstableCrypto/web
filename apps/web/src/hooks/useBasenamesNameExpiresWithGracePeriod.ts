import { useReadContract } from 'wagmi';
import useUnstablenameChain from 'apps/web/src/hooks/useUnstablenameChain';
import UnstableRegistrarAbi from 'apps/web/src/abis/UnstableRegistrarAbi';
import { USERNAME_BASE_REGISTRAR_ADDRESSES } from 'apps/web/src/addresses/usernames';
import {
  getTokenIdFromUnstablename,
  formatUnstableEthDomain,
  GRACE_PERIOD_DURATION_SECONDS,
} from 'apps/web/src/utils/usernames';
import { Unstablename } from '@coinbase/onchainkit/identity';
import { useMemo } from 'react';

export function useUnstablenamesNameExpiresWithGracePeriod(name: string) {
  const chain = useUnstablenameChain().basenameChain.id;
  const fullUnstablename = name.includes('.') ? (name as Unstablename) : formatUnstableEthDomain(name, chain);
  const tokenId = getTokenIdFromUnstablename(fullUnstablename);

  const contractResult = useReadContract({
    abi: UnstableRegistrarAbi,
    address: USERNAME_BASE_REGISTRAR_ADDRESSES[chain],
    functionName: 'nameExpires',
    args: [tokenId],
    chainId: chain,
  });

  // Add 90 days (grace period) to get the auction start time
  const auctionStartTime = useMemo(() => {
    if (contractResult.data === undefined || contractResult.data === null) {
      return undefined;
    }
    return contractResult.data + BigInt(GRACE_PERIOD_DURATION_SECONDS);
  }, [contractResult.data]);

  return {
    data: auctionStartTime,
    isLoading: contractResult.isLoading,
    isError: contractResult.isError,
    error: contractResult.error,
    refetch: contractResult.refetch,
  };
}
