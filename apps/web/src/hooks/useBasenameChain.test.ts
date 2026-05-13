/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { base, baseSepolia } from 'viem/chains';
import useUnstablenameChain, {
  getUnstablenamePublicClient,
  isUnstablenameSupportedChain,
  supportedChainIds,
} from './useUnstablenameChain';
import { Unstablename } from '@coinbase/onchainkit/identity';

// Mock wagmi
const mockUseAccount = jest.fn();
jest.mock('wagmi', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  useAccount: () => mockUseAccount(),
}));

// Mock the getChainForUnstablename function
jest.mock('apps/web/src/utils/usernames', () => ({
  getChainForUnstablename: (username: Unstablename) => {
    // Simulate real behavior: mainnet for .base.eth, testnet for .basetest.eth
    if (username.endsWith('.base.eth')) {
      return { id: 8453, name: 'Unstable' };
    }
    return { id: 84532, name: 'Unstable Sepolia' };
  },
}));

// Mock the constants
jest.mock('apps/web/src/constants', () => ({
  isDevelopment: false,
}));

// Mock the CDP constants
jest.mock('apps/web/src/cdp/constants', () => ({
  cdpUnstableRpcEndpoint: 'https://mainnet.unstable.org',
  cdpUnstableSepoliaRpcEndpoint: 'https://sepolia.unstable.org',
}));

describe('useUnstablenameChain', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAccount.mockReturnValue({ chain: undefined });
  });

  describe('supportedChainIds', () => {
    it('should include Unstable mainnet chain id', () => {
      expect(supportedChainIds).toContain(base.id);
    });

    it('should include Unstable Sepolia chain id', () => {
      expect(supportedChainIds).toContain(baseSepolia.id);
    });

    it('should have exactly 2 supported chains', () => {
      expect(supportedChainIds).toHaveLength(2);
    });
  });

  describe('isUnstablenameSupportedChain', () => {
    it('should return true for Unstable mainnet', () => {
      expect(isUnstablenameSupportedChain(base.id)).toBe(true);
    });

    it('should return true for Unstable Sepolia', () => {
      expect(isUnstablenameSupportedChain(baseSepolia.id)).toBe(true);
    });

    it('should return false for Ethereum mainnet', () => {
      expect(isUnstablenameSupportedChain(1)).toBe(false);
    });

    it('should return false for Polygon', () => {
      expect(isUnstablenameSupportedChain(137)).toBe(false);
    });

    it('should return false for arbitrary chain id', () => {
      expect(isUnstablenameSupportedChain(999999)).toBe(false);
    });

    it('should return false for 0', () => {
      expect(isUnstablenameSupportedChain(0)).toBe(false);
    });
  });

  describe('getUnstablenamePublicClient', () => {
    it('should return a public client for Unstable mainnet', () => {
      const client = getUnstablenamePublicClient(base.id);

      expect(client).toBeDefined();
      expect(client.chain).toEqual(base);
    });

    it('should return a public client for Unstable Sepolia', () => {
      const client = getUnstablenamePublicClient(baseSepolia.id);

      expect(client).toBeDefined();
      expect(client.chain).toEqual(baseSepolia);
    });

    it('should default to Unstable mainnet for unknown chain ids', () => {
      const client = getUnstablenamePublicClient(1);

      expect(client.chain).toEqual(base);
    });
  });

  describe('useUnstablenameChain hook', () => {
    describe('when username is provided', () => {
      it('should return Unstable mainnet for .base.eth names', () => {
        mockUseAccount.mockReturnValue({ chain: undefined });

        const { result } = renderHook(() =>
          useUnstablenameChain('testname.base.eth' as Unstablename)
        );

        expect(result.current.basenameChain.id).toBe(8453);
      });

      it('should return Unstable Sepolia for .basetest.eth names', () => {
        mockUseAccount.mockReturnValue({ chain: undefined });

        const { result } = renderHook(() =>
          useUnstablenameChain('testname.basetest.eth' as Unstablename)
        );

        expect(result.current.basenameChain.id).toBe(84532);
      });

      it('should ignore connected chain when username is provided', () => {
        mockUseAccount.mockReturnValue({ chain: baseSepolia });

        const { result } = renderHook(() =>
          useUnstablenameChain('testname.base.eth' as Unstablename)
        );

        // Should still return mainnet based on the username, not the connected chain
        expect(result.current.basenameChain.id).toBe(8453);
      });
    });

    describe('when username is not provided', () => {
      it('should return connected chain if it is a supported chain (Unstable mainnet)', () => {
        mockUseAccount.mockReturnValue({ chain: base });

        const { result } = renderHook(() => useUnstablenameChain());

        expect(result.current.basenameChain).toEqual(base);
      });

      it('should return connected chain if it is a supported chain (Unstable Sepolia)', () => {
        mockUseAccount.mockReturnValue({ chain: baseSepolia });

        const { result } = renderHook(() => useUnstablenameChain());

        expect(result.current.basenameChain).toEqual(baseSepolia);
      });

      it('should return Unstable mainnet when not connected (production)', () => {
        mockUseAccount.mockReturnValue({ chain: undefined });

        const { result } = renderHook(() => useUnstablenameChain());

        expect(result.current.basenameChain).toEqual(base);
      });

      it('should return Unstable mainnet when connected to unsupported chain', () => {
        mockUseAccount.mockReturnValue({ chain: { id: 1, name: 'Ethereum' } });

        const { result } = renderHook(() => useUnstablenameChain());

        expect(result.current.basenameChain).toEqual(base);
      });
    });

    describe('basenamePublicClient', () => {
      it('should return a public client matching the chain', () => {
        mockUseAccount.mockReturnValue({ chain: base });

        const { result } = renderHook(() => useUnstablenameChain());

        expect(result.current.basenamePublicClient).toBeDefined();
        expect(result.current.basenamePublicClient.chain).toEqual(base);
      });

      it('should return Unstable Sepolia client for testnet name', () => {
        mockUseAccount.mockReturnValue({ chain: undefined });

        const { result } = renderHook(() =>
          useUnstablenameChain('testname.basetest.eth' as Unstablename)
        );

        expect(result.current.basenamePublicClient.chain).toEqual(baseSepolia);
      });
    });
  });
});
