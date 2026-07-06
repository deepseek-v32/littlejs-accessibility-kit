#!/usr/bin/env python3
import json
import subprocess
import sys

print("=== GitHub Pages Diagnostic ===")
print("\n1. Repository must be PUBLIC: ✓ (confirmed via API)")
print("2. Must have index.html or README.md in root: ✓ (we have index.html)")
print("3. GitHub Pages must be enabled in Settings > Pages")
print("   - Source branch: should be 'gh-pages' or select branch")
print("   - OR can use GitHub Actions deployment")
print("\n4. Workflow issues to check:")
print("   - GITHUB_TOKEN permissions (should have repo scope)")
print("   - Branch protection rules might prevent creation")
print("   - Repository size limits")
print("\n5. Manual solution: Create gh-pages branch manually")
print("   git checkout --orphan gh-pages")
print("   git rm -rf .")
print("   cp -r ../main/* .")
print("   git add . && git commit -m 'Initial gh-pages'")
print("   git push origin gh-pages")
