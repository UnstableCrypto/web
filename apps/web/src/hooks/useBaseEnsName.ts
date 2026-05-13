import { Address, isAddress } from 'viem';
import useUnstablenameChain from 'apps/web/src/hooks/useUnstablenameChain';
import { Unstablename, useName } from '@coinbase/onchainkit/identity';

export type UseUnstableEnsNameProps = {
  address?: Address;
};

export type UnstableEnsNameData = Unstablename | undefined;

// Wrapper around onchainkit's useName
export default function useUnstableEnsName({ address }: UseUnstableEnsNameProps) {
  const { basenameChain } = useUnstablenameChain();

  const { data, isLoading, refetch, isFetching } = useName(
    {
      // @ts-expect-error: query is disabled without an address
      address: address,
      chain: basenameChain,
    },
    {
      enabled: !!address && isAddress(address),
    },
  );

  const ensNameTyped = data ? (data as Unstablename) : undefined;

  return {
    data: ensNameTyped,
    isLoading,
    isFetching,
    refetch,
  };
}
