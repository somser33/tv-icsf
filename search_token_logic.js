import fs from "fs";

try {
  const filePath = "dist/assets/index-BUFS95XP.js";
  if (!fs.existsSync(filePath)) {
    console.log("Bundle file does not exist!");
    process.exit(1);
  }
  
  const text = fs.readFileSync(filePath, "utf-8");
  console.log(`Bundle loaded. Size: ${text.length} chars`);
  
  // Let's print occurrences around "aynaott"
  let idx = 0;
  while (true) {
    idx = text.indexOf("aynaott", idx);
    if (idx === -1) break;
    console.log(`\nMatch at index ${idx}:`);
    console.log(text.substring(Math.max(0, idx - 150), Math.min(text.length, idx + 150)));
    idx += 7;
  }
} catch (e) {
  console.error(e);
}
