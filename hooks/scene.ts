// The village at sunrise, drawn as one SVG. `level` is 0 (light showers) to 5 (downpour).

const W = 1600
const H = 1000

// A small fixed-seed generator, so every redraw places things the same way.
const seeded = (seed: number) => {
  let s = seed

  return () => {
    s = (s * 16807) % 2147483647

    return (s - 1) / 2147483646
  }
}

const n = (value: number) => String(Math.round(value * 10) / 10)

const hut = (x: number, y: number, s: number, wall: string, shade: string, thatch: string, thatchShade: string) =>
  [
    `<ellipse cx="${n(x + 14 * s)}" cy="${n(y + 2 * s)}" rx="${n(34 * s)}" ry="${n(6 * s)}" fill="#3b2a14" opacity="0.28"/>`,
    `<rect x="${n(x - 20 * s)}" y="${n(y - 24 * s)}" width="${n(40 * s)}" height="${n(24 * s)}" fill="${wall}"/>`,
    `<rect x="${n(x + 2 * s)}" y="${n(y - 24 * s)}" width="${n(18 * s)}" height="${n(24 * s)}" fill="${shade}"/>`,
    `<rect x="${n(x - 10 * s)}" y="${n(y - 15 * s)}" width="${n(8 * s)}" height="${n(15 * s)}" fill="#4a2f16"/>`,
    `<path d="M${n(x - 29 * s)} ${n(y - 22 * s)}L${n(x)} ${n(y - 56 * s)}L${n(x + 29 * s)} ${n(y - 22 * s)}Z" fill="${thatch}"/>`,
    `<path d="M${n(x)} ${n(y - 56 * s)}L${n(x + 29 * s)} ${n(y - 22 * s)}L${n(x + 3 * s)} ${n(y - 22 * s)}Z" fill="${thatchShade}"/>`,
  ].join('')

const house = (x: number, y: number, s: number) =>
  [
    `<ellipse cx="${n(x + 18 * s)}" cy="${n(y + 2 * s)}" rx="${n(48 * s)}" ry="${n(7 * s)}" fill="#3b2a14" opacity="0.28"/>`,
    `<rect x="${n(x - 34 * s)}" y="${n(y - 30 * s)}" width="${n(68 * s)}" height="${n(30 * s)}" fill="#e2cfa4"/>`,
    `<rect x="${n(x + 8 * s)}" y="${n(y - 30 * s)}" width="${n(26 * s)}" height="${n(30 * s)}" fill="#c4ac7c"/>`,
    `<rect x="${n(x - 24 * s)}" y="${n(y - 20 * s)}" width="${n(10 * s)}" height="${n(20 * s)}" fill="#2f6b3a"/>`,
    `<rect x="${n(x - 6 * s)}" y="${n(y - 22 * s)}" width="${n(10 * s)}" height="${n(9 * s)}" fill="#5d3b1c"/>`,
    `<path d="M${n(x - 40 * s)} ${n(y - 29 * s)}L${n(x - 26 * s)} ${n(y - 48 * s)}L${n(x + 28 * s)} ${n(y - 48 * s)}L${n(x + 40 * s)} ${n(y - 29 * s)}Z" fill="#b5532f"/>`,
    `<path d="M${n(x + 6 * s)} ${n(y - 48 * s)}L${n(x + 28 * s)} ${n(y - 48 * s)}L${n(x + 40 * s)} ${n(y - 29 * s)}L${n(x + 10 * s)} ${n(y - 29 * s)}Z" fill="#8f3f24"/>`,
  ].join('')

