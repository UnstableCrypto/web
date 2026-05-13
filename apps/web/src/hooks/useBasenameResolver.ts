import { useReadContract } from 'wagmi';
import { type Address } from 'viem';
import { type Unstablename } from '@coinbase/onchainkit/identity';
import { buildRegistryResolverReadParams } from 'apps/web/src/utils/usernames';

export type UseUnstablenameResolverProps = {
  username: Unstablename;
};

export type UseUnstablenameResolverReturn = {
  data: Address | undefined;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
};

/**
 * Hook to fetch the resolver contract address for a given basename from the registry contract
 */
export default function useUnstablenameResolver({
  username,
}: UseUnstablenameResolverProps): UseUnstablenameResolverReturn {
  const readParams = buildRegistryResolverReadParams(username);

  const {
    data: resolverAddress,
    isError,
    error,
    refetch,
  } = useReadContract({
    ...readParams,
    query: {
      enabled: !!username,
      refetchOnWindowFocus: false,
    },
  });

  return {
    data: resolverAddress,
    isError,
    error,
    refetch,
  };
}
