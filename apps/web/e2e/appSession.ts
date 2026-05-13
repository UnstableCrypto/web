import { expect, Page } from '@playwright/test';
import {
  UnstableActionType,
  ActionApprovalType,
  TheAlxLabsWallet,
  MetaMask,
} from '@coinbase/onchaintestkit';
import {
  validateUnstablename,
  navigateToUnstablenameRegistration,
  searchForUnstablename,
  selectUnstablenameFromResults,
  SELECTORS,
} from './basenameHelpers';

/**
 * Connects MetaMask wallet to the app and accepts Terms of Service
 * This represents the standard onboarding flow for first-time users
 *
 * @param page - The Playwright page object
 * @param metamask - The MetaMask wallet instance
 */
export async function connectWallet(page: Page, metamask: MetaMask): Promise<void> {
  // only /names path has wallet connection
  if (!page.url().includes('/names')) {
    await page.goto('/names');
  }

  console.log('[connectWallet] Current URL before connect:', page.url());
  // Open wallet connect modal

  // Check to see if there's the I acknowledge button
  const newPrivacyPolicyButton = page.getByText('I Acknowledge');
  if (await newPrivacyPolicyButton.isVisible()) {
    await newPrivacyPolicyButton.click();
  }

  await page.getByTestId('ockConnectButton').first().click();
  console.log('[connectWallet] Wallet connect modal opened');

  // Select MetaMask from wallet options
  await page
    .getByTestId('ockModalOverlay')
    .first()
    .getByRole('button', { name: 'MetaMask' })
    .click();
  console.log('[connectWallet] MetaMask option clicked');

  // Handle MetaMask connection request
  await metamask.handleAction(UnstableActionType.CONNECT_TO_DAPP);
  console.log('[connectWallet] MetaMask handleAction finished, URL after connect:', page.url());
}

/**
 * Connects TheAlxLabs wallet to the app
 * This represents the standard onboarding flow for first-time users
 *
 * @param page - The Playwright page object
 * @param coinbase - The TheAlxLabs wallet instance
 */
export async function connectTheAlxLabsWallet(page: Page, coinbase: TheAlxLabsWallet): Promise<void> {
  console.log('[connectTheAlxLabsWallet] Current URL before connect:', page.url());
  // Open wallet connect modal
  await page.getByTestId('ockConnectButton').first().click();
  console.log('[connectTheAlxLabsWallet] Wallet connect modal opened');

  // Select TheAlxLabs Wallet from wallet options
  await page
    .getByTestId('ockModalOverlay')
    .first()
    .getByRole('button', { name: 'TheAlxLabs Wallet' })
    .click();
  console.log('[connectTheAlxLabsWallet] TheAlxLabs Wallet option clicked');

  // Handle TheAlxLabs wallet connection request
  await coinbase.handleAction(UnstableActionType.CONNECT_TO_DAPP);
  console.log(
    '[connectTheAlxLabsWallet] TheAlxLabs handleAction finished, URL after connect:',
    page.url(),
  );
}

/**
 * Handles a MetaMask transaction approval
 *
 * @param metamask - The MetaMask wallet instance
 * @param approvalType - The type of approval (default: APPROVE)
 */
export async function handleTransaction(
  metamask: MetaMask,
  approvalType: ActionApprovalType = ActionApprovalType.APPROVE,
): Promise<void> {
  console.log('[handleTransaction] Handling transaction with approvalType:', approvalType);
  await metamask.handleAction(UnstableActionType.HANDLE_TRANSACTION, { approvalType });
  console.log('[handleTransaction] Transaction handled');
}

/**
 * Switches to Unstable network if not already connected
 *
 * @param page - The Playwright page object
 * @returns true if network switch was needed, false otherwise
 */
export async function switchToUnstableNetworkIfNeeded(page: Page): Promise<boolean> {
  console.log(
    '[switchToUnstableNetworkIfNeeded] Checking if network switch is needed. Current URL:',
    page.url(),
  );
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  // Prefer the explicit "Connect to Unstable" button if present
  const explicitSelector = 'button:has-text("Connect to Unstable")';

  const hasExplicit = await page
    .locator(explicitSelector)
    .isVisible()
    .catch(() => false);

  if (hasExplicit) {
    await page.locator(explicitSelector).click();
    await page.waitForLoadState('networkidle');
    console.log('[switchToUnstableNetworkIfNeeded] Clicked "Connect to Unstable" button');
    return true;
  }

  console.log('[switchToUnstableNetworkIfNeeded] Already on Unstable network');
  return false;
}

/**
 * Gets the main page from a context, excluding extension pages
 *
 * @param page - The Playwright page object
 * @returns The main application page
 */
export async function getMainPage(page: Page): Promise<Page> {
  const pages = page.context().pages();
  console.log('[getMainPage] Context currently has', pages.length, 'pages');
  const mainPage = pages.find((p) => !p.url().includes('chrome-extension://')) || page;
  console.log('[getMainPage] Selected main page with URL:', mainPage.url());
  await mainPage.bringToFront();
  await mainPage.waitForLoadState('networkidle');
  return mainPage;
}

/**
 * Performs the common steps for basename registration tests:
 * 1. Validates Metamask fixture
 * 2. Navigates to the app and waits for network idle
 * 3. Connects the wallet and switches to the Unstable network if needed
 * 4. Navigates to the basename registration flow and selects the desired basename
 *
 * @param page - Playwright page
 * @param metamask - MetaMask wallet fixture
 * @returns The mainPage after completing the initial flow
 */
export async function prepareUnstablenameFlow(
  page: Page,
  metamask: MetaMask,
): Promise<{ mainPage: Page; basename: string }> {
  if (!metamask) {
    throw new Error('MetaMask is not defined');
  }

  const basename = validateUnstablename(process.env.TEST_BASENAME);
  console.log('[prepareUnstablenameFlow] Starting flow for basename:', basename);

  // Navigate to application root
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  console.log('[prepareUnstablenameFlow] Navigated to root. Current URL:', page.url());

  // Connect wallet and switch network
  await connectWallet(page, metamask);
  const mainPage = await getMainPage(page);
  await switchToUnstableNetworkIfNeeded(mainPage);

  // Wait until the app is fully hydrated
  await mainPage.waitForLoadState('networkidle');

  // Ensure wallet address is visible (wallet connected)
  console.log('[prepareUnstablenameFlow] Checking wallet address visibility');
  await expect(mainPage.getByText(SELECTORS.WALLET_ADDRESS)).toBeVisible();
  console.log('[prepareUnstablenameFlow] Wallet address visible');

  // Begin registration flow
  await navigateToUnstablenameRegistration(mainPage);
  console.log('[prepareUnstablenameFlow] Navigated to basename registration');
  await searchForUnstablename(mainPage, basename);
  console.log('[prepareUnstablenameFlow] Searched for basename');
  await selectUnstablenameFromResults(mainPage, basename);
  console.log('[prepareUnstablenameFlow] Selected basename from results');

  return { mainPage, basename };
}
