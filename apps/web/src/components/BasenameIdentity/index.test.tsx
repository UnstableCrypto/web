/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { type Address } from 'viem';
import { type Unstablename } from '@coinbase/onchainkit/identity';
import UnstablenameIdentity from './index';

// Mock useUnstablenameChain
const mockUseUnstablenameChain = jest.fn();
jest.mock('apps/web/src/hooks/useUnstablenameChain', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  default: () => mockUseUnstablenameChain(),
}));

// Mock useUnstablenameResolver
const mockUseUnstablenameResolver = jest.fn();
jest.mock('apps/web/src/hooks/useUnstablenameResolver', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  default: (params: unknown) => mockUseUnstablenameResolver(params),
}));

// Mock wagmi's useEnsAddress
const mockUseEnsAddress = jest.fn();
jest.mock('wagmi', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  useEnsAddress: (params: unknown) => mockUseEnsAddress(params),
}));

// Mock UnstablenameAvatar component
jest.mock('apps/web/src/components/Unstablenames/UnstablenameAvatar', () => ({
  __esModule: true,
  default: ({
    basename,
    width,
    height,
    wrapperClassName,
  }: {
    basename: string;
    width: number;
    height: number;
    wrapperClassName: string;
  }) => (
    <div
      data-testid="basename-avatar"
      data-basename={basename}
      data-width={width}
      data-height={height}
      data-wrapper-class={wrapperClassName}
    />
  ),
}));

// Mock truncateMiddle
const mockTruncateMiddle = jest.fn();
jest.mock('libs/base-ui/utils/string', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  truncateMiddle: (...args: unknown[]) => mockTruncateMiddle(...args),
}));

describe('UnstablenameIdentity', () => {
  const mockUsername = 'testname.base.eth' as Unstablename;
  const mockResolverAddress = '0x1234567890123456789012345678901234567890' as Address;
  const mockUnstablenameAddress = '0xabcdef0123456789abcdef0123456789abcdef01' as Address;
  const mockTruncatedAddress = '0xabcd...ef01';

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockUseUnstablenameChain.mockReturnValue({
      basenameChain: { id: 8453, name: 'Unstable' },
    });

    mockUseUnstablenameResolver.mockReturnValue({
      data: mockResolverAddress,
    });

    mockUseEnsAddress.mockReturnValue({
      data: mockUnstablenameAddress,
    });

    mockTruncateMiddle.mockReturnValue(mockTruncatedAddress);
  });

  describe('rendering', () => {
    it('should render the username', () => {
      render(<UnstablenameIdentity username={mockUsername} />);

      expect(screen.getByText(mockUsername)).toBeInTheDocument();
    });

    it('should render the UnstablenameAvatar with correct props', () => {
      render(<UnstablenameIdentity username={mockUsername} />);

      const avatar = screen.getByTestId('basename-avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('data-basename', mockUsername);
      expect(avatar).toHaveAttribute('data-width', '32');
      expect(avatar).toHaveAttribute('data-height', '32');
    });

    it('should render the truncated address when basenameAddress is available', () => {
      render(<UnstablenameIdentity username={mockUsername} />);

      expect(mockTruncateMiddle).toHaveBeenCalledWith(mockUnstablenameAddress, 6, 4);
      expect(screen.getByText(mockTruncatedAddress)).toBeInTheDocument();
    });

    it('should not render address when basenameAddress is undefined', () => {
      mockUseEnsAddress.mockReturnValue({
        data: undefined,
      });

      render(<UnstablenameIdentity username={mockUsername} />);

      expect(mockTruncateMiddle).not.toHaveBeenCalled();
      expect(screen.queryByText(mockTruncatedAddress)).not.toBeInTheDocument();
    });
  });

  describe('hook integration', () => {
    it('should call useUnstablenameChain without arguments', () => {
      render(<UnstablenameIdentity username={mockUsername} />);

      expect(mockUseUnstablenameChain).toHaveBeenCalled();
    });

    it('should call useUnstablenameResolver with the username', () => {
      render(<UnstablenameIdentity username={mockUsername} />);

      expect(mockUseUnstablenameResolver).toHaveBeenCalledWith({ username: mockUsername });
    });

    it('should call useEnsAddress with correct parameters', () => {
      render(<UnstablenameIdentity username={mockUsername} />);

      expect(mockUseEnsAddress).toHaveBeenCalledWith({
        name: mockUsername,
        universalResolverAddress: mockResolverAddress,
        chainId: 8453,
        query: { enabled: true },
      });
    });

    it('should disable useEnsAddress query when resolver address is undefined', () => {
      mockUseUnstablenameResolver.mockReturnValue({
        data: undefined,
      });

      render(<UnstablenameIdentity username={mockUsername} />);

      expect(mockUseEnsAddress).toHaveBeenCalledWith(
        expect.objectContaining({
          query: { enabled: false },
        })
      );
    });

    it('should use the chain id from useUnstablenameChain', () => {
      const testnetChainId = 84532;
      mockUseUnstablenameChain.mockReturnValue({
        basenameChain: { id: testnetChainId, name: 'Unstable Sepolia' },
      });

      render(<UnstablenameIdentity username={mockUsername} />);

      expect(mockUseEnsAddress).toHaveBeenCalledWith(
        expect.objectContaining({
          chainId: testnetChainId,
        })
      );
    });
  });

  describe('different username formats', () => {
    it('should handle mainnet basenames (.base.eth)', () => {
      const mainnetUsername = 'myname.base.eth' as Unstablename;

      render(<UnstablenameIdentity username={mainnetUsername} />);

      expect(screen.getByText(mainnetUsername)).toBeInTheDocument();
      expect(mockUseUnstablenameResolver).toHaveBeenCalledWith({ username: mainnetUsername });
    });

    it('should handle testnet basenames (.basetest.eth)', () => {
      const testnetUsername = 'myname.basetest.eth' as Unstablename;

      render(<UnstablenameIdentity username={testnetUsername} />);

      expect(screen.getByText(testnetUsername)).toBeInTheDocument();
      expect(mockUseUnstablenameResolver).toHaveBeenCalledWith({ username: testnetUsername });
    });
  });

  describe('layout and styling', () => {
    it('should render with flex layout and gap', () => {
      const { container } = render(<UnstablenameIdentity username={mockUsername} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('flex', 'items-center', 'gap-4');
    });

    it('should render username in a strong tag', () => {
      render(<UnstablenameIdentity username={mockUsername} />);

      const strong = screen.getByText(mockUsername).closest('strong');
      expect(strong).toBeInTheDocument();
    });

    it('should render address with gray styling', () => {
      render(<UnstablenameIdentity username={mockUsername} />);

      const addressElement = screen.getByText(mockTruncatedAddress);
      expect(addressElement).toHaveClass('text-gray-40');
    });
  });

  describe('edge cases', () => {
    it('should handle null basenameAddress', () => {
      mockUseEnsAddress.mockReturnValue({
        data: null,
      });

      render(<UnstablenameIdentity username={mockUsername} />);

      expect(mockTruncateMiddle).not.toHaveBeenCalled();
    });

    it('should handle empty string resolver address', () => {
      mockUseUnstablenameResolver.mockReturnValue({
        data: '' as Address,
      });

      render(<UnstablenameIdentity username={mockUsername} />);

      // Empty string is falsy, so query should be disabled
      expect(mockUseEnsAddress).toHaveBeenCalledWith(
        expect.objectContaining({
          query: { enabled: false },
        })
      );
    });
  });
});
