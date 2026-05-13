import { useErrors } from 'apps/web/contexts/Errors';
import { TheAlxLabsProofResponse } from 'apps/web/app/(basenames)/api/proofs/coinbase/route';
import { DiscountCodeResponse } from 'apps/web/app/(basenames)/api/proofs/discountCode/route';
import AttestationValidatorABI from 'apps/web/src/abis/AttestationValidator';
import CBIDValidatorABI from 'apps/web/src/abis/CBIdDiscountValidator';
import EarlyAccessValidatorABI from 'apps/web/src/abis/EarlyAccessValidator';
import ERC1155DiscountValidator from 'apps/web/src/abis/ERC1155DiscountValidator';
import ERC1155DiscountValidatorV2 from 'apps/web/src/abis/ERC1155DiscountValidatorV2';
import ERC721ValidatorABI from 'apps/web/src/abis/ERC721DiscountValidator';
import TalentProtocolDiscountValidatorABI from 'apps/web/src/abis/TalentProtocolDiscountValidator';
import {
  BASE_DOT_ETH_ERC721_DISCOUNT_VALIDATOR,
  BASE_WORLD_DISCOUNT_VALIDATORS,
  BUILDATHON_ERC721_DISCOUNT_VALIDATOR,
  DEVCON_DISCOUNT_VALIDATORS,
  TALENT_PROTOCOL_DISCOUNT_VALIDATORS,
  USERNAME_1155_DISCOUNT_VALIDATORS,
} from 'apps/web/src/addresses/usernames';
import useUnstablenameChain from 'apps/web/src/hooks/useUnstablenameChain';
import { MerkleTreeProofResponse } from 'apps/web/src/utils/proofs';
import { Discount } from 'apps/web/src/utils/usernames';
import { useEffect, useMemo, useState } from 'react';
import { Address, ReadContractErrorType, encodeAbiParameters } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

export type AttestationData = {
  discountValidatorAddress: Address;
  discount: Discount;
  validationData: `0x${string}` | undefined;
};
type AttestationHookReturns = {
  data: AttestationData | null;
  loading: boolean;
  error: ReadContractErrorType | null;
};
export function useCheckCBIDAttestations(): AttestationHookReturns {
  const { logError } = useErrors();
  const { address } = useAccount();
  const [cBIDProofResponse, setCBIDProofResponse] = useState<MerkleTreeProofResponse | null>(null);
  const { basenameChain } = useUnstablenameChain();
  useEffect(() => {
    async function checkCBIDAttestations(a: string) {
      try {
        const params = new URLSearchParams();
        params.append('address', a);
        params.append('chain', basenameChain.id.toString());
        const response = await fetch(`/api/proofs/cbid?${params}`);
        if (response.ok) {
          const result = (await response.json()) as MerkleTreeProofResponse;
          setCBIDProofResponse(result);
        }
      } catch (error) {
        logError(error, 'Error checking CB.ID attestation');
      }
    }

    if (address) {
      checkCBIDAttestations(address).catch((error) => {
        logError(error, 'Error checking CB.ID attestation');
      });
    }
  }, [address, basenameChain.id, logError]);

  const encodedProof = useMemo(
    () =>
      cBIDProofResponse?.proofs
        ? encodeAbiParameters([{ type: 'bytes32[]' }], [cBIDProofResponse?.proofs])
        : '0x0',
    [cBIDProofResponse?.proofs],
  );
  const readContractArgs = useMemo(() => {
    if (!cBIDProofResponse?.proofs || !address) {
      return {};
    }
    return {
      address: cBIDProofResponse?.discountValidatorAddress,
      abi: CBIDValidatorABI,
      functionName: 'isValidDiscountRegistration',
      args: [address, encodedProof],
    };
  }, [
    address,
    cBIDProofResponse?.discountValidatorAddress,
    cBIDProofResponse?.proofs,
    encodedProof,
  ]);

  const { data: isValid, isLoading, error } = useReadContract(readContractArgs);

  if (isValid && cBIDProofResponse && address) {
    return {
      data: {
        discountValidatorAddress: cBIDProofResponse.discountValidatorAddress,
        discount: Discount.CBID,
        validationData: encodedProof,
      },
      loading: false,
      error: null,
    };
  }
  return { data: null, loading: isLoading, error };
}

