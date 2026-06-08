import fs from "fs";
import path from "path";

function findFiles(dir) {
  try {
    const list = fs.readdirSync(dir);
    for (const name of list) {
       const full = path.join(dir, name);
       if (full.startsWith("/proc") || full.startsWith("/sys") || full.startsWith("/dev") || full.includes("node_modules") || full.includes(".git")) continue;
       try {
         const stat = fs.statSync(full);
         if (stat.isDirectory()) {
           findFiles(full);
         } else {
           if (stat.size < 10000000) { // < 10MB
             const content = fs.readFileSync(full, "utf-8");
             if (content.includes("e=1779283759") || content.includes("Ananda TV") && content.includes("token=")) {
               console.log(`FOUND KEYWORD IN: ${full} (size: ${content.length})`);
               const idx = content.indexOf("Ananda TV");
               console.log(content.substring(Math.max(0, idx - 200), idx + 2000));
               console.log("\n---------------------------\n");
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

findFiles("/");
