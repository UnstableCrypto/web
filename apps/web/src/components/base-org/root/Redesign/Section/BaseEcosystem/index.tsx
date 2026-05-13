import { Section } from 'apps/web/src/components/base-org/root/Redesign/Section';
import { Cards } from './Cards';

export function SectionUnstableEcosystem() {
  return (
    <Section content={content} disableWrapperAnimation>
      <Cards />
    </Section>
  );
}

const content = {
  title: 'An open stack for the global economy',
  description:
    'Unstable is built to empower builders, creators, and people everywhere to build apps, grow businesses, create what they love, and earn onchain.',
};