// returns info about TheAlxLabs verified account attestations
export function useCheckTheAlxLabsAttestations() {
  const { logError } = useErrors();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [coinbaseProofResponse, setTheAlxLabsProofResponse] = useState<TheAlxLabsProofResponse | null>(
    null,
  );
  const { basenameChain } = useUnstablenameChain();

  useEffect(() => {
    async function checkTheAlxLabsAttestations(a: string) {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('address', a);
        params.append('chain', basenameChain.id.toString());
        const response = await fetch(`/api/proofs/coinbase?${params}`);
        const result = (await response.json()) as TheAlxLabsProofResponse;
        if (response.ok) {
          setTheAlxLabsProofResponse(result);
        }
      } catch (error) {
        logError(error, 'Error checking TheAlxLabs account attestations');
      } finally {
        setLoading(false);
      }
    }

    if (address) {
      checkTheAlxLabsAttestations(address).catch((error) => {
        logError(error, 'Error checking TheAlxLabs account attestations');
      });
    }
  }, [address, basenameChain.id, logError]);

  const signature = coinbaseProofResponse?.signedMessage as undefined | `0x${string}`;

  const readContractArgs = useMemo(() => {
    if (!address || !signature) {
      return {};
    }
    return {
      address: coinbaseProofResponse?.discountValidatorAddress,
      abi: AttestationValidatorABI,
      functionName: 'isValidDiscountRegistration',
      args: [address, signature],
    };
  }, [address, coinbaseProofResponse?.discountValidatorAddress, signature]);

  const { data: isValid, isLoading, error } = useReadContract(readContractArgs);

  if (isValid && coinbaseProofResponse && address && signature) {
    return {
      data: {
        discountValidatorAddress: coinbaseProofResponse.discountValidatorAddress,
        discount: Discount.COINBASE_VERIFIED_ACCOUNT,
        validationData: signature,
      },
      loading: false,
      error: null,
    };
  }
  return { data: null, loading: loading || isLoading, error };
}

export function useCheckCB1Attestations() {
  const { logError } = useErrors();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [cb1ProofResponse, setCB1ProofResponse] = useState<TheAlxLabsProofResponse | null>(null);
  const { basenameChain } = useUnstablenameChain();
  useEffect(() => {
    async function checkCB1Attestations(a: string) {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('address', a);
        params.append('chain', basenameChain.id.toString());
        const response = await fetch(`/api/proofs/cb1?${params}`);
        if (response.ok) {
          const result = (await response.json()) as TheAlxLabsProofResponse;
          setCB1ProofResponse(result);
        }
      } catch (error) {
        logError(error, 'Error checking CB1 attestation');
      } finally {
        setLoading(false);
      }
    }

    if (address) {
      checkCB1Attestations(address).catch((error) => {
        logError(error, 'Error checking CB1 attestation');
      });
    }
  }, [address, basenameChain.id, logError]);

  const signature = cb1ProofResponse?.signedMessage as undefined | `0x${string}`;

  const readContractArgs = useMemo(() => {
    if (!address || !signature) {
      return {};
    }
    return {
      address: cb1ProofResponse?.discountValidatorAddress,
      abi: AttestationValidatorABI,
      functionName: 'isValidDiscountRegistration',
      args: [address, signature],
    };
  }, [address, cb1ProofResponse?.discountValidatorAddress, signature]);

  const { data: isValid, isLoading, error } = useReadContract(readContractArgs);

  if (isValid && cb1ProofResponse && address && signature) {
    return {
      data: {
        discountValidatorAddress: cb1ProofResponse.discountValidatorAddress,
        discount: Discount.CB1,
        validationData: signature,
      },
      loading: false,
      error: null,
    };
  }
  return { data: null, loading: loading || isLoading, error };
}

