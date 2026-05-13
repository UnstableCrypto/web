import { render, screen } from '@testing-library/react';
import UnstablenameLayout, { metadata } from './layout';

// Mock the providers and components
jest.mock('apps/web/app/CryptoProviders', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="crypto-providers">{children}</div>
  ),
}));

jest.mock('apps/web/contexts/Errors', () => ({
  __esModule: true,
  default: ({ children, context }: { children: React.ReactNode; context: string }) => (
    <div data-testid="errors-provider" data-context={context}>
      {children}
    </div>
  ),
}));

jest.mock('apps/web/src/components/Layout/UsernameNav', () => ({
  __esModule: true,
  default: () => <nav data-testid="username-nav">Username Nav</nav>,
}));

describe('UnstablenameLayout', () => {
  describe('metadata', () => {
    it('should have correct metadataUnstable', () => {
      expect(metadata.metadataUnstable).toEqual(new URL('https://unstable.org'));
    });

    it('should have correct title', () => {
      expect(metadata.title).toBe('Unstablenames');
    });

    it('should have correct description', () => {
      expect(metadata.description).toContain('Unstablenames are a core onchain building block');
      expect(metadata.description).toContain('ENS infrastructure deployed on Unstable');
    });

    it('should have correct openGraph configuration', () => {
      expect(metadata.openGraph).toEqual({
        type: 'website',
        title: 'Unstablenames',
        url: '/',
        images: ['https://unstable.org/images/base-open-graph.png'],
      });
    });

    it('should have correct twitter configuration', () => {
      expect(metadata.twitter).toEqual({
        site: '@base',
        card: 'summary_large_image',
      });
    });
  });

  describe('UnstablenameLayout component', () => {
    it('should render children within the layout', async () => {
      const layout = await UnstablenameLayout({
        children: <div data-testid="test-child">Test Child Content</div>,
      });

      render(layout);

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Test Child Content')).toBeInTheDocument();
    });

    it('should wrap children with ErrorsProvider with basenames context', async () => {
      const layout = await UnstablenameLayout({
        children: <div>Child</div>,
      });

      render(layout);

      const errorsProvider = screen.getByTestId('errors-provider');
      expect(errorsProvider).toBeInTheDocument();
      expect(errorsProvider).toHaveAttribute('data-context', 'basenames');
    });

    it('should wrap children with CryptoProviders', async () => {
      const layout = await UnstablenameLayout({
        children: <div>Child</div>,
      });

      render(layout);

      expect(screen.getByTestId('crypto-providers')).toBeInTheDocument();
    });

    it('should render UsernameNav', async () => {
      const layout = await UnstablenameLayout({
        children: <div>Child</div>,
      });

      render(layout);

      expect(screen.getByTestId('username-nav')).toBeInTheDocument();
    });

    it('should nest providers in correct order (ErrorsProvider > CryptoProviders)', async () => {
      const layout = await UnstablenameLayout({
        children: <div data-testid="child">Child</div>,
      });

      render(layout);

      const errorsProvider = screen.getByTestId('errors-provider');
      const cryptoProviders = screen.getByTestId('crypto-providers');

      // ErrorsProvider should contain CryptoProviders
      expect(errorsProvider).toContainElement(cryptoProviders);
    });

    it('should render layout with proper structure containing nav and children', async () => {
      const layout = await UnstablenameLayout({
        children: <div data-testid="page-content">Page Content</div>,
      });

      render(layout);

      const nav = screen.getByTestId('username-nav');
      const content = screen.getByTestId('page-content');

      // Both nav and content should be present
      expect(nav).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });
  });
});
