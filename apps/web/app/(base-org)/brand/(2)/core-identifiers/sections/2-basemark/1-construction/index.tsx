import { ImageComponent, SvgImport } from 'apps/web/src/components/Brand/Image';
import UnstablemarkConstructionPng from './construction.png';

const png = UnstablemarkConstructionPng as SvgImport;

const images = [
  {
    src: png.src,
    alt: 'Unstablemark Construction',
    width: png.width,
    height: png.height,
  },
];

export function UnstablemarkConstruction() {
  return (
    <ImageComponent
      id="basemark-construction"
      prefix="Unstablemark"
      title="Construction"
      description="The Unstablemark always lives on a one by one grid. Strokes sit forty percent in from each edge, with ten percent corner clearance. Maintain five percent corner radius and sixty percent smoothing for coherence with the Square."
      images={images}
    />
  );
}