const palm = (x: number, y: number, s: number, lean: number, trunk: string, frond: string, delay: number) => {
  const tx = x + lean * s
  const ty = y - 150 * s
  const fronds = [
    [-70, -18, -96, 34],
    [-56, -52, -104, -8],
    [-22, -70, -58, -52],
    [18, -72, 50, -56],
    [56, -50, 100, -4],
    [68, -14, 92, 40],
    [0, -30, 8, 44],
  ]
    .map(
      ([cx, cy, ex, ey]) =>
        `<path d="M${n(tx)} ${n(ty)}Q${n(tx + (cx ?? 0) * s)} ${n(ty + (cy ?? 0) * s)} ${n(tx + (ex ?? 0) * s)} ${n(ty + (ey ?? 0) * s)}" stroke="${frond}" stroke-width="${n(9 * s)}" stroke-linecap="round" fill="none"/>`,
    )
    .join('')

  return [
    `<ellipse cx="${n(x + 26 * s)}" cy="${n(y + 2 * s)}" rx="${n(40 * s)}" ry="${n(6 * s)}" fill="#2a3a14" opacity="0.25"/>`,
    `<path d="M${n(x)} ${n(y)}Q${n(x + lean * 0.2 * s)} ${n(y - 80 * s)} ${n(tx)} ${n(ty)}" stroke="${trunk}" stroke-width="${n(10 * s)}" stroke-linecap="round" fill="none"/>`,
    `<g class="sway" style="transform-origin:${n(tx)}px ${n(ty)}px;animation-delay:${n(delay)}s">${fronds}</g>`,
  ].join('')
}

const shadeTree = (x: number, y: number, s: number) =>
  [
    `<ellipse cx="${n(x + 30 * s)}" cy="${n(y + 3 * s)}" rx="${n(90 * s)}" ry="${n(10 * s)}" fill="#22330f" opacity="0.28"/>`,
    `<path d="M${n(x - 9 * s)} ${n(y)}L${n(x - 5 * s)} ${n(y - 70 * s)}L${n(x + 7 * s)} ${n(y - 70 * s)}L${n(x + 11 * s)} ${n(y)}Z" fill="#5a3b1e"/>`,
    `<ellipse cx="${n(x)}" cy="${n(y - 104 * s)}" rx="${n(84 * s)}" ry="${n(50 * s)}" fill="#2f7a34"/>`,
    `<ellipse cx="${n(x - 26 * s)}" cy="${n(y - 118 * s)}" rx="${n(52 * s)}" ry="${n(30 * s)}" fill="#4f9f3f"/>`,
    `<ellipse cx="${n(x + 34 * s)}" cy="${n(y - 88 * s)}" rx="${n(46 * s)}" ry="${n(26 * s)}" fill="#245f2b"/>`,
  ].join('')

const cloud = (x: number, y: number, s: number, fill: string, opacity: number) =>
  `<g opacity="${n(opacity)}" fill="${fill}">` +
  `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(120 * s)}" ry="${n(34 * s)}"/>` +
  `<ellipse cx="${n(x - 60 * s)}" cy="${n(y + 10 * s)}" rx="${n(80 * s)}" ry="${n(26 * s)}"/>` +
  `<ellipse cx="${n(x + 70 * s)}" cy="${n(y + 8 * s)}" rx="${n(90 * s)}" ry="${n(28 * s)}"/>` +
  `<ellipse cx="${n(x + 10 * s)}" cy="${n(y - 22 * s)}" rx="${n(70 * s)}" ry="${n(30 * s)}"/>` +
  `</g>`

// One tile of rain. Drops are drawn upright and the pattern is skewed, so the
// tile repeats cleanly along the direction the rain falls.
const SLANT = 0.2126

const rainLayer = (
  id: string,
  tile: number,
  drops: number,
  length: number,
  width: number,
  color: string,
  opacity: number,
  seed: number,
) => {
  const random = seeded(seed)
  let lines = ''

  for (let i = 0; i < drops; i++) {
    const x = 4 + random() * (tile - 8)
    const y = random() * (tile - length - 2)
    lines += `<line x1="${n(x)}" y1="${n(y)}" x2="${n(x)}" y2="${n(y + length)}"/>`
  }

  return {
    def: `<pattern id="${id}" width="${tile}" height="${tile}" patternUnits="userSpaceOnUse" patternTransform="skewX(-12)"><g stroke="${color}" stroke-width="${n(width)}" stroke-linecap="round">${lines}</g></pattern>`,
    rect: `<rect class="${id}" x="-200" y="${-tile}" width="${W + 500}" height="${H + tile}" fill="url(#${id})" opacity="${n(opacity)}"/>`,
    keyframes: `@keyframes ${id}{from{transform:translate(0px,0px)}to{transform:translate(${n(-SLANT * tile)}px,${tile}px)}}`,
  }
}

const pick = (values: readonly number[], level: number) => values[level] ?? values[values.length - 1] ?? 0

export const LEVELS = 6