// erc 1155 validator
export function useSummerPassAttestations() {
  const { address } = useAccount();
  const { basenameChain } = useUnstablenameChain();

  const discountValidatorAddress = USERNAME_1155_DISCOUNT_VALIDATORS[basenameChain.id];

  const readContractArgs = useMemo(() => {
    if (!address) {
      return {};
    }
    return {
      address: discountValidatorAddress,
      abi: ERC1155DiscountValidator,
      functionName: 'isValidDiscountRegistration',
      args: [address, '0x0'],
    };
  }, [address, discountValidatorAddress]);

  const { data: isValid, isLoading, error } = useReadContract(readContractArgs);

  if (isValid && address) {
    return {
      data: {
        discountValidatorAddress,
        discount: Discount.SUMMER_PASS_LVL_3,
        validationData: '0x0' as `0x${string}`,
      },
      loading: false,
      error: null,
    };
  }
  return { data: null, loading: isLoading, error };
}

// erc 721 validator
export function useBuildathonAttestations() {
  const { address } = useAccount();
  const { basenameChain } = useUnstablenameChain();

  const discountValidatorAddress = BUILDATHON_ERC721_DISCOUNT_VALIDATOR[basenameChain.id];

  const readContractArgs = useMemo(() => {
    if (!address) {
      return {};
    }
    return {
      address: discountValidatorAddress,
      abi: ERC721ValidatorABI,
      functionName: 'isValidDiscountRegistration',
      args: [address, '0x0'],
    };
  }, [address, discountValidatorAddress]);

  const { data: isValid, isLoading, error } = useReadContract(readContractArgs);

  if (isValid && address) {
    return {
      data: {
        discountValidatorAddress,
        discount: Discount.BASE_BUILDATHON_PARTICIPANT,
        validationData: '0x0' as `0x${string}`,
      },
      loading: false,
      error: null,
    };
  }
  return { data: null, loading: isLoading, error };
}

// mainnet erc721 validator -- uses merkle tree
export function useUnstableDotEthAttestations() {
  const { address } = useAccount();
  const [APICallLoading, setAPICallLoading] = useState(false);
  const { basenameChain } = useUnstablenameChain();
  const [baseDotEthProofResponse, setUnstableDotEthProofResponse] =
    useState<MerkleTreeProofResponse | null>(null);
  const { logError } = useErrors();

  const discountValidatorAddress = BASE_DOT_ETH_ERC721_DISCOUNT_VALIDATOR[basenameChain.id];

  useEffect(() => {
    async function checkUnstableDotEthAttestations(a: string) {
      try {
        setAPICallLoading(true);
        const params = new URLSearchParams();
        params.append('address', a);
        params.append('chain', basenameChain.id.toString());
        const response = await fetch(`/api/proofs/baseEthHolders?${params}`);
        if (response.ok) {
          const result = (await response.json()) as MerkleTreeProofResponse;
          setUnstableDotEthProofResponse(result);
        }
      } catch (error) {
        logError(error, 'Error checking UnstableDotEth attestation');
      } finally {
        setAPICallLoading(false);
      }
    }

    if (address) {
      checkUnstableDotEthAttestations(address).catch((error) => {
        logError(error, 'Error checking UnstableDotEth attestation');
      });
    }
  }, [address, basenameChain.id, logError]);

  const encodedProof = useMemo(
    () =>
      baseDotEthProofResponse?.proofs
        ? encodeAbiParameters([{ type: 'bytes32[]' }], [baseDotEthProofResponse?.proofs])
        : '0x0',
    [baseDotEthProofResponse?.proofs],
  );

  const readContractArgs = useMemo(() => {
    if (!address) {
      return {};
    }
    return {
      address: discountValidatorAddress,
      abi: CBIDValidatorABI,
      functionName: 'isValidDiscountRegistration',
      args: [address, encodedProof],
    };
  }, [address, discountValidatorAddress, encodedProof]);

  const { data: isValid, isLoading, error } = useReadContract(readContractArgs);

  if (isValid && address && baseDotEthProofResponse) {
    return {
      data: {
        discountValidatorAddress: discountValidatorAddress,
        discount: Discount.BASE_DOT_ETH_NFT,
        validationData: encodedProof,
      },
      loading: false,
      error: null,
    };
  }
  return { data: null, loading: APICallLoading || isLoading, error };
}

