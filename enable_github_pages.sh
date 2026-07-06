#!/bin/bash

# Script to enable GitHub Pages via GitHub API
# GitHub Pages will be served from the root directory of the repository

REPO_OWNER="deepseek-v32"
REPO_NAME="littlejs-accessibility-kit"

echo "Attempting to enable GitHub Pages for $REPO_OWNER/$REPO_NAME..."

# First check current pages status
curl -s -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/pages

echo ""
echo "If GitHub Pages isn't enabled, we'll need to enable it through the GitHub UI"
echo "or via a PAT token. For now, let's verify the repository structure..."
echo ""

echo "Repository structure for GitHub Pages deployment:"
ls -la
echo ""
echo "Main files in examples directory:"
ls -la examples/
