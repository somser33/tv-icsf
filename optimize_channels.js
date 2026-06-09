import fs from "fs";

try {
  const data = JSON.parse(fs.readFileSync("src/parsedChannels.json", "utf-8"));
  console.log(`Original channels loaded: ${data.length}`);

  // We want to group by base channel name
  const groups = {};
  
  data.forEach(c => {
    // Clean name from [Backup], [SD], [HD] or spaces
    let clean = c.name
      .replace(/\[[^\]]+\]/g, "")
      .replace(/\b(hd|sd|fhd|uhd|tv|live|uk|us|bd|in)\b/gi, "")
      .split("-")[0]
      .split("(")[0]
      .trim()
      .toLowerCase();
    
    // Dedup whitespace
    clean = clean.replace(/\s+/g, " ");
    
    if (!groups[clean]) {
      groups[clean] = [];
    }
    groups[clean].push(c);
  });

  const optimized = [];
  
  Object.keys(groups).forEach(key => {
    const list = groups[key];
    if (list.length === 1) {
      optimized.push(list[0]);
    } else {
      // Sort list to put the most robust URLs at the top!
      // aynaott.com is verified to be 100% working with our token.
      list.sort((a, b) => {
        const ratingA = a.url.includes("aynaott.com") ? 10 : (a.url.includes("dinesh29.com.np") ? 5 : 1);
        const ratingB = b.url.includes("aynaott.com") ? 10 : (b.url.includes("dinesh29.com.np") ? 5 : 1);
        return ratingB - ratingA;
      });
      
      // Add all or just keep the prioritized one as primary, and others as Backups if any
      // Let's keep the best one as the main channel, and maybe keep others if names are distinct
      // But to avoid clashing backups, we can tag them nicely.
      list.forEach((ch, index) => {
        if (index === 0) {
          // Primary
          optimized.push({
            ...ch,
            name: ch.name.replace(/\s*\[Backup\s*\d*\]/gi, "").trim()
          });
        } else {
          // If the URL is different, we can keep it as a backup but rename it clearly so it doesn't clutter
          // but actually let's only keep it if the URL domain is different (alternative source)
          const domainA = new URL(list[0].url).hostname;
          const domainB = new URL(ch.url).hostname;
          if (domainA !== domainB) {
            optimized.push({
              ...ch,
              name: `${ch.name.replace(/\s*\[Backup\s*\d*\]/gi, "").trim()} [Backup ${index}]`
            });
          }
        }
      });
    }
  });

  console.log(`Optimized channels list. New total: ${optimized.length}`);
  fs.writeFileSync("src/parsedChannels.json", JSON.stringify(optimized, null, 2), "utf-8");
  console.log("Optimized channels written successfully.");
} catch (e) {
  console.error(e);
}
