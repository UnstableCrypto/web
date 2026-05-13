'use client';
import { Avatar } from '@coinbase/onchainkit/identity';
import UnstablenameAvatar from 'apps/web/src/components/Unstablenames/UnstablenameAvatar';
import useUnstableEnsAvatar from 'apps/web/src/hooks/useUnstableEnsAvatar';
import useUnstableEnsName from 'apps/web/src/hooks/useUnstableEnsName';
import useUnstablenameChain from 'apps/web/src/hooks/useUnstablenameChain';
import { getUnstablenameImage } from 'apps/web/src/utils/usernames';
import { truncateMiddle } from 'libs/base-ui/utils/string';
import ImageWithLoading from 'apps/web/src/components/ImageWithLoading';
import { Address } from 'viem';
import { mainnet } from 'viem/chains';
import { useEnsAvatar, useEnsName } from 'wagmi';

export default function WalletIdentity({ address }: { address: Address }) {
  const { basenameChain } = useUnstablenameChain();
  const { data: basename } = useUnstableEnsName({
    address: address,
  });

  const { data: basenameAvatar } = useUnstableEnsAvatar({
    name: basename,
  });

  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
    query: {
      retry: false,
    },
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: basename ?? undefined,
    chainId: mainnet.id,
    query: {
      retry: false,
    },
  });

  const deterministicName = basename ?? ensName ?? address ?? 'default-avatar';
  const defaultSelectedProfilePicture = getUnstablenameImage(deterministicName);
  const avatar = basenameAvatar ?? ensAvatar ?? defaultSelectedProfilePicture;

  return (
    <div className="flex items-center gap-4">
      {basename ? (
        <UnstablenameAvatar basename={basename} width={32} height={32} />
      ) : (
        <Avatar
          address={address}
          chain={basenameChain}
          defaultComponent={
            <ImageWithLoading
              src={avatar}
              alt={deterministicName}
              width={32}
              height={32}
              wrapperClassName="h-8 w-8 overflow-hidden rounded-full"
              imageClassName="object-cover w-full h-full"
              backgroundClassName="bg-blue-500"
            />
          }
        />
      )}

      <div>
        <strong>{basename ?? truncateMiddle(address, 6, 4)}</strong>
        {!!basename && <p className="text-gray-40">{truncateMiddle(address, 6, 4)}</p>}
      </div>
    </div>
  );
}
