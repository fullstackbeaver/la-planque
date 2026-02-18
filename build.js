import { existsSync, watch } from 'fs';
import { file, write }       from "bun";
import fs                    from 'fs/promises';
import { glob }              from "glob";
import { minify }            from '@minify-html/node';
import { minify as minJs }   from "terser";
import { transform }         from "lightningcss";

async function exec(cmd, options = {}) {
  console.log(`   💻 ${cmd}`);
  try {
    const proc = Bun.spawn(cmd.split(' '), {
      stdout: "inherit",
      stderr: "inherit",
      ...options
    });
    await proc.exited;
    return proc.exitCode === 0;
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
    return false;
  }
}

async function collectComponentStyles(path) {
  const componentDirs = await glob(path);
  const styleFiles = [];

  for (const dir of componentDirs) {
    const scssFiles = await glob(`${dir}/*.scss`);
    scssFiles.forEach(file => styleFiles.push(file));
  }

  return styleFiles;
}

function parseAttributes(tagString) {
  const attrs = {
    classes: [],
    dataAttrs: {},
    otherAttrs: {},
    booleanAttrs: []
  };

  const match = tagString.match(/<([a-zA-Z][a-zA-Z0-9-]*)\s*([^>]*)>/);
  if (!match) return attrs;

  const attrString = match[2].trim();
  if (!attrString) return attrs;

  let remainingString = attrString;
  const attrWithValueRegex = /([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*"([^"]*)"|([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*'([^']*)'/g;
  let attrMatch;

  const processedAttrs = new Set();

  while ((attrMatch = attrWithValueRegex.exec(attrString)) !== null) {
    const name = attrMatch[1] || attrMatch[3];
    const value = attrMatch[2] || attrMatch[4];
    processedAttrs.add(name);

    if (name === 'class') {
      attrs.classes = value.split(/\s+/).filter(Boolean);
    } else if (name.startsWith('data-')) {
      attrs.dataAttrs[name] = value;
    } else {
      attrs.otherAttrs[name] = value;
    }

    remainingString = remainingString.replace(attrMatch[0], ' ');
  }

  const words = remainingString.split(/\s+/).filter(Boolean);
  for (const word of words) {
    if (/^[a-zA-Z][a-zA-Z0-9-]*$/.test(word) && !processedAttrs.has(word)) {
      attrs.booleanAttrs.push(word);
    }
  }

  return attrs;
}

