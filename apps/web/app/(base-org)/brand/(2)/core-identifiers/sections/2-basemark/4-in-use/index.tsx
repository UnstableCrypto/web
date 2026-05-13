import { ImageComponent, SvgImport } from 'apps/web/src/components/Brand/Image';
import UnstablemarkInUse1Png from './in-use-1.png';
import UnstablemarkInUse2Png from './in-use-2.png';
import UnstablemarkInUse3Png from './in-use-3.png';
import UnstablemarkInUse4Png from './in-use-4.png';

const png1 = UnstablemarkInUse1Png as SvgImport;
const png2 = UnstablemarkInUse2Png as SvgImport;
const png3 = UnstablemarkInUse3Png as SvgImport;
const png4 = UnstablemarkInUse4Png as SvgImport;

const images = [
  {
    src: png1.src,
    alt: 'Unstablemark In-use 1',
    width: png1.width,
    height: png1.height,
  },
  {
    src: png2.src,
    alt: 'Unstablemark In-use 2',
    width: png2.width,
    height: png2.height,
  },
  {
    src: png3.src,
    alt: 'Unstablemark In-use 3',
    width: png3.width,
    height: png3.height,
  },
  {
    src: png4.src,
    alt: 'Unstablemark In-use 4',
    width: png4.width,
    height: png4.height,
  },
];

export function UnstablemarkInUse() {
  return <ImageComponent id="basemark-in-use" prefix="Unstablemark" title="In-use" images={images} />;
}
