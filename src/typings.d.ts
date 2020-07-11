/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

interface SvgrComponent extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module '*.svg' {
  const svgUrl: string;
  const svgComponent: SvgrComponent;
  export default svgUrl;
  export { svgComponent as ReactComponent }
}

declare module 'fscreen';

interface FullScreenHandle {
  active: boolean;
  enter: () => void;
  exit: () => void;
  node: React.MutableRefObject<HTMLDivElement | null>;
}

interface FullScreenProps {
  handle: FullScreenHandle;
  onChange?: (state: boolean, handle: FullScreenHandle) => void;
}
