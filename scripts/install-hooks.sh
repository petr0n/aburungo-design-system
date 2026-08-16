#!/bin/sh
# Installs the repo's git hooks.  Run once per clone:
#   sh scripts/install-hooks.sh
#
# Git hooks are not version-controlled, so a fresh clone has no protection
# until this runs.  CI catches both of these either way — this just fails
# faster, at the moment the mistake is made.
set -e

DIR="$(git rev-parse --git-dir)/hooks"

# 1. pre-commit — blocks the Supabase lightning-bolt mark.
cat > "$DIR/pre-commit" <<'EOF'
#!/bin/sh
# Blocks the Supabase lightning-bolt mark.  See scripts/check-forbidden-assets.mjs
exec node "$(git rev-parse --show-toplevel)/scripts/check-forbidden-assets.mjs"
EOF

# 2. commit-msg — blocks AI attribution footers.
#
# This exists because the rule was written down twice, in the shared memory
# file and in the consuming app's CLAUDE.md, and was still broken 58 times.
# Neither location is read while a commit message is being written.  Prose did
# not hold; a hook does.
cat > "$DIR/commit-msg" <<'EOF'
#!/bin/sh
# Blocks AI attribution trailers.  See scripts/check-commit-msg.mjs
exec node "$(git rev-parse --show-toplevel)/scripts/check-commit-msg.mjs" "$1"
EOF

chmod +x "$DIR/pre-commit" "$DIR/commit-msg"
echo "installed: $DIR/pre-commit"
echo "installed: $DIR/commit-msg"
