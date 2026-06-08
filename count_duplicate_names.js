import fs from "fs";

try {
  const data = JSON.parse(fs.readFileSync("src/parsedChannels.json", "utf-8"));
  console.log(`Total records: ${data.length}`);
  
  const uniqueNames = new Set();
  const cleanUniqueNames = new Set();
  
  data.forEach(c => {
    uniqueNames.add(c.name);
    // Remove backups and spaces
    const clean = c.name.split("[Backup")[0].trim().toLowerCase();
    cleanUniqueNames.add(clean);
  });
  
  console.log(`Unique literal names: ${uniqueNames.size}`);
  console.log(`Unique clean base names: ${cleanUniqueNames.size}`);
} catch (e) {
  console.error(e);
}