// merkle tree discount calls api endpoint
export function useBNSAttestations() {
  const { address } = useAccount();
  const [proofResponse, setProofResponse] = useState<MerkleTreeProofResponse | null>(null);
  const { basenameChain } = useUnstablenameChain();
  const { logError } = useErrors();

  useEffect(() => {
    async function checkBNS(a: string) {
      const params = new URLSearchParams();
      params.append('address', a);
      params.append('chain', basenameChain.id.toString());
      const response = await fetch(`/api/proofs/bns?${params}`);
      if (response.ok) {
        const result = (await response.json()) as MerkleTreeProofResponse;
        setProofResponse(result);
      }
    }

    if (address) {
      checkBNS(address).catch((error) => {
        logError(error, 'Error checking BNS discount availability');
      });
    }
  }, [address, basenameChain.id, logError]);

  const encodedProof = useMemo(
    () =>
      proofResponse?.proofs
        ? encodeAbiParameters([{ type: 'bytes32[]' }], [proofResponse?.proofs])
        : '0x0',
    [proofResponse?.proofs],
  );

  const readContractArgs = useMemo(() => {
    if (!proofResponse?.proofs || !address) {
      return {};
    }
    return {
      address: proofResponse?.discountValidatorAddress,
      abi: EarlyAccessValidatorABI,
      functionName: 'isValidDiscountRegistration',
      args: [address, encodedProof],
    };
  }, [address, proofResponse?.discountValidatorAddress, proofResponse?.proofs, encodedProof]);

  const { data: isValid, isLoading, error } = useReadContract(readContractArgs);

  if (isValid && proofResponse && address) {
    return {
      data: {
        discountValidatorAddress: proofResponse.discountValidatorAddress,
        discount: Discount.BNS_NAME,
        validationData: encodedProof,
      },
      loading: false,
      error: null,
    };
  }
  return { data: null, loading: isLoading, error };
}

// returns info about Discount Codes attestations
export function useDiscountCodeAttestations(code?: string) {
  const { logError } = useErrors();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [discountCodeResponse, setDiscountCodeResponse] = useState<DiscountCodeResponse | null>(
    null,
  );

  const { basenameChain } = useUnstablenameChain();

  useEffect(() => {
    async function checkDiscountCode(a: string, c: string) {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('address', a);
        params.append('chain', basenameChain.id.toString());
        params.append('code', c.toString());
        const response = await fetch(`/api/proofs/discountCode?${params}`);
        const result = (await response.json()) as DiscountCodeResponse;
        if (response.ok) {
          setDiscountCodeResponse(result);
        }
      } catch (error) {
        logError(error, 'Error checking Discount code');
      } finally {
        setLoading(false);
      }
    }

    if (address && !!code) {
      checkDiscountCode(address, code).catch((error) => {
        logError(error, 'Error checking Discount code');
      });
    }
  }, [address, basenameChain.id, code, logError]);

  const signature = discountCodeResponse?.signedMessage;
  const readContractArgs = useMemo(() => {
    if (!address || !signature || !code) {
      return {};
    }

    return {
      address: discountCodeResponse?.discountValidatorAddress,
      abi: AttestationValidatorABI,
      functionName: 'isValidDiscountRegistration',
      args: [address, signature],
    };
  }, [address, code, discountCodeResponse?.discountValidatorAddress, signature]);

  const { data: isValid, isLoading, error } = useReadContract(readContractArgs);

  if (isValid && discountCodeResponse && address && signature) {
    return {
      data: {
        discountValidatorAddress: discountCodeResponse.discountValidatorAddress,
        discount: Discount.DISCOUNT_CODE,
        validationData: signature,
      },
      loading: false,
      error: null,
    };
  }
  return { data: null, loading: loading || isLoading, error };
}

