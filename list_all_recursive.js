import fs from "fs";
import path from "path";

function listRecursive(dir) {
  const result = [];
  try {
    const list = fs.readdirSync(dir);
    for (const name of list) {
      const full = path.join(dir, name);
      if (full.includes("node_modules") || full.includes(".git")) continue;
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        result.push(...listRecursive(full));
      } else {
        result.push({ path: full, size: stat.size });
      }
    }
  } catch (e) {
     // ignore
  }
  return result;
}

console.log("ALL FILES IN WORKSPACE RECURSIVELY:");
const all = listRecursive(".");
all.forEach(f => console.log(`- ${f.path} (size: ${f.size})`));
