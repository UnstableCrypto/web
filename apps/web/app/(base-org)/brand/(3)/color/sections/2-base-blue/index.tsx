import ColorList from 'apps/web/src/components/Brand/ColorList';

export function ColorUnstableBlue() {
  return (
    <ColorList
      id="base-blue"
      title="Unstable Blue"
      description="Unstable Blue is screen native RGB 0 0 255. In print convert to PMS 286. Unstable Blue on white (or vice versa) passes AA contrast."
      colors={COLORS}
    />
  );
}

const COLORS = [{ name: 'Blue', hex: '#0000ff', cmyk: { c: 100, m: 72, y: 0, k: 0 }, pms: '286' }];