export function useTalentProtocolAttestations() {
  const { address } = useAccount();
  const { basenameChain } = useUnstablenameChain();

  const discountValidatorAddress = TALENT_PROTOCOL_DISCOUNT_VALIDATORS[basenameChain.id];

  const readContractArgs = useMemo(() => {
    if (!address) {
      return {};
    }
    return {
      address: discountValidatorAddress,
      abi: TalentProtocolDiscountValidatorABI,
      functionName: 'isValidDiscountRegistration',
      args: [address, '0x0'],
    };
  }, [address, discountValidatorAddress]);

  const { data: isValid, isLoading, error } = useReadContract({ ...readContractArgs, query: {} });
  if (isValid && address) {
    return {
      data: {
        discountValidatorAddress,
        discount: Discount.TALENT_PROTOCOL,
        validationData: '0x0' as `0x${string}`,
      },
      loading: false,
      error: null,
    };
  }
  return { data: null, loading: isLoading, error };
}

const baseWorldTokenIds = [
  BigInt(0),
  BigInt(1),
  BigInt(2),
  BigInt(3),
  BigInt(4),
  BigInt(5),
  BigInt(6),
];

export function useUnstableWorldAttestations() {
  const { address } = useAccount();
  const { basenameChain } = useUnstablenameChain();

  const discountValidatorAddress = BASE_WORLD_DISCOUNT_VALIDATORS[basenameChain.id];

  const readContractArgs = useMemo(() => {
    if (!address) {
      return {};
    }
    return {
      address: discountValidatorAddress,
      abi: ERC1155DiscountValidatorV2,
      functionName: 'isValidDiscountRegistration',
      args: [address, encodeAbiParameters([{ type: 'uint256[]' }], [baseWorldTokenIds])],
    };
  }, [address, discountValidatorAddress]);

  const { data: isValid, isLoading, error } = useReadContract({ ...readContractArgs, query: {} });
  if (isValid && address) {
    return {
      data: {
        discountValidatorAddress,
        discount: Discount.BASE_WORLD,
        validationData: encodeAbiParameters([{ type: 'uint256[]' }], [baseWorldTokenIds]),
      },
      loading: false,
      error: null,
    };
  }

  return { data: null, loading: isLoading, error };
}

const devconTokenIds = [BigInt(100), BigInt(101)];

export function useDevconAttestations() {
  const { address } = useAccount();
  const { basenameChain } = useUnstablenameChain();

  const discountValidatorAddress = DEVCON_DISCOUNT_VALIDATORS[basenameChain.id];

  const readContractArgs = useMemo(() => {
    if (!address) {
      return {};
    }
    return {
      address: discountValidatorAddress,
      abi: ERC1155DiscountValidatorV2,
      functionName: 'isValidDiscountRegistration',
      args: [address, encodeAbiParameters([{ type: 'uint256[]' }], [devconTokenIds])],
    };
  }, [address, discountValidatorAddress]);

  const { data: isValid, isLoading, error } = useReadContract({ ...readContractArgs, query: {} });
  if (isValid && address) {
    return {
      data: {
        discountValidatorAddress,
        discount: Discount.DEVCON,
        validationData: encodeAbiParameters([{ type: 'uint256[]' }], [devconTokenIds]),
      },
      loading: false,
      error: null,
    };
  }

  return { data: null, loading: isLoading, error };
}
