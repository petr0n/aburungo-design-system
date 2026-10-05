---
name: handoff-to-app
description: Use when an ADS component is finished and the AburunGo app at ../aburungo should adopt it — produces an integration spec (import, props, duplicates to delete, call sites to update) and optionally applies it.
---

# Handoff: ADS component → AburunGo app

Write an integration spec a developer who was not in the design conversation can apply without guesswork.

## 1. Scan

If the user named no component, ask which. Then run:

```
node .claude/skills/handoff-to-app/scan.mjs <Component> [...]
```

It reports the source file, whether it is exported and built, and every same-name file, import and call site in `../aburungo/src`. A non-zero exit means a component is missing, unexported or unbuilt — fix that (usually `pnpm build`) before going on.

## 2. Read

Read the component source. Extract every exported name, every prop (type, required, default), compound sub-components (`CardHeader`, `CardBody`), and implied peers (`audioSlot` expects an `AudioButton`).

Then read each same-name file and call site the scan listed. Also look for **partial duplicates** the scan cannot find: one-off Tailwind stacks or inline JSX that recreate the component's look. Record file and line range.

## 3. Write the spec

Fill `template.md` (same folder) once per component. Keep every heading; write `None` rather than dropping one.

## 4. Offer to apply

Ask: "Apply these changes to the AburunGo app now?" If yes:

1. Delete the listed files.
2. Apply each listed diff.
3. Apply any CSS change.
4. In `../aburungo`: `pnpm build && pnpm test`.
5. Report pass or fail, with output on fail.

## Hard rules

- Delete a file only after confirming nothing in it is uncovered by the ADS component.
- An app prop the ADS version lacks goes under **Gaps**. Never drop behaviour silently.
- Do not edit `src/components/` here during a handoff. A gap is an ADS follow-up, not a quick patch.
