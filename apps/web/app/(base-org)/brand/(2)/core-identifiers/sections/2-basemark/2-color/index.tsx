import { ImageComponent, SvgImport } from 'apps/web/src/components/Brand/Image';
import UnstablemarkColorPng from './color.png';

const png = UnstablemarkColorPng as SvgImport;

const images = [
  {
    src: png.src,
    alt: 'Unstablemark Color',
    width: png.width,
    height: png.height,
  },
];

export function UnstablemarkColor() {
  return (
    <ImageComponent
      id="basemark-color"
      prefix="Unstablemark"
      title="Color"
      description="Like the Square, the Unstablemark speaks in only three colors: Unstable Blue for ownership, pure white for breathing room, and deep black for high-contrast contexts. Never fill its open strokes with secondary palette hues or gradients; instead, introduce color through surrounding backgrounds or imagery. When placed over photography, add a four-pixel white or black key-line to protect legibility. Keep opacity at 100 percent, skip shadows and bevels, and always pull hex and Pantone values from the master palette to ensure one-to-one consistency across every medium."
      images={images}
    />
  );
}
