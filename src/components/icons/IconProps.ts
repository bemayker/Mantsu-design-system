/** Shared shape for the Mantsu module icons. */
export type IconProps = {
  /** Rendered width and height in px. Defaults to 20, the rail's icon size. */
  size?: number;
  className?: string;
  /**
   * Accessible name. Omit for a decorative icon that sits next to a text label,
   * which is the case everywhere in the rail; the icon then renders
   * `aria-hidden` so a screen reader announces the label once, not twice.
   */
  title?: string;
};
