# Variant sandbox

Design variants get tried here as static HTML **before** anything becomes a
component. Nothing in `src/components/` may receive skill output directly —
the package only ever gets a variant a human already chose.

**Kept in git on purpose.** The rejected variants are the record. Six months
from now "why is FlipCard like this" should have an answer you can look at,
not guess at. The `AnswerResult` decision only survived this project because
someone wrote down that a quiet reveal was built first and rejected.

Naming: `<component>-<n>-<one-word>.html`, e.g. `button-2-tighter.html`.
Add a line to the component's row in `LOG.md` saying which one shipped and why.