function injectAttributes(template, attrs) {
  const { classes, dataAttrs, otherAttrs, booleanAttrs } = attrs;

  const firstTagMatch = template.match(/(<[a-zA-Z][a-zA-Z0-9-]*)([\s>])/);
  if (!firstTagMatch) return template;

  const tagStart = firstTagMatch[1];
  const tagStartIndex = template.indexOf(firstTagMatch[0]);

  let attrsToAdd = '';

  // Gestion des classes
  if (classes.length > 0) {
    const existingClassMatch = template.match(new RegExp(`${tagStart}[^>]*class=["']([^"']*)["']`));

    if (existingClassMatch) {
      const existingClasses = existingClassMatch[1].split(/\s+/).filter(Boolean);
      const allClasses = [...new Set([...existingClasses, ...classes])];
      template = template.replace(
        new RegExp(`(${tagStart}[^>]*)class=["'][^"']*["']`),
        `$1class="${allClasses.join(' ')}"`
      );
    } else {
      attrsToAdd += ` class="${classes.join(' ')}"`;
    }
  }

  // Gestion des data-attributes
  for (const [name, value] of Object.entries(dataAttrs)) {
    // Échapper les guillemets dans la valeur si nécessaire
    const escapedValue = value.replace(/"/g, '"');
    attrsToAdd += ` ${name}="${value}"`;
  }

  // Gestion des autres attributs
  for (const [name, value] of Object.entries(otherAttrs)) {
    attrsToAdd += ` ${name}="${value}"`;
  }

  // Gestion des attributs booléens
  for (const name of booleanAttrs) {
    attrsToAdd += ` ${name}`;
  }

  // Injection des attributs APRÈS avoir trouvé la bonne position
  if (attrsToAdd) {
    // Trouver la fin de la balise d'ouverture (avant le >)
    const openingTagEnd = template.indexOf('>', tagStartIndex);
    const before = template.substring(0, openingTagEnd);
    const after = template.substring(openingTagEnd);
    template = before + attrsToAdd + after;
  }

  return template;
}

function injectSlot(template, slotContent) {
  if (!slotContent || slotContent.trim() === '') {
    return template;
  }

  if (template.includes('<slot>') || template.includes('<slot/>') || template.includes('<slot />')) {
    template = template.replace(/<slot\s*\/?>/, slotContent);
  } else if (template.includes('{children}')) {
    template = template.replace(/\{children\}/, slotContent);
  } else {
    const firstClosingTag = template.indexOf('>');
    if (firstClosingTag !== -1) {
      if (template[firstClosingTag - 1] === '/') {
        console.warn('   ⚠️  Impossible d\'injecter du contenu dans une balise auto-fermante');
        return template;
      }

      template = template.substring(0, firstClosingTag + 1) +
        slotContent +
        template.substring(firstClosingTag + 1);
    }
  }

  return template;
}

async function handleHtmlPages() {
  const pageFiles  = await glob("src/pages/**/*.html");
  const nativeTags = new Set([
    'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
    'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button',
    'canvas', 'caption', 'cite', 'code', 'col', 'colgroup',
    'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt',
    'em', 'embed',
    'fieldset', 'figcaption', 'figure', 'footer', 'form',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html',
    'i', 'iframe', 'img', 'input', 'ins',
    'kbd',
    'label', 'legend', 'li', 'link',
    'main', 'map', 'mark', 'meta', 'meter',
    'nav', 'noscript',
    'object', 'ol', 'optgroup', 'option', 'output',
    'p', 'param', 'picture', 'pre', 'progress',
    'q',
    'rp', 'rt', 'ruby',
    's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'svg',
    'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track',
    'u', 'ul',
    'var', 'video',
    'wbr'
  ]);

  for (const pagePath of pageFiles) {
    console.log(`\n📄 ${pagePath}`);
    let content = await file(pagePath).text();
    const outputPath = pagePath.replace("src/pages", "public");

    let hasComponents = true;
    let iterationCount = 0;
    const maxIterations = 100;

    while (hasComponents && iterationCount < maxIterations) {
      iterationCount++;

      const openTagPattern = /<([a-z][a-z0-9-]*)([^>]*)>/gi;
      let foundMatch = false;
      let match;

      while ((match = openTagPattern.exec(content)) !== null) {
        const name = match[1];
        const attrs = match[2];
        const openTagEnd = match.index + match[0].length;

        if (nativeTags.has(name.toLowerCase())) {
          continue;
        }

        const componentPath = `src/components/${name}/${name}.html`;
        if (!(await file(componentPath).exists())) {
          continue;
        }

        const closeTag = `</${name}>`;
        let depth = 1;
        let searchPos = openTagEnd;
        let closeTagIndex = -1;

        while (depth > 0 && searchPos < content.length) {
          const nextOpen = content.indexOf(`<${name}`, searchPos);
          const nextClose = content.indexOf(closeTag, searchPos);

          if (nextClose === -1) break;

          if (nextOpen !== -1 && nextOpen < nextClose) {
            const charAfter = content[nextOpen + name.length + 1];
            if (charAfter === ' ' || charAfter === '>') {
              depth++;
              searchPos = nextOpen + name.length + 1;
            } else {
              searchPos = nextOpen + 1;
            }
          } else {
            depth--;
            if (depth === 0) {
              closeTagIndex = nextClose;
            }
            searchPos = nextClose + closeTag.length;
          }
        }

        if (closeTagIndex === -1) continue;

        const innerContent = content.substring(openTagEnd, closeTagIndex);
        const componentTemplate = await file(componentPath).text();

        const fullTag = `<${name}${attrs}>`;
        const parsedAttrs = parseAttributes(fullTag);

        let processedTemplate = injectSlot(componentTemplate, innerContent.trim());
        processedTemplate = injectAttributes(processedTemplate, parsedAttrs);

        content = content.substring(0, match.index) +
          processedTemplate +
          content.substring(closeTagIndex + closeTag.length);

        foundMatch = true;
        break;
      }

      if (!foundMatch) {
        hasComponents = false;
      }
    }

    console.log(`   ✅ ${iterationCount - 1} composant(s) remplacé(s)`);

    const outputDir = outputPath.split('/').slice(0, -1).join('/');
    if (outputDir) {
      await fs.mkdir(outputDir, { recursive: true });
    }

    await write(outputPath, content);
    console.log(`   ✅ Écrit: ${outputPath}`);
  }
}

async function build() {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 Démarrage du build...");
  console.log("=".repeat(50));

  const startTime = Date.now();

  try {
    console.log("\n🧹 Nettoyage du dossier public...");
    if (existsSync('public')) {
      await fs.rm('public', { recursive: true, force: true });
    }
    await fs.mkdir('public', { recursive: true });

    console.log("\n📦 Collecte des styles de composants...");
    const tempScss =[
      ...await collectComponentStyles("src/styles/"),
      ...await collectComponentStyles("src/components/*/"),
      ...await collectComponentStyles("src/pages/*/")
    ]
      .map(file => `@use '${file}' as *;`)
      .join("\n");

    console.log(tempScss)
    await write('temp-styles.scss', tempScss);

    console.log("\n🔄 Compilation SCSS...");
    const scssResult = await exec("bunx sass temp-styles.scss public/style.css --no-source-map");
    if (!scssResult) {
      console.error("❌ Erreur pendant la compilation SCSS");
      await fs.unlink('temp-styles.scss').catch(() => { });
      throw new Error("Échec de la compilation SCSS");
    }

    await fs.unlink('temp-styles.scss').catch(() => { });
    console.log("✅ CSS généré : public/style.css");

    await handleHtmlPages();

    const duration = Date.now() - startTime;
    console.log("\n" + "=".repeat(50));
    console.log(`🎉 Build terminé en ${duration}ms !`);
    console.log("=".repeat(50) + "\n");

    return true; // Indiquer que le build a réussi

  } catch (error) {
    console.error("\n💥 Erreur pendant le build :", error.message);
    console.error(error.stack);
    return false; // Indiquer que le build a échoué
  }
}

async function startWatcher() {
  console.log("👁️  Démarrage de la surveillance des fichiers avec bun --watch...");
  console.log("📁 Dossiers surveillés : src/");
  watch('./src', { recursive: true }, async (event, filename) => {
    console.log(`🔄 Fichier modifié: ${filename}`);
    await build();
  });
}

async function startServer() {
  console.log("🌐 Démarrage du serveur web...");

  const server = Bun.serve({
    port: 3000,
    hostname: "0.0.0.0",
    async fetch(req) {
      const url      = new URL(req.url);
      const filePath = url.pathname === '/'
        ? '/index.html'
        : url.pathname;

      const fullPath = filePath.startsWith('/assets/')
        ? `./${filePath}`
        : `public${filePath}`;

      try {
        const file = Bun.file(fullPath);
        if (await file.exists()) {
          return new Response(file);
        }

        const indexFile = Bun.file('public/index.html');
        if (await indexFile.exists()) {
          return new Response(indexFile);
        }

        return new Response("404 - Not Found", { status: 404 });
      } catch (error) {
        return new Response("500 - Server Error", { status: 500 });
      }
    },
  });

  console.log(`✅ Serveur lancé sur :`);
  console.log(`   🏠 Local : http://localhost:${server.port}`);
  console.log(`   🌐 Réseau : http://${server.hostname}:${server.port}`);
  console.log(`\n📢 Partagez l'URL avec votre graphiste !\n`);

  return server;
}

async function minifyCss() {
  const path = "./public/style.css";
  const css = await file(path).text();
  const { code } = transform({ filename: path, code: Buffer.from(css), minify: true });
  await write("./public/style.min.css", code);
}

async function minifyHtml() {
  const list = await glob("./public/**/*.html");
  for (const path of list) {
    const raw = await file(path).text();
    const minified = minify(Buffer.from(raw), { minify_js: true, minify_css: true });
    await write(path, minified);
  }
}

async function minifyJs() {
  const list = await glob("./assets/**/*.js");
  for (const js of list) {
    if (js.includes(".min.js")) continue;
    const raw = await file(js).text();
    const { code } = await minJs(raw);
    await write(js.replace(".js", ".min.js"), code);
  }
}

const args        = process.argv.slice(2);
const shouldServe = args.includes('--serve');
const shouldWatch = args.includes('--watch');

if (shouldWatch && shouldServe) {  
  await startServer();
  await startWatcher();
}
else if (shouldWatch) {
  await startWatcher();
}
else if (shouldServe) {
  await startServer();
}
else if (args.includes('--minifyHtml')) {
  await minifyHtml();
}
else if (args.includes('--minifyJs')) {
  await minifyJs();
}
else if (args.includes('--minifyCss')) {
  await minifyCss();
}
else {
  await build();
}