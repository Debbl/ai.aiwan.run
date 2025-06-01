import { generateGradient } from '~/utils/gradient'

export function Avatar({ size, rounded, username }: { size: number; rounded: number; username: string }) {
  const gradient = generateGradient(username || `${Math.random()}`)

  const text = username.slice(0, 2)

  const avatar = (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} version='1.1' xmlns='http://www.w3.org/2000/svg'>
      <g>
        <defs>
          <linearGradient id='gradient' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stopColor={gradient.fromColor} />
            <stop offset='100%' stopColor={gradient.toColor} />
          </linearGradient>
        </defs>
        <rect fill='url(#gradient)' x='0' y='0' width={size} height={size} rx={rounded} ry={rounded} />
        {text ? (
          <text
            x='50%'
            y='50%'
            alignmentBaseline='central'
            dominantBaseline='central'
            textAnchor='middle'
            fill='#fff'
            fontFamily='sans-serif'
            fontSize={(size * 0.9) / text.length}
          >
            {text}
          </text>
        ) : null}
      </g>
    </svg>
  )

  return avatar
}
