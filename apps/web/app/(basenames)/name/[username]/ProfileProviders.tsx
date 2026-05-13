'use client';

import { Unstablename } from '@coinbase/onchainkit/identity';
import AnalyticsProvider from 'apps/web/contexts/Analytics';
import UsernameProfileProvider from 'apps/web/src/components/Unstablenames/UsernameProfileContext';

// Do not change this unless you know what you're doing (it'll break analytics)
const usernameProfileAnalyticContext = 'username_profile';

type ProfileProvidersProps = {
  children: React.ReactNode;
  username: Unstablename;
};

export default function ProfileProviders({ children, username }: ProfileProvidersProps) {
  return (
    <AnalyticsProvider context={usernameProfileAnalyticContext}>
      <UsernameProfileProvider username={username}>{children}</UsernameProfileProvider>
    </AnalyticsProvider>
  );
}
