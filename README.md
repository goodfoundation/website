# Good Software Foundation — website

Static single-page site built with [Jekyll](https://jekyllrb.com/) and deployed to
GitHub Pages by [.github/workflows/pages.yml](.github/workflows/pages.yml) on every
push to `main`.

> This file is listed under `exclude:` in `_config.yml`, so it is never published.

## Run it locally

```sh
./serve.sh
```

Then open <http://127.0.0.1:4000>. The script picks a Ruby >= 2.7 (Jekyll 4 will
not run on the macOS system Ruby 2.6), installs gems into `vendor/bundle` on
first run, and serves with live reload. Changes to `_data`, `_includes`,
`index.html` and `assets/css` rebuild automatically. Extra arguments are passed
through to Jekyll, e.g. `./serve.sh --port 4321`.

If you manage Ruby yourself, the equivalent manual steps are:

```sh
bundle install
bundle exec jekyll serve --livereload
```

To check the production build:

```sh
JEKYLL_ENV=production bundle exec jekyll build
```

## Editing content

Most changes need no HTML. Edit the YAML files in `_data/`.

### Project cards — `_data/projects.yml`

Each list entry becomes one card, in file order.

```yaml
- name: Open Ledger                  # card heading
  tagline: Transparent finances      # accent line under the heading
  icon: ledger                       # see "Icons" below
  status: Active                     # optional pill; omit to hide it
  description: >-
    Two or three sentences about the project.
  tags: [TypeScript, Postgres]       # optional chips; omit to hide them
  links:
    - label: Visit website
      url: https://example.org
      primary: true                  # renders in the accent colour
    - label: Source
      url: https://github.com/goodfoundation/open-ledger
```

`status` also styles the pill. `Active` is green, `Incubating` is amber, anything
else falls back to neutral grey. To add another colour, append a
`.badge--yourstatus` rule in [assets/css/main.scss](assets/css/main.scss) (the
class is the lowercased status).

### Principles — `_data/principles.yml`

```yaml
- title: Open by default
  icon: code
  body: >-
    One or two sentences.
```

### Impact numbers — `_data/stats.yml`

```yaml
- value: "40+"          # keep quoted so YAML treats it as a string
  label: Contributors
  note: Volunteers and funded maintainers
```

The stats grid is four columns on desktop, so multiples of four look best.

### Prose, headings and section order

Section copy (hero, "Who we are", the closing call to action) lives directly in
[index.html](index.html). Section order and the anchor IDs used by the nav are
also defined there. If you rename or add a section ID, update the matching links
in [_includes/header.html](_includes/header.html) (both the desktop and mobile
lists) and [_includes/footer.html](_includes/footer.html).

### Site-wide settings — `_config.yml`

Title, tagline, description, `email`, `github_org` and the `social` list feed the
header, footer and SEO tags. Update `url` if the domain changes.

## Icons

Icons are inline SVGs defined in one place: [_includes/icon.html](_includes/icon.html).
Available names: `heart`, `code`, `ledger`, `mail`, `book`, `map`, `sprout`,
`shield`, `arrow`, `external`, `github`.

To add one, add a `{%- when "yourname" -%}` branch with path data drawn on a
24×24 grid. Use `fill="none"` strokes only — the icon inherits colour and stroke
settings from the wrapper. Then reference `icon: yourname` from a data file.

## Scroll animations

Add `data-reveal` to any element to make it fade and rise into view as it scrolls
in. Add `data-reveal-delay="1"` (2, 3, …) to stagger a group; each step is 90 ms.

```html
<div data-reveal data-reveal-delay="2">…</div>
```

The behaviour lives in [assets/js/main.js](assets/js/main.js). It is skipped
entirely for visitors with `prefers-reduced-motion`, and elements stay visible if
JavaScript fails to load.

## Styling

All CSS is in [assets/css/main.scss](assets/css/main.scss). Colours, spacing,
radii, shadows and fonts are CSS custom properties in the `:root` block at the
top — change the palette there rather than hunting through rules.

| Token | Meaning |
| --- | --- |
| `--ink`, `--ink-soft`, `--ink-faint` | Text colours, darkest to lightest |
| `--accent`, `--accent-soft` | Terracotta highlight and its tint |
| `--bg`, `--bg-muted` | White and the warm grey section band |
| `--line`, `--line-strong` | Borders |

Breakpoints are at 960px, 780px (nav collapses to the hamburger) and 520px.

## Logos

- `assets/gsf-mark.svg` — heart mark only, strokes use `currentColor` so it can
  be tinted with CSS. Used in the header and as the favicon.
- `assets/good-software-foundation.svg` — full lockup with wordmark. Used in the
  footer.
- `assets/gsf-logo-white-bg.png` — raster fallback, used for the Apple touch icon.

## Deploying

Push to `main`. The workflow installs gems, builds with `JEKYLL_ENV=production`
and publishes the artifact. Requires **Settings → Pages → Source: GitHub Actions**.

For a custom domain, add a `CNAME` file at the repository root containing the
domain, and keep `baseurl` empty in `_config.yml`. Without a custom domain the
workflow injects the correct `--baseurl` automatically.
