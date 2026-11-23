#!/usr/bin/env node

// Checks pstack/skills-zhCN against pstack/skills: same file tree, translated markdown,
// intact frontmatter keys, code fences, links, and no leftover English prose.
// Also checks that docs/guide-zhCN links to skills resolve inside skills-zhCN.
// Exits 1 on any problem. Rerun after every translation batch.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, posix, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PSTACK = join(ROOT, "pstack");
const EN = join(PSTACK, "skills");
const ZH = join(PSTACK, "skills-zhCN");
const GUIDE = join(PSTACK, "docs", "guide-zhCN");

const problems = [];
const fail = (file, message) => problems.push(`${relative(ROOT, file)}: ${message}`);

function walk(dir, base = dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, base, out);
    else out.push(relative(base, path));
  }
  return out.sort();
}

const enFiles = walk(EN);
const zhFiles = existsSync(ZH) ? walk(ZH) : [];
const enSet = new Set(enFiles);
const zhSet = new Set(zhFiles);
const EXTRA_OK = new Set(["TRANSLATION-CONVENTIONS.md"]);
for (const file of enFiles) if (!zhSet.has(file)) fail(ZH, `missing file ${file}`);
for (const file of zhFiles) if (!enSet.has(file) && !EXTRA_OK.has(file)) fail(ZH, `extra file ${file}`);

const isTranslatedMd = (file) => file.endsWith(".md") && !file.split("/").includes("scripts");

