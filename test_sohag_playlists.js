async function run() {
  const files = ["ayna-playlist.m3u", "Dishtv", "Bdcast", "Bdix", "Jadoo"];
  for (const f of files) {
    try {
      const url = `https://raw.githubusercontent.com/sohag1192/BDIX-TV-/main/${encodeURIComponent(f)}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`Failed to fetch ${f}: ${res.status}`);
        continue;
      }
      const text = await res.text();
      const lines = text.split("\n");
      const streams = lines.filter(l => l.startsWith("http://") || l.startsWith("https://"));
      console.log(`\nFile: ${f}, size: ${text.length} chars, lines: ${lines.length}, streams count: ${streams.length}`);
      if (streams.length > 0) {
        console.log(`First 3 streams:`);
        streams.slice(0, 3).forEach(s => console.log(`  - ${s.trim()}`));
        // Check for tokens
        const countsToken = (text.match(/78be/gi) || []).length;
        console.log(`Matches of token: ${countsToken}`);
      }
    } catch (e) {
      console.error(`Error with ${f}:`, e);
    }
  }
}
run();
