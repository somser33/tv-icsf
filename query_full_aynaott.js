async function run() {
  try {
    const rawUrl = "https://raw.githubusercontent.com/sohag1192/BDIX-TV-/main/Aynaott";
    const res = await fetch(rawUrl);
    const text = await res.text();
    const lines = text.split("\n");
    
    let current = null;
    const list = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      if (line.startsWith("#EXTINF:")) {
        const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
        const nameMatch = line.lastIndexOf(",");
        current = {
          name: nameMatch !== -1 ? line.substring(nameMatch + 1).trim() : "Unknown",
          logo: logoMatch ? logoMatch[1] : "",
        };
      } else if (line.startsWith("http://") || line.startsWith("https://")) {
        if (current) {
          current.url = line;
          list.push(current);
          current = null;
        }
      }
    }
    
    console.log(`Total channels in sohag1192/Aynaott file: ${list.length}`);
    console.log("Distribution of domains:");
    const domains = {};
    list.forEach(c => {
      try {
        const u = new URL(c.url);
        domains[u.hostname] = (domains[u.hostname] || 0) + 1;
      } catch (e) {
        domains["invalid"] = (domains["invalid"] || 0) + 1;
      }
    });
    console.log(domains);
    
  } catch (err) {
    console.error(err);
  }
}
run();
