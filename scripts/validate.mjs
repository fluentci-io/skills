import { readdir, readFile, realpath } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const names = new Set();
const inside = (base, target) => {
  const path = relative(base, target);
  return (
    path === "" ||
    (!path.startsWith(`..${sep}`) && path !== ".." && !path.startsWith(sep))
  );
};
async function markdownFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      errors.push(
        `${relative(root, path)}: symlinks are not portable skill content`,
      );
    } else if (entry.isDirectory()) result.push(...(await markdownFiles(path)));
    else if (entry.name.endsWith(".md")) result.push(path);
  }
  return result;
}
async function checkLinks(file, boundary) {
  const content = await readFile(file, "utf8");
  for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const href = match[1].trim();
    if (/^(?:https?:|mailto:|#)/.test(href)) continue;
    const target = resolve(
      dirname(file),
      decodeURIComponent(href.split("#")[0]),
    );
    try {
      const actual = await realpath(target);
      if (!inside(boundary, actual))
        errors.push(
          `${relative(root, file)}: link escapes installable skill: ${href}`,
        );
    } catch {
      errors.push(`${relative(root, file)}: missing link target: ${href}`);
    }
  }
}
const entries = await readdir(join(root, "skills"), { withFileTypes: true });
for (const entry of entries) {
  if (!entry.isDirectory()) {
    errors.push(`skills/${entry.name}: expected a skill directory`);
    continue;
  }
  const directory = join(root, "skills", entry.name);
  const path = join(directory, "SKILL.md");
  let content;
  try {
    content = await readFile(path, "utf8");
  } catch {
    errors.push(`skills/${entry.name}: missing SKILL.md`);
    continue;
  }
  const frontmatter = /^---\r?\n([\s\S]+?)\r?\n---(?:\r?\n|$)/.exec(
    content,
  )?.[1];
  if (!frontmatter) {
    errors.push(`${path}: missing YAML frontmatter`);
    continue;
  }
  const name = /^name: ([a-z0-9]+(?:-[a-z0-9]+)*)$/m.exec(frontmatter)?.[1];
  const rawDescription = /^description: (.+)$/m.exec(frontmatter)?.[1];
  let description = rawDescription;
  try {
    if (rawDescription?.startsWith('"'))
      description = JSON.parse(rawDescription);
  } catch {
    errors.push(`${path}: invalid quoted description`);
  }
  if (name !== entry.name || !name || name.length > 64)
    errors.push(
      `${path}: name must match directory and use at most 64 lowercase hyphenated characters`,
    );
  if (names.has(name)) errors.push(`${path}: duplicate skill name`);
  names.add(name);
  if (
    typeof description !== "string" ||
    !description.trim() ||
    description.length > 1024 ||
    /[<>]/.test(description)
  )
    errors.push(`${path}: invalid description`);
  if (/\bTODO\b|\[INSERT|\[REPLACE/.test(content))
    errors.push(`${path}: unfinished scaffold placeholder`);
  for (const file of await markdownFiles(directory))
    await checkLinks(file, directory);
  const metadata = join(directory, "agents", "openai.yaml");
  try {
    const ui = await readFile(metadata, "utf8");
    const prompt = /^  default_prompt: (.+)$/m.exec(ui)?.[1];
    if (!prompt || !JSON.parse(prompt).includes(`$${name}`))
      errors.push(`${metadata}: default prompt must name the skill`);
    const short = /^  short_description: (.+)$/m.exec(ui)?.[1];
    const length = short ? JSON.parse(short).length : 0;
    if (length < 25 || length > 64)
      errors.push(`${metadata}: short description must be 25–64 characters`);
  } catch (error) {
    errors.push(`${metadata}: ${error.message}`);
  }
  console.log(`Checked ${name ?? entry.name}`);
}
for (const file of ["README.md", "CONTRIBUTING.md"])
  await checkLinks(join(root, file), root);
const readme = await readFile(join(root, "README.md"), "utf8");
for (const name of names)
  if (!readme.includes(`skills/${name}/SKILL.md`))
    errors.push(`README.md: ${name} is missing from the catalog`);
if (!names.size) errors.push("No skills found");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Validated ${names.size} independently installable FluentCI skills.`,
  );
