#!/bin/sh
# Installs the pre-commit brand check.  Run once per clone:
#   sh scripts/install-hooks.sh
#
# Git hooks are not version-controlled, so a fresh clone has no protection
# until this runs.  CI catches it either way — this just fails faster.
set -e

HOOK="$(git rev-parse --git-dir)/hooks/pre-commit"

cat > "$HOOK" <<'EOF'
#!/bin/sh
# Blocks the Supabase lightning-bolt mark.  See scripts/check-forbidden-assets.mjs
exec node "$(git rev-parse --show-toplevel)/scripts/check-forbidden-assets.mjs"
EOF

chmod +x "$HOOK"
echo "installed: $HOOK"
