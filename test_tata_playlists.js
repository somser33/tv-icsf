async function run() {
  const files = ["tata-play-playlist.m3u", "tata-play-world-wide-playlist.m3u"];
  for (const f of files) {
    try {
      const url = `https://raw.githubusercontent.com/sohag1192/BDIX-TV-/main/${encodeURIComponent(f)}`;
      const res = await fetch(url);
      const text = await res.text();
      const lines = text.split("\n");
      const list = [];
      let current = null;
      for (const line of lines) {
        const clean = line.trim();
        if (clean.startsWith("#EXTINF:")) {
          const nameMatch = clean.lastIndexOf(",");
          const name = nameMatch !== -1 ? clean.substring(nameMatch + 1).trim() : "Unknown";
          current = { name };
        } else if (clean.startsWith("http://") || clean.startsWith("https://")) {
          if (current) {
            current.url = clean;
            list.push(current);
            current = null;
          }
        }
      }
      console.log(`\nFile ${f} has ${list.length} channels.`);
      console.log("First 15 channel names and URLs:");
      list.slice(0, 15).forEach((c, idx) => {
        console.log(`  ${idx + 1}. ${c.name}: ${c.url}`);
      });
      
      const setUrls = new Set(list.map(c => c.url.trim().toLowerCase()));
      console.log(`Unique URLs count: ${setUrls.size}`);
    } catch (e) {
      console.error(e);
    }
  }
}
run();
