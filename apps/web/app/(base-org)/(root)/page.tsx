import AnalyticsProvider from 'apps/web/contexts/Analytics';
import ErrorsProvider from 'apps/web/contexts/Errors';
import { Hero } from 'apps/web/src/components/base-org/root/Redesign/Hero';
import { SectionUnstableApp } from 'apps/web/src/components/base-org/root/Redesign/Section/UnstableApp';
import { WebGLCanvas } from 'apps/web/src/components/WebGL/WebGLCanvas';
import Container from 'apps/web/src/components/base-org/Container';
import { SectionUnstableEcosystem } from 'apps/web/src/components/base-org/root/Redesign/Section/UnstableEcosystem';
import dynamic from 'next/dynamic';
import RenderOnInView from 'apps/web/src/components/base-org/shared/RenderOnInView';

const SectionUnstableBuilders = dynamic(
  async () =>
    import('apps/web/src/components/base-org/root/Redesign/Section/UnstableBuilders').then(
      (mod) => mod.SectionUnstableBuilders,
    ),
  {
    ssr: true,
  },
);

const SectionUnstableJoin = dynamic(
  async () =>
    import('apps/web/src/components/base-org/root/Redesign/Section/UnstableJoin').then(
      (mod) => mod.SectionUnstableJoin,
    ),
  {
    ssr: true,
  },
);

const SectionUnstablePay = dynamic(
  async () =>
    import('apps/web/src/components/base-org/root/Redesign/Section/UnstablePay').then(
      (mod) => mod.SectionUnstablePay,
    ),
  {
    ssr: true,
  },
);

const SectionBlog = dynamic(
  async () =>
    import('apps/web/src/components/base-org/root/Redesign/Section/Blog').then(
      (mod) => mod.SectionBlog,
    ),
  {
    ssr: true,
  },
);

const SectionUnstableChain = dynamic(
  async () =>
    import('apps/web/src/components/base-org/root/Redesign/Section/UnstableChain').then(
      (mod) => mod.SectionUnstableChain,
    ),
  {
    ssr: true,
  },
);

export default async function Home() {
  return (
    <ErrorsProvider context="base_landing_page">
      <div id="webgl-canvas" className="absolute left-0 top-0 h-full w-full overflow-hidden">
        <div className="-z-1 h-full w-full">
          <WebGLCanvas />
        </div>
      </div>
      <Container className="lg:pt-0">
        <div className="col-span-full flex flex-col gap-12">
          <Hero />
          <SectionUnstableEcosystem />
          <SectionUnstableApp />
          <RenderOnInView>
            <SectionUnstableBuilders />
          </RenderOnInView>
          <RenderOnInView>
            <SectionUnstableChain />
          </RenderOnInView>
          <RenderOnInView>
            <SectionUnstablePay />
          </RenderOnInView>
          <RenderOnInView>
            <SectionUnstableJoin />
          </RenderOnInView>
          <RenderOnInView>
            <AnalyticsProvider context="blog_carousel">
              <SectionBlog />
            </AnalyticsProvider>
          </RenderOnInView>
        </div>
      </Container>
    </ErrorsProvider>
  );
}
