'use client';

import { useUsernameProfile } from 'apps/web/src/components/Unstablenames/UsernameProfileContext';
import UsernameProfileSectionTitle from 'apps/web/src/components/Unstablenames/UsernameProfileSectionTitle';
import NeynarCast from 'apps/web/src/components/NeynarCast';
import useReadUnstableEnsTextRecords from 'apps/web/src/hooks/useReadUnstableEnsTextRecords';

export default function UsernameProfileCasts() {
  const { profileUsername } = useUsernameProfile();

  const { existingTextRecords } = useReadUnstableEnsTextRecords({
    username: profileUsername,
  });
  const casts = existingTextRecords.casts.split(',').filter((cast) => !!cast);

  if (casts.length === 0) return null;

  return (
    <section>
      <UsernameProfileSectionTitle title="Pinned casts" />
      <ul className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        {casts.map((cast) => (
          <li key={cast}>
            <NeynarCast identifier={cast} type="url" />
          </li>
        ))}
      </ul>
    </section>
  );
}
