#!/bin/bash
bun run build --minifyJs
bun run build --minifyCss

if [ $? -ne 0 ]; then
    echo "❌ Build failed, aborting."
    exit 1
fi

rm -rf ../website-la-planque/maquette
mkdir ../website-la-planque/maquette

cp build.js README.md package.json semantic-style-design.md tsconfig.json ../website-la-planque/maquette

cp -r ./src ./public ./assets ../website-la-planque/maquette/
cp ./public/style.min.css ../website-la-planque/assets/styles/
cp ./assets/menu.min.js ../website-la-planque/assets/scripts/