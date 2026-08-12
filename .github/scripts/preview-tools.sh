#!/usr/bin/env bash
# Werkzeuge für die Branch-Vorschauen unter /preview/.
#
# Wird von build_and_deploy.yml und preview_cleanup.yml genutzt.
# Muss aus einem Checkout des gh-pages-Branches heraus laufen.
#
#   list      Vorschauen auflisten (ein Branchname pro Zeile)
#   prune     Vorschauen entfernen, deren Branch es nicht mehr gibt
#   remove B  eine bestimmte Vorschau entfernen
#   index     preview/index.html neu erzeugen
set -euo pipefail

# Eine Vorschau ist ein Verzeichnis unter preview/, das eine sitemap.xml
# enthält. Hugo legt die nur im Wurzelverzeichnis einer Seite an, dadurch
# werden Unterseiten (preview/<branch>/about/) nicht mitgezählt.
list_previews() {
  [ -d preview ] || return 0
  find preview -mindepth 2 -maxdepth 5 -name sitemap.xml -printf '%h\n' 2>/dev/null \
    | sed 's|^preview/||' \
    | sort
}

remove_preview() {
  local branch="$1"
  if [ -z "$branch" ] || [ "$branch" != "${branch#/}" ] || [ "$branch" != "${branch#*..}" ]; then
    echo "Ungültiger Branchname: '$branch'" >&2
    return 1
  fi
  if [ -d "preview/$branch" ]; then
    rm -rf "preview/$branch"
    echo "Entfernt: preview/$branch"
    # Leere Elternverzeichnisse mit aufräumen (z.B. preview/feature/)
    find preview -mindepth 1 -type d -empty -delete 2>/dev/null || true
    return 0
  fi
  echo "Nichts zu entfernen: preview/$branch existiert nicht"
  return 0
}

prune_previews() {
  local removed=0
  while read -r branch; do
    [ -n "$branch" ] || continue
    if git ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1; then
      echo "Branch vorhanden, bleibt: $branch"
    else
      echo "Branch gelöscht, räume auf: $branch"
      remove_preview "$branch"
      removed=$((removed + 1))
    fi
  done < <(list_previews)
  echo "Aufgeräumt: $removed"
}

write_index() {
  mkdir -p preview
  local previews
  previews="$(list_previews)"

  {
    cat <<'HTML'
<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Branch-Vorschauen</title>
<style>
  :root { color-scheme: dark; }
  body {
    margin: 0; padding: 48px 24px;
    background: #161A12; color: #ECEAE0;
    font-family: ui-sans-serif, system-ui, sans-serif; line-height: 1.6;
  }
  .wrap { max-width: 760px; margin: 0 auto; }
  h1 { font-size: 28px; margin: 0 0 6px; }
  p.sub { color: #A8AD9A; margin: 0 0 32px; }
  ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
  li a {
    display: block; padding: 16px 18px;
    background: #1E2418; border: 1px solid #333A29; border-radius: 12px;
    color: #2BFF8A; text-decoration: none; font-weight: 600;
    word-break: break-word;
  }
  li a:hover { border-color: #2BFF8A; }
  footer { margin-top: 36px; color: #A8AD9A; font-size: 14px; }
  footer a { color: #2BFF8A; }
  .empty { color: #A8AD9A; }
</style>
</head>
<body>
<div class="wrap">
<h1>Branch-Vorschauen</h1>
<p class="sub">Automatisch erzeugt. Jeder Eintrag ist der Stand eines Branches.</p>
HTML

    if [ -z "$previews" ]; then
      echo '<p class="empty">Zurzeit keine Vorschauen.</p>'
    else
      echo '<ul>'
      while read -r branch; do
        [ -n "$branch" ] || continue
        printf '<li><a href="/preview/%s/">%s</a></li>\n' "$branch" "$branch"
      done <<< "$previews"
      echo '</ul>'
    fi

    cat <<'HTML'
<footer><a href="/">Zur Hauptseite</a></footer>
</div>
</body>
</html>
HTML
  } > preview/index.html

  echo "preview/index.html geschrieben ($(printf '%s' "$previews" | grep -c . || true) Einträge)"
}

case "${1:-}" in
  list)   list_previews ;;
  prune)  prune_previews; write_index ;;
  remove) remove_preview "${2:?Branchname fehlt}"; write_index ;;
  index)  write_index ;;
  *) echo "Nutzung: $0 {list|prune|remove <branch>|index}" >&2; exit 1 ;;
esac
