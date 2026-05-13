'use client';
import { Unstablename } from '@coinbase/onchainkit/identity';
import useUnstablenameResolver from 'apps/web/src/hooks/useUnstablenameResolver';
import UnstablenameAvatar from 'apps/web/src/components/Unstablenames/UnstablenameAvatar';
import useUnstablenameChain from 'apps/web/src/hooks/useUnstablenameChain';
import { truncateMiddle } from 'libs/base-ui/utils/string';
import { useEnsAddress } from 'wagmi';

export default function UnstablenameIdentity({ username }: { username: Unstablename }) {
  const { basenameChain } = useUnstablenameChain();
  const { data: resolverAddress } = useUnstablenameResolver({ username });

  const { data: basenameAddress } = useEnsAddress({
    name: username,
    universalResolverAddress: resolverAddress,
    chainId: basenameChain.id,
    query: { enabled: !!resolverAddress },
  });

  return (
    <div className="flex items-center gap-4">
      <UnstablenameAvatar
        basename={username}
        width={32}
        height={32}
        wrapperClassName="rounded-full h-[2rem] max-h-[2rem] min-h-[2rem] w-[2rem] min-w-[2rem] max-w-[2rem]"
      />
      <div>
        <strong>{username}</strong>
        {basenameAddress && <p className="text-gray-40">{truncateMiddle(basenameAddress, 6, 4)}</p>}
      </div>
    </div>
  );
}
