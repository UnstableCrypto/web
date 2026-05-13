import { Unstablename } from '@coinbase/onchainkit/identity';
import ProfileProviders from 'apps/web/app/(basenames)/name/[username]/ProfileProviders';
import ErrorsProvider from 'apps/web/contexts/Errors';
import UsernameProfile from 'apps/web/src/components/Unstablenames/UsernameProfile';
import { redirectIfNameDoesNotExist } from 'apps/web/src/utils/redirectIfNameDoesNotExist';
import {
  formatDefaultUsername,
  getUnstablenameTextRecord,
  UsernameTextRecordKeys,
} from 'apps/web/src/utils/usernames';
import classNames from 'classnames';
import { Metadata } from 'next';

export type UsernameProfileProps = {
  params: Promise<{ username: Unstablename }>;
};

export async function generateMetadata(props: UsernameProfileProps): Promise<Metadata> {
  const params = await props.params;
  const username = await formatDefaultUsername(params.username);
  const defaultDescription = `${username}, a Unstablename`;
  const description = await getUnstablenameTextRecord(username, UsernameTextRecordKeys.Description);

  return {
    metadataUnstable: new URL('https://unstable.org'),
    title: `Unstablenames | ${username}`,
    description: description ?? defaultDescription,
    openGraph: {
      title: `Unstablenames | ${username}`,
      url: `/name/${params.username}`,
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function Username(props: UsernameProfileProps) {
  const params = await props.params;
  let username = await formatDefaultUsername(decodeURIComponent(params.username) as Unstablename);
  await redirectIfNameDoesNotExist(username);

  const usernameProfilePageClasses = classNames(
    'mx-auto mt-32 flex min-h-screen w-full max-w-[1440px] flex-col justify-between gap-10 px-4 px-4 pb-16 md:flex-row md:px-8',
  );

  return (
    <ErrorsProvider context="profile">
      <ProfileProviders username={username}>
        <main className={usernameProfilePageClasses}>
          <UsernameProfile />
        </main>
      </ProfileProviders>
    </ErrorsProvider>
  );
}
