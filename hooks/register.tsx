import type { EngineInterface, Register, SessionContextUsage, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene, LEVELS } from './scene'

type Mode = 'dark' | 'light'

const ROLES = { accent: '#2a7a4b', danger: '#b5402c', success: '#6a8f1e', warning: '#b0741a', pro: '#8a5a33' }

// Morning light on green fields and laterite earth.
const light = makeColors({
  label: 'Village sunrise',
  only: 'light',
  roles: ROLES,
  light: {
    gray: {
      anchors: {
        'surface-0': '#e8edd6',
        'surface-1': '#f0f3e1',
        'surface-2': '#f8f8ec',
        'text-primary': '#27231a',
        'text-secondary': '#4a4334',
        'text-muted': '#645b48',
      },
    },
    git: { added: '#3f8a3a', removed: '#b5402c', modified: '#a86f14' },
  },
})

// The same village before first light: deep forest greens and dark earth.
const dark = makeColors({
  label: 'Village daybreak',
  only: 'dark',
  roles: ROLES,
  dark: {
    gray: {
      anchors: {
        'surface-0': '#121a13',
        'surface-1': '#182118',
        'surface-2': '#1e281d',
        'surface-3': '#232e22',
        'text-primary': '#eef0df',
        'text-secondary': '#cfd3ba',
        'text-muted': '#aeb398',
      },
    },
  },
})

const SCENE = 'village-sunrise'

// Near-solid cards under the words, so the scene shows around them, not through them.
const LOOKS: Record<Mode, { base: ThemeSetArgs; full: ThemeSetArgs; problems: string[] }> = {
  light: (() => {
    const base: ThemeSetArgs = {
      colors: light.theme,
      overrideColorScheme: 'light',
      backdrop: { scene: SCENE, glass: { blur: 22, tint: '#f7f5e6', opacity: 0.8 } },
    }

    return {
      base,
      problems: light.problems,
      full: {
        ...base,
        style: {
          Text: { color: '#1a160e' },
          AssistantMessage: { color: '#1a160e', backgroundColor: '#fafaeff2', radius: 14, paddingX: 16, paddingY: 12 },
          UserMessage: { color: '#1a160e', backgroundColor: '#e3edcdf5', radius: 14, borderColor: '#9dbb86', borderWidth: 1 },
          ToolUse: { color: '#2a2418', backgroundColor: '#f4f3e4ee', radius: 8, paddingX: 8 },
        },
      },
    }
  })(),
  dark: (() => {
    const base: ThemeSetArgs = {
      colors: dark.theme,
      overrideColorScheme: 'dark',
      backdrop: { scene: SCENE, glass: { blur: 22, tint: '#0f1710', opacity: 0.74 } },
    }

    return {
      base,
      problems: dark.problems,
      full: {
        ...base,
        style: {
          Text: { color: '#f1f2e3' },
          AssistantMessage: { color: '#f1f2e3', backgroundColor: '#141c15f0', radius: 14, paddingX: 16, paddingY: 12 },
          UserMessage: { color: '#f1f2e3', backgroundColor: '#22361ff5', radius: 14, borderColor: '#4f7a4a', borderWidth: 1 },
          ToolUse: { color: '#dfe2cc', backgroundColor: '#182018ee', radius: 8, paddingX: 8 },
        },
      },
    }
  })(),
}

const RAIN = ['light showers', 'steady drizzle', 'steady rain', 'heavy rain', 'very heavy rain', 'downpour']

// How full the context window is, as a rain level from 0 to 5.
const levelOf = (context: SessionContextUsage): number => {
  const percent = context.percent ?? (context.tokens !== undefined && context.window > 0 ? (context.tokens / context.window) * 100 : 0)

  return Math.max(0, Math.min(LEVELS - 1, Math.floor(percent / (100 / LEVELS))))
}

async function apply($: EngineInterface, mode: Mode) {
  try {
    return await $.theme.set(LOOKS[mode].full)
  } catch (error) {
    $.ui.log(`village-sunrise: ${String(error)}`)

    return $.theme.set(LOOKS[mode].base)
  }
}

export const register: Register = on => {
  let level = 0
  let mode: Mode = 'light'
  const asks: Record<string, number> = {}

  on('session.start', async ($, e, next) => {
    mode = (await $.store.get('mode')) === 'dark' ? 'dark' : 'light'
    const unpainted = LOOKS[mode].problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    level = levelOf((await $.session.usage()).context)
    const set = await apply($, mode)

    if (!set.isDrawn) {
      $.ui.log(`village-sunrise: ${set.reason}`)
    }

    await $.command.register({
      name: 'sunrise',
      description: 'Village sunrise theme: "/sunrise dark" or "/sunrise light" switches it; alone, re-applies it and says where it draws',
      argumentHint: '[dark|light]',
    })

    return next(e)
  })

  // A phone or window that joins later is sent the look afresh.
  on('session.attach', async ($, e, next) => {
    const joined = await next(e)
    await apply($, mode)
    await $.ui.invalidate('ui.render')

    return joined
  })

  on('command.run', { command: 'sunrise' }, async ($, e) => {
    const asked = e.args.trim().toLowerCase()

    if (asked === 'dark' || asked === 'light') {
      mode = asked
      await $.store.set('mode', mode)
    }

    const set = await apply($, mode)
    await $.ui.invalidate('ui.render')
    const surfaces = (await $.session.surfaces()).join(', ') || 'none'
    const drawn = Object.entries(asks).map(([surface, count]) => `${surface} ${count}`).join(', ') || 'none yet'

    return {
      text: `Village sunrise (${mode}): ${set.isDrawn ? 'a client that draws themes is attached' : `not drawn (${set.reason})`}. Surfaces attached: ${surfaces}. Backdrop asked for by: ${drawn}. Rain level ${level + 1} of ${LEVELS}.`,
    }
  })

  on('session.measure', async ($, e, next) => {
    const now = levelOf(e.context)

    if (now !== level) {
      level = now
      await $.ui.invalidate('ui.render')
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.props.scene !== SCENE || (e.surface !== 'desktop' && e.surface !== 'mobile')) {
      return next(e)
    }

    asks[e.surface] = (asks[e.surface] ?? 0) + 1
    const { Svg } = $.ui.resolve(e)

    return (
      <Svg
        source={buildScene(level, mode === 'dark')}
        alt={`${mode === 'dark' ? 'Daybreak' : 'Sunrise'} over a Nigerian village of thatched huts, palms and green hills, with ${RAIN[level] ?? 'rain'} falling`}
        isInteractive
      />
    )
  })
}
