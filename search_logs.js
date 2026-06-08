import fs from "fs";
import path from "path";

function search(dir) {
  try {
    const list = fs.readdirSync(dir);
    for (const name of list) {
      const fullPath = path.join(dir, name);
      if (fullPath.includes("node_modules") || fullPath.includes(".git")) continue;
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          search(fullPath);
        } else {
          if (name.endsWith(".jsonl") || name.endsWith(".json") || name.endsWith(".txt") || name.endsWith(".md") || name.endsWith(".sh")) {
            const content = fs.readFileSync(fullPath, "utf-8");
            if (content.includes("e=1779283759") || content.includes("Ananda TV")) {
              console.log(`\n============================`);
              console.log(`FOUND MATCH IN: ${fullPath} (Size: ${content.length})`);
              console.log(`============================`);
              // Let's print around the match
              const idx = content.indexOf("Ananda TV");
              console.log(content.substring(Math.max(0, idx - 500), Math.min(content.length, idx + 5000)));
            }
          }
        }
      } catch (e) {
        // ignore
      }
    }
  } catch (e) {
    // ignore
  }
}

// Let's search from the root of the file system '/' or search '/.gemini/' specifically!
search("/.gemini");
search(".");