export const buildScene = (rawLevel: number, dark = false): string => {
  const level = Math.max(0, Math.min(LEVELS - 1, Math.round(rawLevel)))

  const far = rainLayer('rainfar', 150, pick([3, 5, 8, 11, 15, 20], level), 9 + level * 1.4, 1, dark ? '#bcd6dc' : '#f4fbff', pick([0.3, 0.36, 0.42, 0.48, 0.54, 0.6], level), 11)
  const mid = rainLayer('rainmid', 220, pick([3, 5, 8, 12, 16, 22], level), 16 + level * 2.4, 1.6, dark ? '#c6dde2' : '#eef8ff', pick([0.34, 0.4, 0.46, 0.52, 0.58, 0.64], level), 29)
  const near = rainLayer('rainnear', 300, pick([2, 4, 7, 10, 14, 19], level), 26 + level * 4, 2.4, dark ? '#d5e6ea' : '#ffffff', pick([0.36, 0.42, 0.48, 0.54, 0.6, 0.66], level), 47)

  const farTime = pick([2.0, 1.8, 1.6, 1.45, 1.3, 1.15], level)
  const midTime = pick([1.6, 1.45, 1.3, 1.15, 1.0, 0.88], level)
  const nearTime = pick([1.25, 1.12, 1.0, 0.88, 0.78, 0.68], level)

  const gloom = pick([0, 0.05, 0.1, 0.15, 0.2, 0.25], level)
  const cloudFill = (dark ? ['#5d6f66', '#55665f', '#4c5c57', '#44534f', '#3c4a47', '#35413f'] : ['#ffffff', '#f6f4ec', '#e9ebe4', '#dadfd8', '#c9d0cb', '#b9c2bf'])[level] ?? '#ffffff'
  const cloudCover = pick([0.55, 0.62, 0.7, 0.78, 0.84, 0.9], level)
  const sunGlow = pick([1, 0.95, 0.88, 0.8, 0.72, 0.64], level)
  const puddles = pick([0, 0.15, 0.3, 0.45, 0.6, 0.7], level)

  const style = [
    far.keyframes,
    mid.keyframes,
    near.keyframes,
    '@keyframes drift{from{transform:translateX(-60px)}to{transform:translateX(60px)}}',
    '@keyframes sway{from{transform:rotate(-2.2deg)}to{transform:rotate(2.2deg)}}',
    '@keyframes turn{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
    '@keyframes breathe{from{opacity:0.75}to{opacity:1}}',
    '@keyframes ripple{0%{transform:scale(0.3);opacity:0}25%{opacity:1}100%{transform:scale(1);opacity:0}}',
    `.rainfar{animation:rainfar ${farTime}s linear infinite}`,
    `.rainmid{animation:rainmid ${midTime}s linear infinite}`,
    `.rainnear{animation:rainnear ${nearTime}s linear infinite}`,
    '.c1{animation:drift 90s ease-in-out infinite alternate}',
    '.c2{animation:drift 64s ease-in-out infinite alternate-reverse}',
    '.c3{animation:drift 46s ease-in-out infinite alternate}',
    '.mist{animation:drift 70s ease-in-out infinite alternate-reverse}',
    '.sway{animation:sway 7s ease-in-out infinite alternate}',
    '.rays{transform-origin:400px 560px;animation:turn 240s linear infinite}',
    '.glow{animation:breathe 9s ease-in-out infinite alternate}',
    '.ripple{transform-box:fill-box;transform-origin:center;animation:ripple 3.2s ease-out infinite}',
  ].join('')

  let rays = ''

  for (let i = 0; i < 12; i++) {
    rays += `<path d="M400 560L${n(400 + 900 * Math.cos((i * Math.PI) / 6 - 0.07))} ${n(560 + 900 * Math.sin((i * Math.PI) / 6 - 0.07))}L${n(400 + 900 * Math.cos((i * Math.PI) / 6 + 0.07))} ${n(560 + 900 * Math.sin((i * Math.PI) / 6 + 0.07))}Z"/>`
  }

  const ripples = [
    [1010, 842, 30, 0],
    [1100, 905, 44, 1.1],
    [935, 790, 20, 2.0],
    [1190, 962, 56, 0.6],
  ]
    .map(
      ([x, y, r, delay]) =>
        `<ellipse class="ripple" style="animation-delay:${n(delay ?? 0)}s" cx="${x}" cy="${y}" rx="${r}" ry="${n((r ?? 0) * 0.28)}" fill="none" stroke="#fff6e0" stroke-width="2" opacity="${n(puddles)}"/>`,
    )
    .join('')

  const grad = (id: string, top: string, bottom: string) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>`
  const hazeColor = dark ? '#f2b56a' : '#fff3d6'
  const hazeMax = dark ? 0.22 : 0.6
  const gloomColor = dark ? '#040d0a' : '#5f7f7c'

  const defs = [
    dark
      ? '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d2226"/><stop offset="0.36" stop-color="#1d3d38"/><stop offset="0.58" stop-color="#5d5a36"/><stop offset="0.76" stop-color="#b9772f"/><stop offset="1" stop-color="#e2933c"/></linearGradient>'
      : '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3df"/><stop offset="0.38" stop-color="#e4f0cf"/><stop offset="0.62" stop-color="#ffe2a6"/><stop offset="0.8" stop-color="#ffc56b"/><stop offset="1" stop-color="#ffb055"/></linearGradient>',
    dark
      ? '<radialGradient id="halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffd98a" stop-opacity="0.8"/><stop offset="0.35" stop-color="#f0a245" stop-opacity="0.4"/><stop offset="1" stop-color="#e08a30" stop-opacity="0"/></radialGradient>'
      : '<radialGradient id="halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff8dc" stop-opacity="0.95"/><stop offset="0.35" stop-color="#ffe49a" stop-opacity="0.55"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>',
    '<radialGradient id="sun" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#fffdf0"/><stop offset="0.6" stop-color="#ffe680"/><stop offset="1" stop-color="#ffbe3d"/></radialGradient>',
    '<radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.75"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>',
    dark ? grad('h1', '#35584c', '#44664f') : grad('h1', '#b9d3ad', '#d6e4bf'),
    dark ? grad('h2', '#2a4f3c', '#386145') : grad('h2', '#8dbb78', '#b3d39a'),
    dark ? grad('h3', '#22532f', '#2f6438') : grad('h3', '#5fa04f', '#86b866'),
    dark ? grad('h4', '#1d4b29', '#12331d') : grad('h4', '#4a943f', '#2f6f30'),
    dark ? grad('h5', '#143f20', '#0a2613') : grad('h5', '#2f7a33', '#1f5526'),
    dark ? grad('road', '#9a6a45', '#63361c') : grad('road', '#d79a63', '#a9592f'),
    `<linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hazeColor}" stop-opacity="0"/><stop offset="0.5" stop-color="${hazeColor}" stop-opacity="${hazeMax}"/><stop offset="1" stop-color="${hazeColor}" stop-opacity="0"/></linearGradient>`,
    `<linearGradient id="gloom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${gloomColor}"/><stop offset="1" stop-color="${gloomColor}" stop-opacity="0.2"/></linearGradient>`,
    far.def,
    mid.def,
    near.def,
  ].join('')

  const sky = [
    `<rect width="${W}" height="${H}" fill="url(#sky)"/>`,
    `<g opacity="${n(sunGlow)}">`,
    `<g class="rays" fill="${dark ? '#f5b765' : '#fff4c4'}" opacity="${dark ? 0.12 : 0.2}">` + rays + '</g>',
    '<circle class="glow" cx="400" cy="560" r="330" fill="url(#halo)"/>',
    '<circle cx="400" cy="560" r="62" fill="url(#sun)"/>',
    '</g>',
    '<g class="c1">' + cloud(1180, 150, 1.5, cloudFill, cloudCover * 0.8) + cloud(260, 110, 1.2, cloudFill, cloudCover * 0.75) + '</g>',
    '<g class="c2">' + cloud(760, 215, 1.1, cloudFill, cloudCover * 0.7) + cloud(1480, 290, 0.9, cloudFill, cloudCover * 0.65) + '</g>',
  ].join('')

  const distance = [
    '<path d="M0 600Q180 520 380 566T760 540T1150 560T1600 520V760H0Z" fill="url(#h1)"/>',
    far.rect,
    '<rect class="mist" x="-100" y="560" width="1800" height="110" fill="url(#haze)"/>',
    '<path d="M0 660Q220 580 470 632T900 604T1300 640T1600 598V820H0Z" fill="url(#h2)"/>',
    hut(1130, 640, 0.45, '#c79a6a', '#ad8254', '#a98a56', '#8f7244'),
    hut(1180, 646, 0.4, '#c79a6a', '#ad8254', '#a98a56', '#8f7244'),
    palm(1240, 644, 0.42, 8, '#8a714f', '#5d9b55', 1.5),
    palm(640, 628, 0.38, -6, '#8a714f', '#5d9b55', 3),
    '<rect class="mist" x="-100" y="620" width="1800" height="120" fill="url(#haze)" opacity="0.8"/>',
  ].join('')

  const village = [
    '<path d="M0 730Q260 650 560 700T1040 676T1600 700V1000H0Z" fill="url(#h3)"/>',
    '<path d="M960 1000Q1040 860 930 780Q870 736 905 700L925 700Q905 738 985 780Q1150 860 1300 1000Z" fill="url(#road)"/>',
    '<path d="M1130 1000Q1090 870 965 782Q915 742 920 700L925 700Q905 738 985 780Q1150 860 1300 1000Z" fill="#8f4a26" opacity="0.35"/>',
    ripples,
    shadeTree(1330, 742, 0.95),
    hut(700, 724, 0.8, '#c4854a', '#a2672f', '#9a7738', '#77592a'),
    house(1090, 738, 0.85),
    hut(1215, 760, 0.95, '#bf7d42', '#9c6130', '#93702f', '#705223'),
    palm(790, 730, 0.7, 14, '#6f4d2c', '#3f8a40', 0.4),
    palm(1440, 760, 0.8, -12, '#6f4d2c', '#3f8a40', 2.2),
    mid.rect,
    '<g class="c3">' + cloud(520, 330, 0.8, cloudFill, cloudCover * 0.5) + '</g>',
  ].join('')

  // Night lamps in the doorways and the house window, for the dark scene.
  const lamps = [
    [694, 718, 0.8],
    [1091, 723, 0.85],
    [1209, 753, 0.95],
    [241, 839, 1.5],
  ]
    .map(([x, y, s]) => {
      const size = s ?? 1

      return (
        `<circle class="glow" cx="${x}" cy="${y}" r="${n(46 * size)}" fill="url(#lamp)"/>` +
        `<rect x="${n((x ?? 0) - 4 * size)}" y="${n((y ?? 0) - 6 * size)}" width="${n(8 * size)}" height="${n(12 * size)}" fill="#ffd27a"/>`
      )
    })
    .join('')

  const front = [
    '<path d="M0 820Q200 740 470 790T860 798Q925 806 950 860Q968 930 960 1000H0Z" fill="url(#h4)"/>',
    '<path d="M1300 1000Q1260 890 1180 838Q1380 800 1600 830V1000Z" fill="url(#h4)"/>',
    '<g stroke="#245a27" stroke-width="5" opacity="0.5" fill="none"><path d="M40 860Q260 800 520 838"/><path d="M0 900Q280 836 640 876"/><path d="M0 944Q320 880 760 920"/></g>',
    hut(250, 850, 1.5, '#b87238', '#935724', '#8c6a2c', '#684b1f'),
    palm(96, 900, 1.45, 26, '#5d3f22', '#2c7533', 1.1),
    palm(1530, 930, 1.5, -30, '#5d3f22', '#2c7533', 2.8),
    '<path d="M0 940Q150 900 330 936T700 950T962 968V1000H0Z" fill="url(#h5)"/>',
    '<path d="M1250 1000Q1380 930 1600 950V1000Z" fill="url(#h5)"/>',
    '<g stroke="#17481f" stroke-width="4" stroke-linecap="round" fill="none"><path d="M420 968Q414 936 398 920"/><path d="M428 968Q430 930 446 914"/><path d="M436 968Q444 944 462 936"/><path d="M1400 978Q1394 948 1378 934"/><path d="M1408 978Q1412 944 1428 930"/><path d="M620 978Q614 950 600 938"/><path d="M628 978Q632 948 646 940"/></g>',
    dark ? `<rect width="${W}" height="${H}" fill="#06150f" opacity="0.4"/>` : '',
    dark ? lamps : '',
    `<rect width="${W}" height="${H}" fill="url(#gloom)" opacity="${n(gloom)}"/>`,
    near.rect,
  ].join('')

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    `<style>${style}</style><defs>${defs}</defs>` +
    sky +
    distance +
    village +
    front +
    '</svg>'
  )
}
