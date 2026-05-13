/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { type Unstablename } from '@coinbase/onchainkit/identity';
import UnstablenameAvatar from './index';

// Mock useUnstableEnsAvatar hook
const mockUseUnstableEnsAvatar = jest.fn();
jest.mock('apps/web/src/hooks/useUnstableEnsAvatar', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  default: (params: unknown) => mockUseUnstableEnsAvatar(params),
}));

// Mock ImageWithLoading component
jest.mock('apps/web/src/components/ImageWithLoading', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    title,
    wrapperClassName,
    imageClassName,
    backgroundClassName,
    width,
    height,
    forceIsLoading,
  }: {
    src: unknown;
    alt: string;
    title: string;
    wrapperClassName: string;
    imageClassName: string;
    backgroundClassName: string;
    width?: number;
    height?: number;
    forceIsLoading: boolean;
  }) => (
    <div
      data-testid="image-with-loading"
      data-src={typeof src === 'string' ? src : 'static-image'}
      data-alt={alt}
      data-title={title}
      data-wrapper-class={wrapperClassName}
      data-image-class={imageClassName}
      data-background-class={backgroundClassName}
      data-width={width}
      data-height={height}
      data-force-is-loading={String(forceIsLoading)}
    />
  ),
}));

// Mock LottieAnimation component
jest.mock('apps/web/src/components/LottieAnimation', () => ({
  __esModule: true,
  default: ({
    data,
    wrapperClassName,
  }: {
    data: unknown;
    wrapperClassName: string;
  }) => (
    <div
      data-testid="lottie-animation"
      data-has-data={String(!!data)}
      data-wrapper-class={wrapperClassName}
    />
  ),
}));

// Mock getUnstablenameAnimation and getUnstablenameImage utilities
const mockGetUnstablenameImage = jest.fn();
const mockGetUnstablenameAnimation = jest.fn();
jest.mock('apps/web/src/utils/usernames', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  getUnstablenameImage: (...args: unknown[]) => mockGetUnstablenameImage(...args),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  getUnstablenameAnimation: (...args: unknown[]) => mockGetUnstablenameAnimation(...args),
}));

