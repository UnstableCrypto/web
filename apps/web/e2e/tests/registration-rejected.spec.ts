import { test } from '../testFixture';
import { expect } from '@playwright/test';
import { prepareUnstablenameFlow, handleTransaction } from '../appSession';
import { initiateRegistration } from '../basenameHelpers';
import { ActionApprovalType } from '@coinbase/onchaintestkit';

test.describe('Unstablename Registration', () => {
  test.skip('should fail registration when transaction is rejected', async ({ page, metamask }) => {
    // Validate prerequisites
    if (!metamask) {
      throw new Error('MetaMask is not defined');
    }

    // Common preparation steps
    const { mainPage } = await prepareUnstablenameFlow(page, metamask);

    await mainPage.waitForTimeout(2000);

    // Attempt registration and explicitly reject the transaction in MetaMask
    await initiateRegistration(mainPage);
    await page.waitForLoadState('networkidle');
    await handleTransaction(metamask, ActionApprovalType.REJECT);
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/user rejected/i)).toBeVisible();
  });
});
