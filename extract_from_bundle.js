import fs from "fs";

try {
  const filePath = "dist/assets/index-BUFS95XP.js";
  if (!fs.existsSync(filePath)) {
    console.log("Bundle file does not exist!");
    process.exit(1);
  }
  
  const text = fs.readFileSync(filePath, "utf-8");
  console.log(`Bundle loaded. Size: ${text.length} chars`);
  
  // Search for the token
  const target = "78be6644-0a65-48ec-81a4-089ac65a2619";
  const occurrences = [];
  let index = text.indexOf(target);
  while (index !== -1) {
    occurrences.push(index);
    index = text.indexOf(target, index + 1);
  }
  
  console.log(`Found ${occurrences.length} occurrences of the token.`);
  
  if (occurrences.length > 0) {
    // Print around the first occurrence to understand the format
    const firstOcc = occurrences[0];
    console.log(`\n--- First occurrence snippet ---`);
    console.log(text.substring(Math.max(0, firstOcc - 100), Math.min(text.length, firstOcc + 1000)));
    
    // Let's find any large JSON-like array or object containing tvsen urls with tokens
    console.log(`\nTrying to extract matches...`);
    const regex = /"https?:\/\/[^"]+aynaott\.com[^"]+"/g;
    const matches = text.match(regex);
    if (matches) {
      console.log(`Found ${matches.length} matching URLs in bundle!`);
      const sample = matches.slice(0, 10);
      sample.forEach((m, idx) => console.log(`  ${idx+1}. ${m}`));
      
      // Let's write them out to a json file immediately!
      fs.writeFileSync("extracted_urls.json", JSON.stringify(matches, null, 2));
      console.log("Saved extracted URLs to extracted_urls.json");
    } else {
      console.log("No regex matching URLs found.");
    }
  }
} catch (e) {
  console.error(e);
}
