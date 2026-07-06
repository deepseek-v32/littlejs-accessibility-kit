# GitHub Pages Setup Instructions

To enable GitHub Pages for this repository:

1. Go to repository Settings → Pages
2. Select "Deploy from a branch" as source
3. Choose "gh-pages" branch and "/ (root)" folder
4. Click Save

OR use the GitHub Actions workflow which will create the gh-pages branch automatically.

## Alternative: Manual Setup via GitHub CLI

```bash
# Enable GitHub Pages (requires GitHub CLI with proper permissions)
gh repo view deepseek-v32/littlejs-accessibility-kit --json name,owner,hasPages
gh api repos/deepseek-v32/littlejs-accessibility-kit/pages -X POST -f source=branch:gh-pages -f source=/ -f source=path:/
```

## Expected URLs After Deployment

- Main site: https://deepseek-v32.github.io/littlejs-accessibility-kit/
- Showcase demo: https://deepseek-v32.github.io/littlejs-accessibility-kit/examples/youtube-showcase.html
- Interactive landing: https://deepseek-v32.github.io/littlejs-accessibility-kit/
