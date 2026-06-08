import fs from "fs";
import path from "path";

const target = "Ananda TV";

function scan(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const name of files) {
      const full = path.join(dir, name);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          if (
            name === "proc" ||
            name === "sys" ||
            name === "dev" ||
            name === "node_modules" ||
            name === ".git" ||
            name === "lib" ||
            name === "lib64" ||
            name === "usr" ||
            name === "sbin" ||
            name === "bin" ||
            name === "boot" ||
            name === "run" ||
            name === "etc"
          ) {
            continue;
          }
          scan(full);
        } else {
          // Check any text file
          if (stat.size > 0 && stat.size < 5 * 1024 * 1024 && !full.includes("node_modules")) {
            const content = fs.readFileSync(full, "utf-8");
            if (content.includes(target)) {
              console.log(`\n=== MATCH FOUND ===`);
              console.log(`Path: ${full}`);
              console.log(`Size: ${stat.size} bytes`);
              console.log(`Matching Snippet:`);
              const idx = content.indexOf(target);
              console.log(content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 1000)));
              console.log(`===================\n`);
            }
          }
        }
      } catch (err) {
        // skip
      }
    }
  } catch (err) {
    // skip
  }
}

console.log("Starting targeted search in '/' for:", target);
scan("/");
console.log("Completed!");
