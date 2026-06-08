import fs from "fs";
import path from "path";

function scanDir(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      if (fullPath.includes("node_modules") || fullPath.includes(".git") || fullPath.includes(".next")) return;
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
         results = results.concat(scanDir(fullPath));
      } else {
         if (file.endsWith(".json")) {
           results.push({ path: fullPath, size: stat.size });
         }
      }
    });
  } catch (e) {
    // ignore
  }
  return results;
}

const allJsonFiles = scanDir(".");
console.log("All JSON files found in workspace:");
console.log(allJsonFiles);
