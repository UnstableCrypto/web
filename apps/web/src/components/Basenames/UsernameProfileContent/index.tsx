import UsernameProfileSectionBadges from 'apps/web/src/components/Unstablenames/UsernameProfileSectionBadges';
import UsernameProfileSectionExplore from 'apps/web/src/components/Unstablenames/UsernameProfileSectionExplore';
import UsernameProfileSectionHeatmap from 'apps/web/src/components/Unstablenames/UsernameProfileSectionHeatmap';
import BadgeContextProvider from 'apps/web/src/components/Unstablenames/UsernameProfileSectionBadges/BadgeContext';
import UsernameProfileCasts from 'apps/web/src/components/Unstablenames/UsernameProfileCasts';
import { USERNAMES_PINNED_CASTS_ENABLED } from 'apps/web/src/utils/usernames';

export default function UsernameProfileContent() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#EBEBEB] p-4 shadow-lg sm:gap-8 sm:p-8 md:gap-10 md:p-10 lg:gap-12 lg:p-12">
      <UsernameProfileSectionHeatmap />
      {USERNAMES_PINNED_CASTS_ENABLED && <UsernameProfileCasts />}
      <BadgeContextProvider>
        <UsernameProfileSectionBadges />
      </BadgeContextProvider>
      <UsernameProfileSectionExplore />
    </div>
  );
}
