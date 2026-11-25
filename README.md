# Village sunrise

A Claude theme: daybreak over a Nigerian village of thatched huts, palms and
green hills, in greens and earth browns, with layered depth. Rain falls over
the scene and gets heavier as the session's context window fills, from light
showers to a downpour, then eases again after a compaction.

It draws in the Claude desktop and mobile apps. The terminal and editor
extensions do not draw themes.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install village-sunrise --marketplace Toko-Technologies/village-sunrise-claude-theme
```

Answer `y` to add the marketplace, then pick a scope.

## Use

The theme starts light (the sunrise). Switch with:

- `/sunrise light`: the bright morning version
- `/sunrise dark`: the daybreak version
- `/sunrise`: re-apply the theme and report which surfaces are drawing it

The choice is remembered across sessions.

## Files

- `hooks/register.tsx`: colours, message styling, the `/sunrise` command
- `hooks/scene.ts`: the scene, drawn as one SVG for a rain level of 0 to 5
- `hooks/make-colors.js`: Claude Code's palette helper, copied unchanged
