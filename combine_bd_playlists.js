async function run() {
  const files = [
    "Aynaott",
    "Bdcast",
    "Bdix",
    "Bdix 2",
    "Bdixtv 3",
    "Jadoo",
    "Toffee.m3u",
    "ayna-playlist.m3u",
    "bdixtv4.m3u",
    "Ottbangla",
    "Livetv2",
    "Live 2",
    "Live 3"
  ];

  const seen = new Set();
  const channels = [];

  for (const f of files) {
    try {
      const url = `https://raw.githubusercontent.com/sohag1192/BDIX-TV-/main/${encodeURIComponent(f)}`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const text = await res.text();
      const lines = text.split("\n");
      
      let current = null;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        if (line.startsWith("#EXTINF:")) {
          let name = "";
          const commaIndex = line.lastIndexOf(",");
          if (commaIndex !== -1) {
            name = line.substring(commaIndex + 1).trim();
          }
          const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
          const logo = logoMatch ? logoMatch[1] : "";
          current = { name, logo, sourceFile: f };
        } else if (line.startsWith("http://") || line.startsWith("https://")) {
          if (current) {
            current.url = line;
            const uniqueKey = `${current.name.trim().toLowerCase()}||${current.url.trim().toLowerCase()}`;
            if (!seen.has(uniqueKey)) {
              seen.add(uniqueKey);
              channels.push(current);
            }
            current = null;
          }
        }
      }
    } catch (e) {
      console.error(`Error with ${f}:`, e.message);
    }
  }

  console.log(`Successfully combined premium playlists!`);
  console.log(`Total unique channels found: ${channels.length}`);
  
  // Show a breakdown by name
  const names = channels.map(c => c.name);
  console.log("\nSample channels:");
  channels.slice(0, 30).forEach((c, idx) => {
    console.log(`  ${idx+1}. [${c.sourceFile}] ${c.name} -> ${c.url}`);
  });
}
run();
