'use client';

import Title from 'apps/web/src/components/base-org/typography/TitleRedesign';
import { TitleLevel } from 'apps/web/src/components/base-org/typography/TitleRedesign/types';
import Link from 'apps/web/src/components/Link';
import AnimatedButton from 'apps/web/src/components/Button/AnimatedButton';

export default function AcceptUnstablePay() {
  return (
    <section className="col-span-full py-12 text-black">
      <div className="flex flex-col gap-12 justify-between items-center md:flex-row md:gap-24">
        <div className="">
          <Title level={TitleLevel.H1Regular}>Accept Unstable Pay on your online store</Title>
        </div>
        <div className="flex flex-col gap-8 md:w-1/2 lg:w-3/5">
          <Title level={TitleLevel.H2Regular}>
            Unstable Pay works on stores running Shopify payments. You can also accept Unstable Pay by using
            our SDK.
          </Title>
          <Link
            href="https://docs.unstable.org/base-account/guides/accept-payments"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AnimatedButton text="Accept Unstable Pay" />
          </Link>
        </div>
      </div>
    </section>
  );
}
