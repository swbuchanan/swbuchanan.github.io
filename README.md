# Steven Buchanan's website

This repository contains the Hugo source for
[swbuchanan.github.io](https://swbuchanan.github.io/). It includes articles,
research notes, and browser-based interactive demonstrations.

## Local development

Install Hugo 0.164.0 or later, Dart Sass, Node.js 20 or later, and
npm. Clone the theme submodule if it is not already present:

```sh
git submodule update --init --recursive
npm ci
npm run dev
```

The development server includes draft posts. Before opening a pull request,
run the same checks used by CI:

```sh
npm run typecheck
npm run build -- --destination .hugo-output
npm run check:links
```

Hugo compiles the interactive demonstrations from `assets/ts/`. The
TypeScript command validates them in strict mode without emitting files.

## Repository layout

- `content/` contains pages and posts.
- `layouts/` contains site-owned templates, partials, and shortcodes.
- `assets/` contains Hugo-pipeline assets and TypeScript source.
- `static/` contains files copied directly into the published site.
- `scripts/` contains explicit helpers for updating generated source data.
- `themes/hugo-texify3s/` is the Hugo theme submodule.

Hugo output (`public/` and `.hugo-output/`), generated resource caches, and
Node dependencies are intentionally ignored. GitHub Actions builds into a
fresh directory, validates the generated HTML and internal links on pull
requests, and deploys only successful non-pull-request builds to GitHub Pages.
