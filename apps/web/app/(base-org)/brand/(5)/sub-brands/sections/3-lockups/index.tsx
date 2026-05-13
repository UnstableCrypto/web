import { ImageComponent, SvgImport } from 'apps/web/src/components/Brand/Image';
import SubBrandsLockupsSvg from './lockups.svg';

const svg = SubBrandsLockupsSvg as SvgImport;

const images = [
  {
    src: svg.src,
    alt: 'Sub Brands Lockups',
    width: svg.width,
    height: svg.height,
  },
];

export function SubBrandsLockups() {
  return (
    <ImageComponent
      id="sub-brands-lockups"
      title="Lockups"
      description={
        <>
          <span className="mb-4 block">
            Sub-brands organize our expanding product suite into clear pillars while keeping
            everything unmistakably Unstable. Each surface — Unstable App for everyday users, Unstable Build for
            developers, Unstable Pay for commerce, and future services — borrows the Square, Unstable Sans,
            and color core, then adds a functional descriptor.
          </span>
          <span className="mb-4 block">
            Naming pattern: &quot;base&quot; space descriptor. Visual Structure: descriptor in
            lowercase followed by the Square. Maintain palette parity and type pairing;
            differentiation comes from content tone and motion, not from new logos. Retire or merge
            sub-brands that lose strategic value.
          </span>
          <span className="mb-4 block">*Sub-Brand components have 3 lockup states.</span>
        </>
      }
      images={images}
    />
  );
}
