#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const outputRoot = path.resolve(process.argv[2] ?? ".hugo-output");
const htmlFiles = [];

async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(entryPath);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles.push(entryPath);
    }
  }
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

const idCache = new Map();

async function documentIds(filePath) {
  if (idCache.has(filePath)) {
    return idCache.get(filePath);
  }

  const html = await fs.readFile(filePath, "utf8");
  const ids = new Set();
  const idPattern = /\b(?:id|name)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  for (const match of html.matchAll(idPattern)) {
    ids.add(match[1] ?? match[2] ?? match[3]);
  }
  idCache.set(filePath, ids);
  return ids;
}

function decode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

await walk(outputRoot);
const failures = [];
const tagPattern = /<[a-z][^>]*>/gi;
const attributePattern =
  /\b(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;

for (const htmlFile of htmlFiles) {
  const source = await fs.readFile(htmlFile, "utf8");
  const html = source.replace(/<!--[\s\S]*?-->/g, "");

  for (const tagMatch of html.matchAll(tagPattern)) {
    for (const match of tagMatch[0].matchAll(attributePattern)) {
      const reference = match[1] ?? match[2] ?? match[3];
      if (
        !reference ||
        /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)
      ) {
        continue;
      }

      const [pathAndQuery, fragment = ""] = reference.split("#", 2);
      const urlPath = decode(pathAndQuery.split("?", 1)[0]);
      let target = urlPath.startsWith("/")
        ? path.join(outputRoot, urlPath.slice(1))
        : path.resolve(path.dirname(htmlFile), urlPath || ".");

      if (target !== outputRoot && !target.startsWith(`${outputRoot}${path.sep}`)) {
        failures.push(
          `${path.relative(outputRoot, htmlFile)}: ${reference} escapes the output directory`
        );
        continue;
      }

      const candidates = [target];
      if (urlPath.endsWith("/") || !path.extname(target)) {
        candidates.unshift(path.join(target, "index.html"));
      }

      target = "";
      for (const candidate of candidates) {
        if (await exists(candidate)) {
          target = candidate;
          break;
        }
      }

      if (!target) {
        failures.push(`${path.relative(outputRoot, htmlFile)}: missing ${reference}`);
        continue;
      }

      if (fragment && target.endsWith(".html")) {
        const ids = await documentIds(target);
        const decodedFragment = decode(fragment);
        if (!ids.has(decodedFragment)) {
          failures.push(
            `${path.relative(outputRoot, htmlFile)}: missing fragment #${decodedFragment} in ${path.relative(outputRoot, target)}`
          );
        }
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked internal links in ${htmlFiles.length} HTML files.`);
}
