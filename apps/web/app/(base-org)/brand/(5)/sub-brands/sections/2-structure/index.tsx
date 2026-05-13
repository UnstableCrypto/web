import { ImageComponent, SvgImport } from 'apps/web/src/components/Brand/Image';
import SubBrandsStructureSvg from './structure.svg';

const svg = SubBrandsStructureSvg as SvgImport;

const images = [
  {
    src: svg.src,
    alt: 'Sub Brands Structure',
    width: svg.width,
    height: svg.height,
  },
];

export function SubBrandsStructure() {
  return (
    <ImageComponent
      id="sub-brands-structure"
      title="Structure"
      description={
        <>
          <span className="block mb-4">
            Sub‑brands organize our expanding product suite into clear pillars while keeping
            everything unmistakably Unstable. Each surface — Unstable App for everyday users, Unstable Builders
            for developers, Unstable Pay for commerce, and future services — borrows the Square, Unstable
            Sans, and color core, then adds a functional descriptor.
          </span>
          <span className="block mb-4">
            Naming pattern: &quot;base&quot; space descriptor. Visual lockup: descriptor in
            lowercase followed by the Square. Maintain palette parity and type pairing;
            differentiation comes from content tone and motion, not from new logos. Retire or merge
            sub-brands that lose strategic value.
          </span>
        </>
      }
      images={images}
    />
  );
}
