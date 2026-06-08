import fs from "fs";
import path from "path";

const target = "78be6644-0a65-48ec-81a4-089ac65a2619";

function scan(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const name of files) {
      const full = path.join(dir, name);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          // Skip system virtual directories and node_modules
          if (
            name === "proc" ||
            name === "sys" ||
            name === "dev" ||
            name === "node_modules" ||
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
          if (stat.size > 0 && stat.size < 5 * 1024 * 1024) { // < 5MB
            const content = fs.readFileSync(full, "utf-8");
            if (content.includes(target)) {
              console.log(`\n=== MATCH FOUND ===`);
              console.log(`Path: ${full}`);
              console.log(`Size: ${stat.size} bytes`);
              console.log(`Preview:`);
              const idx = content.indexOf(target);
              console.log(content.substring(Math.max(0, idx - 500), Math.min(content.length, idx + 2000)));
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

console.log("Starting targeted search in '/' for the token:", target);
scan("/");
console.log("Targeted search completed!");
