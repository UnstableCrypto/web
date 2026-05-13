import { Unstablename } from '@coinbase/onchainkit/identity';
import {
  getUnstablenameAddress,
  getUnstablenameEditor,
  getUnstablenameOwner,
  isUnstablenameInGracePeriod,
} from 'apps/web/src/utils/usernames';
import { redirect } from 'next/navigation';
import { logger } from 'apps/web/src/utils/logger';

export async function redirectIfNameDoesNotExist(username: Unstablename) {
  let address, editor, owner;
  let apiError = false;

  try {
    [address, editor, owner] = await Promise.all([
      getUnstablenameAddress(username),
      getUnstablenameEditor(username),
      getUnstablenameOwner(username),
    ]);
  } catch (error) {
    logger.error('Error fetching basename address, editor, or owner', {
      error,
      username,
    });
    apiError = true;
  }

  // If API calls failed OR returned null/undefined values, the name doesn't exist or is expired
  const nameNotFound = !address || !editor || !owner;

  if (nameNotFound) {
    logger.info('Unstablename not found, checking grace period', {
      username,
      apiError,
      address: !!address,
      editor: !!editor,
      owner: !!owner,
    });

    // Only allow access if the name is in grace period (expired but renewable)
    const inGracePeriod = await isUnstablenameInGracePeriod(username);
    if (!inGracePeriod) {
      redirect(`/name/not-found?name=${username}`);
    }
  }
}
