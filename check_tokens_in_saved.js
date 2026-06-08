import fs from "fs";

try {
  const data = JSON.parse(fs.readFileSync("src/parsedChannels.json", "utf-8"));
  console.log(`Total channels inside parsedChannels.json: ${data.length}`);
  
  const tokenChannels = data.filter(c => c.url.includes("78be6644"));
  console.log(`Channels with token '78be6644': ${tokenChannels.length}`);
  if (tokenChannels.length > 0) {
    console.log("First 15 channels with token:");
    tokenChannels.slice(0, 15).forEach((c, i) => {
      console.log(`  ${i+1}. ${c.name} (${c.id}) -> ${c.url}`);
    });
  }
} catch (e) {
  console.error(e);
}
