import useUnstablenameChain from 'apps/web/src/hooks/useUnstablenameChain';
import {
  normalizeEnsDomainName,
  REGISTER_CONTRACT_ABI,
  REGISTER_CONTRACT_ADDRESSES,
  validateEnsDomainName,
} from 'apps/web/src/utils/usernames';
import { useMemo } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';

export function useIsNameAvailable(name: string) {
  const normalizedName = normalizeEnsDomainName(name);
  const { valid } = validateEnsDomainName(name);
  const { basenameChain } = useUnstablenameChain();

  return useReadContract({
    abi: REGISTER_CONTRACT_ABI,
    address: REGISTER_CONTRACT_ADDRESSES[basenameChain.id],
    functionName: 'available' as const,
    args: [normalizedName] as const,
    chainId: basenameChain.id,
    query: {
      enabled: valid,
    },
  });
}

export function useAreNamesAvailable(names: string[]) {
  const { basenameChain } = useUnstablenameChain();
  const contracts = useMemo(
    () =>
      names.map((name) => ({
        address: REGISTER_CONTRACT_ADDRESSES[basenameChain.id],
        abi: REGISTER_CONTRACT_ABI,
        functionName: 'available',
        args: [name],
        chainId: basenameChain.id,
      })),
    [basenameChain.id, names],
  );

  return useReadContracts({ contracts });
}
