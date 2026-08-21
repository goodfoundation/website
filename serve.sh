#!/usr/bin/env bash
# Serve the site locally at http://127.0.0.1:4000
set -euo pipefail

cd "$(dirname "$0")"

# Jekyll 4 needs Ruby >= 2.7; macOS system Ruby is 2.6, so prefer a managed one.
supports_jekyll_ruby() {
  "$1" -e 'major, minor = RUBY_VERSION.split(".").map(&:to_i); exit major > 2 || (major == 2 && minor >= 7)' 2>/dev/null
}

if ! supports_jekyll_ruby ruby; then
  for candidate in "$HOME"/.rubies/*/bin /opt/homebrew/opt/ruby/bin /usr/local/opt/ruby/bin; do
    if [[ -x "$candidate/ruby" ]] &&
      supports_jekyll_ruby "$candidate/ruby"; then
      export PATH="$candidate:$PATH"
      break
    fi
  done
fi

if ! supports_jekyll_ruby ruby; then
  echo "Ruby >= 2.7 is required (found $(ruby -v 2>/dev/null || echo 'no ruby'))." >&2
  echo "Install one with 'brew install ruby' or a version manager, then re-run." >&2
  exit 1
fi

if ! command -v bundle >/dev/null 2>&1; then
  gem install bundler
fi

bundle config set --local path vendor/bundle
bundle check >/dev/null 2>&1 || bundle install

exec bundle exec jekyll serve --livereload "$@"
