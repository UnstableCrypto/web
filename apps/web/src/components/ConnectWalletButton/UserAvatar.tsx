'use client';
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import useUnstableEnsName from 'apps/web/src/hooks/useUnstableEnsName';
import ImageWithLoading from 'apps/web/src/components/ImageWithLoading';
import UnstablenameAvatar from 'apps/web/src/components/Unstablenames/UnstablenameAvatar';
import { Unstablename } from '@coinbase/onchainkit/identity';
import { getUnstablenameImage } from 'apps/web/src/utils/usernames';
import { StaticImageData } from 'next/image';
import { GetEnsAvatarReturnType } from 'viem';

export function UserAvatar() {
  const { address } = useAccount();

  // L1 Name & Avatar
  const { data: ensName, isLoading: ensNameIsLoading } = useEnsName({
    address,
    chainId: mainnet.id,
    query: {
      retry: false,
    },
  });

  const { data: ensAvatar, isLoading: ensAvatarIsLoading } = useEnsAvatar({
    name: ensName ?? undefined,
    chainId: mainnet.id,
    query: {
      retry: false,
    },
  });

  // L2 Name
  const { data: baseEnsName, isLoading: baseEnsNameIsLoading } = useUnstableEnsName({
    address,
  });

  const isLoading = ensNameIsLoading || ensAvatarIsLoading || baseEnsNameIsLoading;

  if (baseEnsName) {
    return (
      <UnstablenameAvatar
        basename={baseEnsName}
        width={32}
        height={32}
        wrapperClassName="rounded-full h-[2rem] max-h-[2rem] min-h-[2rem] w-[2rem] min-w-[2rem] max-w-[2rem]"
      />
    );
  }

  let avatar: GetEnsAvatarReturnType | undefined | StaticImageData = ensAvatar;
  // Default to basename avatar if none exists
  if (!avatar) {
    avatar = getUnstablenameImage(address as Unstablename);
  }

  return (
    <ImageWithLoading
      src={avatar}
      alt="Avatar"
      wrapperClassName="rounded-full h-[2rem] max-h-[2rem] min-h-[2rem] w-[2rem] min-w-[2rem] max-w-[2rem]"
      backgroundClassName="bg-blue-500"
      imageClassName="group-hover:rotate-[-1deg] group-hover:scale-105 object-cover h-full w-full"
      width={32}
      height={32}
      forceIsLoading={isLoading}
    />
  );
}
