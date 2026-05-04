/**
 * Lightweight wrapper for Material Symbols Sharp.
 * Renders a <span> with the CSS font class — no JS library, SSR-safe.
 * The font is loaded via `react-material-symbols/sharp` CSS in layout.tsx.
 */
type IconProps = {
  name: string
  size?: number
  fill?: boolean
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  className?: string
}

export function Icon({ name, size = 20, fill = false, weight = 400, className }: IconProps) {
  return (
    <span
      className={`material-symbols${className ? ` ${className}` : ""}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
      }}
    >
      {name}
    </span>
  )
}
