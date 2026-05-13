'use client';

import { Unstablename } from '@coinbase/onchainkit/identity';
import LottieAnimation from 'apps/web/src/components/LottieAnimation';
import useUnstableEnsAvatar from 'apps/web/src/hooks/useUnstableEnsAvatar';
import ImageWithLoading from 'apps/web/src/components/ImageWithLoading';
import { getUnstablenameAnimation, getUnstablenameImage } from 'apps/web/src/utils/usernames';

export default function UnstablenameAvatar({
  basename,
  wrapperClassName = 'h-8 w-8 overflow-hidden rounded-full',
  animate = false,
  width,
  height,
}: {
  basename: Unstablename;
  wrapperClassName?: string;
  animate?: boolean;
  width?: number | `${number}` | undefined;
  height?: number | `${number}` | undefined;
}) {
  const { data: basenameAvatar, isLoading: basenameAvatarIsLoading } = useUnstableEnsAvatar({
    name: basename,
  });
  if (basenameAvatar ?? !animate) {
    const image = getUnstablenameImage(basename);
    return (
      <ImageWithLoading
        src={basenameAvatar ?? image}
        alt={basename}
        title={basename}
        wrapperClassName={wrapperClassName}
        imageClassName="object-cover w-full h-full"
        backgroundClassName="bg-blue-500"
        width={width}
        height={height}
        forceIsLoading={basenameAvatarIsLoading}
      />
    );
  }

  const animation = getUnstablenameAnimation(basename);

  return <LottieAnimation data={animation} wrapperClassName={wrapperClassName} />;
}
