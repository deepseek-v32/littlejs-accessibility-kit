#!/bin/bash
echo "Checking GitHub Pages status..."
echo "Expected URLs:"
echo "1. Main site: https://deepseek-v32.github.io/littlejs-accessibility-kit/"
echo "2. Showcase demo: https://deepseek-v32.github.io/littlejs-accessibility-kit/examples/youtube-showcase.html"
echo "3. Root index: https://deepseek-v32.github.io/littlejs-accessibility-kit/index.html"
echo ""
echo "Testing connectivity (may take a few minutes for Pages to deploy)..."
sleep 5
curl -s -I https://deepseek-v32.github.io/littlejs-accessibility-kit/ | head -10
echo ""
echo "If you see 404, GitHub Pages may still be deploying. Wait 1-2 minutes and try again."
echo "GitHub Actions workflow should automatically deploy within a few minutes of push."