describe('UnstablenameAvatar', () => {
  const mockUnstablename = 'testuser.base.eth' as Unstablename;
  const mockAvatarUrl = 'https://example.com/avatar.png';
  const mockDefaultImage = { src: '/images/default.svg', blurDataURL: '' };
  const mockAnimationData = { v: '5.0.0', layers: [] };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockUseUnstableEnsAvatar.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    mockGetUnstablenameImage.mockReturnValue(mockDefaultImage);
    mockGetUnstablenameAnimation.mockReturnValue(mockAnimationData);
  });

  describe('rendering with custom avatar', () => {
    it('should render ImageWithLoading when user has a custom avatar', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: mockAvatarUrl,
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={mockUnstablename} />);

      const imageElement = screen.getByTestId('image-with-loading');
      expect(imageElement).toBeInTheDocument();
      expect(imageElement).toHaveAttribute('data-src', mockAvatarUrl);
      expect(imageElement).toHaveAttribute('data-alt', mockUnstablename);
      expect(imageElement).toHaveAttribute('data-title', mockUnstablename);
    });

    it('should render ImageWithLoading with custom avatar even when animate is true', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: mockAvatarUrl,
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={mockUnstablename} animate />);

      const imageElement = screen.getByTestId('image-with-loading');
      expect(imageElement).toBeInTheDocument();
      expect(imageElement).toHaveAttribute('data-src', mockAvatarUrl);
    });

    it('should not render LottieAnimation when user has a custom avatar', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: mockAvatarUrl,
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={mockUnstablename} animate />);

      expect(screen.queryByTestId('lottie-animation')).not.toBeInTheDocument();
    });
  });

  describe('rendering without custom avatar', () => {
    it('should render ImageWithLoading with default image when no avatar and animate is false', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={mockUnstablename} animate={false} />);

      const imageElement = screen.getByTestId('image-with-loading');
      expect(imageElement).toBeInTheDocument();
      expect(imageElement).toHaveAttribute('data-src', 'static-image');
      expect(mockGetUnstablenameImage).toHaveBeenCalledWith(mockUnstablename);
    });

    it('should render LottieAnimation when no avatar and animate is true', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={mockUnstablename} animate />);

      const lottieElement = screen.getByTestId('lottie-animation');
      expect(lottieElement).toBeInTheDocument();
      expect(lottieElement).toHaveAttribute('data-has-data', 'true');
      expect(mockGetUnstablenameAnimation).toHaveBeenCalledWith(mockUnstablename);
    });

    it('should not render ImageWithLoading when no avatar and animate is true', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={mockUnstablename} animate />);

      expect(screen.queryByTestId('image-with-loading')).not.toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should pass isLoading to ImageWithLoading forceIsLoading prop', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: mockAvatarUrl,
        isLoading: true,
      });

      render(<UnstablenameAvatar basename={mockUnstablename} />);

      const imageElement = screen.getByTestId('image-with-loading');
      expect(imageElement).toHaveAttribute('data-force-is-loading', 'true');
    });

    it('should pass false to forceIsLoading when not loading', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: mockAvatarUrl,
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={mockUnstablename} />);

      const imageElement = screen.getByTestId('image-with-loading');
      expect(imageElement).toHaveAttribute('data-force-is-loading', 'false');
    });
  });

  describe('wrapperClassName prop', () => {
    it('should use default wrapperClassName when not provided', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: mockAvatarUrl,
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={mockUnstablename} />);

      const imageElement = screen.getByTestId('image-with-loading');
      expect(imageElement).toHaveAttribute(
        'data-wrapper-class',
        'h-8 w-8 overflow-hidden rounded-full'
      );
    });

    it('should pass custom wrapperClassName to ImageWithLoading', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: mockAvatarUrl,
        isLoading: false,
      });

      const customClassName = 'h-16 w-16 rounded-lg';
      render(<UnstablenameAvatar basename={mockUnstablename} wrapperClassName={customClassName} />);

      const imageElement = screen.getByTestId('image-with-loading');
      expect(imageElement).toHaveAttribute('data-wrapper-class', customClassName);
    });

    it('should pass custom wrapperClassName to LottieAnimation', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      const customClassName = 'h-20 w-20';
      render(<UnstablenameAvatar basename={mockUnstablename} animate wrapperClassName={customClassName} />);

      const lottieElement = screen.getByTestId('lottie-animation');
      expect(lottieElement).toHaveAttribute('data-wrapper-class', customClassName);
    });
  });

  describe('width and height props', () => {
    it('should pass width and height to ImageWithLoading', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: mockAvatarUrl,
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={mockUnstablename} width={64} height={64} />);

      const imageElement = screen.getByTestId('image-with-loading');
      expect(imageElement).toHaveAttribute('data-width', '64');
      expect(imageElement).toHaveAttribute('data-height', '64');
    });

    it('should pass string number format for width and height', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: mockAvatarUrl,
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={mockUnstablename} width="100" height="100" />);

      const imageElement = screen.getByTestId('image-with-loading');
      expect(imageElement).toHaveAttribute('data-width', '100');
      expect(imageElement).toHaveAttribute('data-height', '100');
    });

    it('should handle undefined width and height', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: mockAvatarUrl,
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={mockUnstablename} />);

      const imageElement = screen.getByTestId('image-with-loading');
      // undefined values result in null when using getAttribute
      expect(imageElement.getAttribute('data-width')).toBeNull();
      expect(imageElement.getAttribute('data-height')).toBeNull();
    });
  });

  describe('hook integration', () => {
    it('should call useUnstableEnsAvatar with the basename', () => {
      render(<UnstablenameAvatar basename={mockUnstablename} />);

      expect(mockUseUnstableEnsAvatar).toHaveBeenCalledWith({ name: mockUnstablename });
    });

    it('should call useUnstableEnsAvatar with different basenames', () => {
      const differentUnstablename = 'anotheruser.base.eth' as Unstablename;

      render(<UnstablenameAvatar basename={differentUnstablename} />);

      expect(mockUseUnstableEnsAvatar).toHaveBeenCalledWith({ name: differentUnstablename });
    });
  });

  describe('ImageWithLoading styling props', () => {
    it('should pass correct imageClassName to ImageWithLoading', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: mockAvatarUrl,
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={mockUnstablename} />);

      const imageElement = screen.getByTestId('image-with-loading');
      expect(imageElement).toHaveAttribute('data-image-class', 'object-cover w-full h-full');
    });

    it('should pass correct backgroundClassName to ImageWithLoading', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: mockAvatarUrl,
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={mockUnstablename} />);

      const imageElement = screen.getByTestId('image-with-loading');
      expect(imageElement).toHaveAttribute('data-background-class', 'bg-blue-500');
    });
  });

  describe('different basename formats', () => {
    it('should handle mainnet basenames (.base.eth)', () => {
      const mainnetUnstablename = 'mainnetuser.base.eth' as Unstablename;
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={mainnetUnstablename} />);

      expect(mockUseUnstableEnsAvatar).toHaveBeenCalledWith({ name: mainnetUnstablename });
      expect(mockGetUnstablenameImage).toHaveBeenCalledWith(mainnetUnstablename);
    });

    it('should handle testnet basenames (.basetest.eth)', () => {
      const testnetUnstablename = 'testnetuser.basetest.eth' as Unstablename;
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={testnetUnstablename} />);

      expect(mockUseUnstableEnsAvatar).toHaveBeenCalledWith({ name: testnetUnstablename });
      expect(mockGetUnstablenameImage).toHaveBeenCalledWith(testnetUnstablename);
    });
  });

  describe('edge cases', () => {
    it('should render LottieAnimation with empty string avatar url when animate is true', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: '',
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={mockUnstablename} animate />);

      // Empty string is not nullish, so `basenameAvatar ?? !animate` returns ''
      // which is falsy, leading to the LottieAnimation branch
      const lottieElement = screen.getByTestId('lottie-animation');
      expect(lottieElement).toBeInTheDocument();
    });

    it('should handle null avatar data by using default image', () => {
      mockUseUnstableEnsAvatar.mockReturnValue({
        data: null,
        isLoading: false,
      });

      render(<UnstablenameAvatar basename={mockUnstablename} animate={false} />);

      const imageElement = screen.getByTestId('image-with-loading');
      expect(imageElement).toBeInTheDocument();
    });
  });
});