// Splits markdown into segments, tracking fenced code blocks. Inline code spans are
// stripped later; fenced blocks must stay byte-identical to the English original.
function segments(text) {
  const lines = text.split("\n");
  const fenced = [];
  const prose = [];
  let fence = null;
  let current = [];
  lines.forEach((line, index) => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence === null && marker) {
      fence = marker[1][0].repeat(3);
      current = [line];
    } else if (fence !== null) {
      current.push(line);
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && line.trim().replace(/[`~]/g, "") === "") {
        fenced.push(current.join("\n"));
        fence = null;
        current = [];
      }
    } else {
      prose.push({ line: index + 1, text: line });
    }
  });
  if (fence !== null) fenced.push(current.join("\n"));
  return { fenced, prose };
}

function frontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { body: text, fields: null };
  const fields = new Map();
  for (const line of match[1].split("\n")) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (field) fields.set(field[1], field[2]);
  }
  return { body: text.slice(match[0].length), fields };
}

const LINK = /\]\(<?([^)\s>]+)>?(?:\s+"[^"]*")?\)/g;
const linksOf = (text) => [...text.matchAll(LINK)].map((match) => match[1]);
const CJK = /[\u4e00-\u9fff]/;

// English function words that should not survive in translated prose.
const STOPWORDS = /\b(the|and|with|that|this|from|when|before|after|into|your|you|are|was|were|have|has|will|should|must|does|not|only|each|every|then|than|them|they|its|it's|use|uses|using|run|runs|read|write|keep|make|give|take|check|instead|because|while|where|which|what|about|never|always|first|next|last|same|other|another|both|all|any|some)\b/i;

function stripCode(text) {
  return text
    .replace(/`[^`\n]*`/g, "")
    .replace(/\]\(<?[^)\s>]+>?(?:\s+"[^"]*")?\)/g, "]")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/<[^>\n]+>/g, "");
}

const untranslated = [];
let checkedMd = 0;

for (const file of enFiles) {
  const enPath = join(EN, file);
  const zhPath = join(ZH, file);
  if (!zhSet.has(file)) continue;
  if (!isTranslatedMd(file)) {
    if (readFileSync(enPath, "utf8") !== readFileSync(zhPath, "utf8")) fail(zhPath, "non-markdown or scripts file must be byte-identical to the English original");
    continue;
  }
  checkedMd++;
  const enText = readFileSync(enPath, "utf8");
  const zhText = readFileSync(zhPath, "utf8");
  if (enText === zhText) {
    untranslated.push(file);
    continue;
  }
  const en = frontmatter(enText);
  const zh = frontmatter(zhText);
  if (Boolean(en.fields) !== Boolean(zh.fields)) fail(zhPath, "frontmatter presence differs from the English original");
  if (en.fields && zh.fields) {
    for (const key of en.fields.keys()) if (!zh.fields.has(key)) fail(zhPath, `frontmatter lost key "${key}"`);
    for (const key of zh.fields.keys()) if (!en.fields.has(key)) fail(zhPath, `frontmatter gained key "${key}"`);
    for (const key of ["name", "disable-model-invocation", "icon", "color", "argument-hint", "allowed-tools", "model"]) {
      if (en.fields.has(key) && zh.fields.get(key) !== en.fields.get(key)) fail(zhPath, `frontmatter "${key}" changed: ${en.fields.get(key)} -> ${zh.fields.get(key)}`);
    }
    if (zh.fields.has("description") && !CJK.test(zh.fields.get("description"))) fail(zhPath, "description is not translated");
  }
  const enSeg = segments(en.body);
  const zhSeg = segments(zh.body);
  const headingLevels = (segs) => segs.prose.map(({ text }) => text.match(/^(#{1,6}) /)).filter(Boolean).map((match) => match[1]);
  const enHeads = headingLevels(enSeg);
  const zhHeads = headingLevels(zhSeg);
  if (enHeads.join(",") !== zhHeads.join(",")) fail(zhPath, `heading structure differs: [${enHeads}] -> [${zhHeads}]`);
  if (enSeg.fenced.length !== zhSeg.fenced.length) fail(zhPath, `code fence count differs: ${enSeg.fenced.length} -> ${zhSeg.fenced.length}`);
  else {
    enSeg.fenced.forEach((block, index) => {
      if (block !== zhSeg.fenced[index]) fail(zhPath, `code fence #${index + 1} differs from the English original`);
    });
  }
  const enLinks = linksOf(en.body)
    .filter((href) => !/^[a-z][a-z0-9+.-]*:/i.test(href))
    .map((href) => href.replace("docs/guide/", "docs/guide-zhCN/"));
  const zhLinks = linksOf(zh.body).filter((href) => !/^[a-z][a-z0-9+.-]*:/i.test(href));
  const enCount = new Map();
  for (const href of enLinks) enCount.set(href, (enCount.get(href) ?? 0) + 1);
  const zhCount = new Map();
  for (const href of zhLinks) zhCount.set(href, (zhCount.get(href) ?? 0) + 1);
  for (const [href, count] of enCount) {
    if ((zhCount.get(href) ?? 0) < count) fail(zhPath, `relative link "${href}" appears ${count}x in English but ${zhCount.get(href) ?? 0}x in Chinese`);
  }
  for (const href of zhLinks) {
    const [target] = href.split("#");
    if (!target) continue;
    const resolved = posix.normalize(posix.join(posix.dirname(file), target));
    if (!existsSync(join(ZH, resolved))) fail(zhPath, `link "${href}" does not resolve inside skills-zhCN`);
  }
  const leftover = [];
  for (const { line, text } of zhSeg.prose) {
    if (/^\s*(\||-{3,}|={3,}|<!--)/.test(text)) continue;
    if (/^\s*>/.test(text)) continue;
    const plain = stripCode(text);
    const words = plain.match(/[A-Za-z][A-Za-z'-]*/g) ?? [];
    const stops = words.filter((word) => STOPWORDS.test(word));
    if (stops.length >= 3) leftover.push(`line ${line}: ${text.trim().slice(0, 100)}`);
  }
  if (leftover.length) fail(zhPath, `possible untranslated prose:\n    ${leftover.join("\n    ")}`);
}

// guide-zhCN must link to skills-zhCN, not skills.
let guideLinks = 0;
for (const name of readdirSync(GUIDE)) {
  if (!name.endsWith(".md")) continue;
  const path = join(GUIDE, name);
  const text = readFileSync(path, "utf8");
  for (const { 1: href, index } of text.matchAll(LINK)) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) continue;
    const [target, anchor] = href.split("#");
    if (!target) continue;
    const resolved = posix.normalize(posix.join("docs/guide-zhCN", target));
    if (resolved.startsWith("skills/") || resolved.startsWith("skills-zhCN/")) guideLinks++;
    if (resolved.startsWith("skills/")) fail(path, `still links into English skills: ${href}`);
    if (!existsSync(join(PSTACK, resolved))) fail(path, `link ${href} does not exist`);
    else if (anchor && resolved.endsWith(".md") && statSync(join(PSTACK, resolved)).isFile()) {
      const headings = readFileSync(join(PSTACK, resolved), "utf8").split("\n").filter((line) => /^#{1,6}\s/.test(line));
      const slugs = headings.map((line) => line.replace(/^#{1,6}\s+/, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*]/g, "").trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s/g, "-"));
      if (!slugs.includes(anchor)) fail(path, `link ${href}: target has no anchor "${anchor}"`);
    }
  }
}

console.log(`checked ${checkedMd} translated markdown files, ${enFiles.length - checkedMd} copied files, ${guideLinks} guide->skills links`);
if (untranslated.length) {
  console.log(`\nuntranslated (${untranslated.length}):`);
  for (const file of untranslated) console.log(`  ${file}`);
}
if (problems.length) {
  console.error(`\nproblems (${problems.length}):`);
  for (const problem of problems) console.error(`  ${problem}`);
}
if (problems.length || untranslated.length) process.exit(1);
console.log("PASS");
