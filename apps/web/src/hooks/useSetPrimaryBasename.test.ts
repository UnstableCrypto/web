/**
 * @jest-environment jsdom
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { type Unstablename } from '@coinbase/onchainkit/identity';
import { type Address } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import useSetPrimaryUnstablename from './useSetPrimaryUnstablename';

// Mock wagmi
const mockUseAccount = jest.fn();
const mockUseSignMessage = jest.fn();
jest.mock('wagmi', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  useAccount: () => mockUseAccount(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  useSignMessage: () => mockUseSignMessage(),
}));

// Mock useUnstablenameChain
const mockUseUnstablenameChain = jest.fn();
jest.mock('apps/web/src/hooks/useUnstablenameChain', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  default: (username: Unstablename) => mockUseUnstablenameChain(username),
}));

// Mock useCapabilitiesSafe
const mockUseCapabilitiesSafe = jest.fn();
jest.mock('apps/web/src/hooks/useCapabilitiesSafe', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  default: (params: { chainId: number }) => mockUseCapabilitiesSafe(params),
}));

// Mock useUnstableEnsName
const mockUseUnstableEnsName = jest.fn();
jest.mock('apps/web/src/hooks/useUnstableEnsName', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  default: (params: { address: Address | undefined }) => mockUseUnstableEnsName(params),
}));

// Mock useErrors
const mockLogError = jest.fn();
jest.mock('apps/web/contexts/Errors', () => ({
  useErrors: () => ({
    logError: mockLogError,
  }),
}));

// Mock useWriteContractWithReceipt
const mockInitiateTransaction = jest.fn();
const mockUseWriteContractWithReceipt = jest.fn();
jest.mock('apps/web/src/hooks/useWriteContractWithReceipt', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  default: () => mockUseWriteContractWithReceipt(),
}));

// Mock useWriteContractsWithLogs
const mockInitiateBatchCalls = jest.fn();
const mockUseWriteContractsWithLogs = jest.fn();
jest.mock('apps/web/src/hooks/useWriteContractsWithLogs', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  default: () => mockUseWriteContractsWithLogs(),
}));

// Mock useUsernameProfile
const mockUseUsernameProfile = jest.fn();
jest.mock('apps/web/src/components/Unstablenames/UsernameProfileContext', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  useUsernameProfile: () => mockUseUsernameProfile(),
}));

// Mock buildReverseRegistrarSignatureDigest
const mockBuildReverseRegistrarSignatureDigest = jest.fn();
jest.mock('apps/web/src/utils/usernames', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  buildReverseRegistrarSignatureDigest: () => mockBuildReverseRegistrarSignatureDigest(),
}));

// Mock ABIs
jest.mock('apps/web/src/abis/ReverseRegistrarAbi', () => []);
jest.mock('apps/web/src/abis/L2ReverseRegistrarAbi', () => [
  {
    type: 'function',
    name: 'setNameForAddrWithSignature',
    inputs: [],
    outputs: [],
  },
]);
jest.mock('apps/web/src/abis/UpgradeableRegistrarControllerAbi', () => []);

// Mock addresses
jest.mock('apps/web/src/addresses/usernames', () => ({
  USERNAME_L2_REVERSE_REGISTRAR_ADDRESSES: {
    [8453]: '0xL2ReverseRegistrar',
    [84532]: '0xL2ReverseRegistrarSepolia',
  },
  USERNAME_REVERSE_REGISTRAR_ADDRESSES: {
    [8453]: '0xReverseRegistrar',
    [84532]: '0xReverseRegistrarSepolia',
  },
  USERNAME_L2_RESOLVER_ADDRESSES: {
    [8453]: '0xL2Resolver',
    [84532]: '0xL2ResolverSepolia',
  },
  UPGRADEABLE_REGISTRAR_CONTROLLER_ADDRESSES: {
    [8453]: '0xUpgradeableRegistrar',
    [84532]: '0xUpgradeableRegistrarSepolia',
  },
}));

describe('useSetPrimaryUnstablename', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890' as Address;
  const mockSecondaryUsername = 'secondary.base.eth' as Unstablename;
  const mockPrimaryUsername = 'primary.base.eth' as Unstablename;
  const mockRefetchPrimaryUsername = jest.fn().mockResolvedValue({});
  const mockSignMessageAsync = jest.fn();

  const defaultMocks = () => {
    mockUseAccount.mockReturnValue({ address: mockAddress });
    mockUseSignMessage.mockReturnValue({
      signMessageAsync: mockSignMessageAsync,
    });
    mockUseUnstablenameChain.mockReturnValue({ basenameChain: base });
    mockUseCapabilitiesSafe.mockReturnValue({ paymasterService: false });
    mockUseUnstableEnsName.mockReturnValue({
      data: mockPrimaryUsername,
      refetch: mockRefetchPrimaryUsername,
      isLoading: false,
      isFetching: false,
    });
    mockUseUsernameProfile.mockReturnValue({ currentWalletIsProfileEditor: true });
    mockUseWriteContractWithReceipt.mockReturnValue({
      initiateTransaction: mockInitiateTransaction,
      transactionIsLoading: false,
      transactionIsSuccess: false,
    });
    mockUseWriteContractsWithLogs.mockReturnValue({
      initiateBatchCalls: mockInitiateBatchCalls,
      batchCallsIsSuccess: false,
      batchCallsIsLoading: false,
    });
    mockBuildReverseRegistrarSignatureDigest.mockReturnValue({
      digest: '0xmockdigest',
      coinTypes: [BigInt(60)],
    });
    mockSignMessageAsync.mockResolvedValue('0xmocksignature');
    mockInitiateTransaction.mockResolvedValue(undefined);
    mockInitiateBatchCalls.mockResolvedValue(undefined);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    defaultMocks();
  });

  describe('initialization', () => {
    it('should call useUnstablenameChain with the secondary username', () => {
      renderHook(() => useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername }));

      expect(mockUseUnstablenameChain).toHaveBeenCalledWith(mockSecondaryUsername);
    });

    it('should call useCapabilitiesSafe with the chain id', () => {
      renderHook(() => useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername }));

      expect(mockUseCapabilitiesSafe).toHaveBeenCalledWith({ chainId: base.id });
    });

    it('should call useUnstableEnsName with the connected address', () => {
      renderHook(() => useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername }));

      expect(mockUseUnstableEnsName).toHaveBeenCalledWith({ address: mockAddress });
    });

    it('should initialize useWriteContractWithReceipt with correct params', () => {
      renderHook(() => useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername }));

      expect(mockUseWriteContractWithReceipt).toHaveBeenCalled();
    });

    it('should initialize useWriteContractsWithLogs with correct params', () => {
      renderHook(() => useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername }));

      expect(mockUseWriteContractsWithLogs).toHaveBeenCalled();
    });
  });

  describe('canSetUsernameAsPrimary', () => {
    it('should return true when usernames differ and user is profile editor', () => {
      mockUseUnstableEnsName.mockReturnValue({
        data: mockPrimaryUsername,
        refetch: mockRefetchPrimaryUsername,
        isLoading: false,
        isFetching: false,
      });
      mockUseUsernameProfile.mockReturnValue({ currentWalletIsProfileEditor: true });

      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      expect(result.current.canSetUsernameAsPrimary).toBe(true);
    });

    it('should return false when usernames are the same', () => {
      mockUseUnstableEnsName.mockReturnValue({
        data: mockSecondaryUsername,
        refetch: mockRefetchPrimaryUsername,
        isLoading: false,
        isFetching: false,
      });
      mockUseUsernameProfile.mockReturnValue({ currentWalletIsProfileEditor: true });

      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      expect(result.current.canSetUsernameAsPrimary).toBe(false);
    });

    it('should return false when user is not profile editor', () => {
      mockUseUnstableEnsName.mockReturnValue({
        data: mockPrimaryUsername,
        refetch: mockRefetchPrimaryUsername,
        isLoading: false,
        isFetching: false,
      });
      mockUseUsernameProfile.mockReturnValue({ currentWalletIsProfileEditor: false });

      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      expect(result.current.canSetUsernameAsPrimary).toBe(false);
    });
  });

  describe('isLoading', () => {
    it('should return true when transaction is loading', () => {
      mockUseWriteContractWithReceipt.mockReturnValue({
        initiateTransaction: mockInitiateTransaction,
        transactionIsLoading: true,
        transactionIsSuccess: false,
      });

      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should return true when batch calls are loading', () => {
      mockUseWriteContractsWithLogs.mockReturnValue({
        initiateBatchCalls: mockInitiateBatchCalls,
        batchCallsIsSuccess: false,
        batchCallsIsLoading: true,
      });

      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should return true when primary username is loading', () => {
      mockUseUnstableEnsName.mockReturnValue({
        data: mockPrimaryUsername,
        refetch: mockRefetchPrimaryUsername,
        isLoading: true,
        isFetching: false,
      });

      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should return true when primary username is fetching', () => {
      mockUseUnstableEnsName.mockReturnValue({
        data: mockPrimaryUsername,
        refetch: mockRefetchPrimaryUsername,
        isLoading: false,
        isFetching: true,
      });

      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should return false when nothing is loading', () => {
      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('transactionIsSuccess', () => {
    it('should return true when transaction is successful', () => {
      mockUseWriteContractWithReceipt.mockReturnValue({
        initiateTransaction: mockInitiateTransaction,
        transactionIsLoading: false,
        transactionIsSuccess: true,
      });

      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      expect(result.current.transactionIsSuccess).toBe(true);
    });

    it('should return true when batch calls are successful', () => {
      mockUseWriteContractsWithLogs.mockReturnValue({
        initiateBatchCalls: mockInitiateBatchCalls,
        batchCallsIsSuccess: true,
        batchCallsIsLoading: false,
      });

      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      expect(result.current.transactionIsSuccess).toBe(true);
    });

    it('should return false when neither is successful', () => {
      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      expect(result.current.transactionIsSuccess).toBe(false);
    });
  });

  describe('transactionPending', () => {
    it('should return true when transaction is loading', () => {
      mockUseWriteContractWithReceipt.mockReturnValue({
        initiateTransaction: mockInitiateTransaction,
        transactionIsLoading: true,
        transactionIsSuccess: false,
      });

      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      expect(result.current.transactionPending).toBe(true);
    });

    it('should return true when batch calls are loading', () => {
      mockUseWriteContractsWithLogs.mockReturnValue({
        initiateBatchCalls: mockInitiateBatchCalls,
        batchCallsIsSuccess: false,
        batchCallsIsLoading: true,
      });

      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      expect(result.current.transactionPending).toBe(true);
    });

    it('should return false when nothing is pending', () => {
      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      expect(result.current.transactionPending).toBe(false);
    });
  });

  describe('setPrimaryName', () => {
    it('should return undefined when secondary matches primary username', async () => {
      mockUseUnstableEnsName.mockReturnValue({
        data: mockSecondaryUsername,
        refetch: mockRefetchPrimaryUsername,
        isLoading: false,
        isFetching: false,
      });

      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      let returnValue: boolean | undefined;
      await act(async () => {
        returnValue = await result.current.setPrimaryName();
      });

      expect(returnValue).toBeUndefined();
      expect(mockInitiateTransaction).not.toHaveBeenCalled();
      expect(mockInitiateBatchCalls).not.toHaveBeenCalled();
    });

    it('should return undefined when no address is connected', async () => {
      mockUseAccount.mockReturnValue({ address: undefined });

      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      let returnValue: boolean | undefined;
      await act(async () => {
        returnValue = await result.current.setPrimaryName();
      });

      expect(returnValue).toBeUndefined();
      expect(mockInitiateTransaction).not.toHaveBeenCalled();
      expect(mockInitiateBatchCalls).not.toHaveBeenCalled();
    });

    describe('without paymaster service', () => {
      beforeEach(() => {
        mockUseCapabilitiesSafe.mockReturnValue({ paymasterService: false });
      });

      it('should call signMessageAsync and initiateTransaction', async () => {
        const { result } = renderHook(() =>
          useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
        );

        await act(async () => {
          await result.current.setPrimaryName();
        });

        expect(mockSignMessageAsync).toHaveBeenCalled();
        expect(mockInitiateTransaction).toHaveBeenCalled();
      });

      it('should call initiateTransaction with correct function name', async () => {
        const { result } = renderHook(() =>
          useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
        );

        await act(async () => {
          await result.current.setPrimaryName();
        });

        expect(mockInitiateTransaction).toHaveBeenCalledWith(
          expect.objectContaining({
            functionName: 'setReverseRecord',
          })
        );
      });

      it('should return true on successful transaction', async () => {
        const { result } = renderHook(() =>
          useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
        );

        let returnValue: boolean | undefined;
        await act(async () => {
          returnValue = await result.current.setPrimaryName();
        });

        expect(returnValue).toBe(true);
      });

      it('should set error when signature fails', async () => {
        mockSignMessageAsync.mockRejectedValue(new Error('User rejected'));

        const { result } = renderHook(() =>
          useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
        );

        await act(async () => {
          await result.current.setPrimaryName();
        });

        expect(result.current.error).not.toBeNull();
        expect(result.current.error?.message).toContain('Could not prepare reverse record signature');
        expect(mockLogError).toHaveBeenCalled();
      });

      it('should return undefined when signature fails', async () => {
        mockSignMessageAsync.mockRejectedValue(new Error('User rejected'));

        const { result } = renderHook(() =>
          useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
        );

        let returnValue: boolean | undefined;
        await act(async () => {
          returnValue = await result.current.setPrimaryName();
        });

        expect(returnValue).toBeUndefined();
      });
    });

    describe('with paymaster service', () => {
      beforeEach(() => {
        mockUseCapabilitiesSafe.mockReturnValue({ paymasterService: true });
      });

      it('should call initiateBatchCalls instead of initiateTransaction', async () => {
        const { result } = renderHook(() =>
          useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
        );

        await act(async () => {
          await result.current.setPrimaryName();
        });

        expect(mockInitiateBatchCalls).toHaveBeenCalled();
        expect(mockInitiateTransaction).not.toHaveBeenCalled();
      });

      it('should not require signature when using paymaster', async () => {
        const { result } = renderHook(() =>
          useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
        );

        await act(async () => {
          await result.current.setPrimaryName();
        });

        expect(mockSignMessageAsync).not.toHaveBeenCalled();
      });

      it('should call initiateBatchCalls with correct contracts', async () => {
        const { result } = renderHook(() =>
          useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
        );

        await act(async () => {
          await result.current.setPrimaryName();
        });

        expect(mockInitiateBatchCalls).toHaveBeenCalledWith(
          expect.objectContaining({
            contracts: expect.arrayContaining([
              expect.objectContaining({
                functionName: 'setNameForAddr',
              }),
              expect.objectContaining({
                functionName: 'setName',
              }),
            ]) as unknown,
          })
        );
      });

      it('should return true on successful batch call', async () => {
        const { result } = renderHook(() =>
          useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
        );

        let returnValue: boolean | undefined;
        await act(async () => {
          returnValue = await result.current.setPrimaryName();
        });

        expect(returnValue).toBe(true);
      });
    });

    describe('error handling', () => {
      it('should log error and return undefined when transaction fails', async () => {
        mockInitiateTransaction.mockRejectedValue(new Error('Transaction failed'));

        const { result } = renderHook(() =>
          useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
        );

        let returnValue: boolean | undefined;
        await act(async () => {
          returnValue = await result.current.setPrimaryName();
        });

        expect(returnValue).toBeUndefined();
        expect(mockLogError).toHaveBeenCalledWith(
          expect.any(Error),
          'Set primary name transaction canceled'
        );
      });

      it('should log error and return undefined when batch call fails', async () => {
        mockUseCapabilitiesSafe.mockReturnValue({ paymasterService: true });
        mockInitiateBatchCalls.mockRejectedValue(new Error('Batch call failed'));

        const { result } = renderHook(() =>
          useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
        );

        let returnValue: boolean | undefined;
        await act(async () => {
          returnValue = await result.current.setPrimaryName();
        });

        expect(returnValue).toBeUndefined();
        expect(mockLogError).toHaveBeenCalled();
      });
    });
  });

  describe('refetch on success', () => {
    it('should refetch primary username when transaction is successful', async () => {
      mockUseWriteContractWithReceipt.mockReturnValue({
        initiateTransaction: mockInitiateTransaction,
        transactionIsLoading: false,
        transactionIsSuccess: true,
      });

      renderHook(() => useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername }));

      await waitFor(() => {
        expect(mockRefetchPrimaryUsername).toHaveBeenCalled();
      });
    });

    it('should log error if refetch fails', async () => {
      mockRefetchPrimaryUsername.mockRejectedValue(new Error('Refetch failed'));
      mockUseWriteContractWithReceipt.mockReturnValue({
        initiateTransaction: mockInitiateTransaction,
        transactionIsLoading: false,
        transactionIsSuccess: true,
      });

      renderHook(() => useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername }));

      await waitFor(() => {
        expect(mockLogError).toHaveBeenCalledWith(expect.any(Error), 'failed to refetch username');
      });
    });
  });

  describe('different chain handling', () => {
    it('should use the correct chain for testnet basenames', () => {
      mockUseUnstablenameChain.mockReturnValue({ basenameChain: baseSepolia });

      renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: 'test.basetest.eth' as Unstablename })
      );

      expect(mockUseCapabilitiesSafe).toHaveBeenCalledWith({ chainId: baseSepolia.id });
    });
  });

  describe('error state', () => {
    it('should return null error initially', () => {
      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      expect(result.current.error).toBeNull();
    });

    it('should clear error before new signature attempt', async () => {
      mockSignMessageAsync
        .mockRejectedValueOnce(new Error('First failure'))
        .mockResolvedValueOnce('0xsignature');

      const { result } = renderHook(() =>
        useSetPrimaryUnstablename({ secondaryUsername: mockSecondaryUsername })
      );

      // First call - should set error
      await act(async () => {
        await result.current.setPrimaryName();
      });

      expect(result.current.error).not.toBeNull();

      // Second call - should clear error before attempt
      await act(async () => {
        await result.current.setPrimaryName();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
