async function run() {
  const files = [
    "Aynaott",
    "Bdcast",
    "Bdix",
    "Bdix 2",
    "Bdixtv 3",
    "Dishtv",
    "Ipl",
    "Jadoo",
    "Jagobd",
    "Jio.m3u8",
    "Jiocinema",
    "Live",
    "Live 2",
    "Live 3",
    "Live Tv",
    "Livetv",
    "Livetv2",
    "Opplex.m3u",
    "Ottbangla",
    "Sonyliv",
    "Sonyliv2",
    "Toffee.m3u",
    "ads-free-4.m3u",
    "allinone",
    "ayna-playlist.m3u",
    "bdixtv4.m3u",
    "match-link.m3u",
    "opplex.m3u",
    "playlist.m3u",
    "psl-world-wide.m3u",
    "tata-play-playlist.m3u",
    "tata-play-world-wide-playlist.m3u",
    "tata-play-world-wide.m3u"
  ];
  
  console.log("Analyzing all sohag1192 files for stream counts...");
  
  for (const f of files) {
    try {
      const url = `https://raw.githubusercontent.com/sohag1192/BDIX-TV-/main/${encodeURIComponent(f)}`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const text = await res.text();
      const lines = text.split("\n");
      const streams = lines.filter(l => l.startsWith("http://") || l.startsWith("https://"));
      console.log(`- File: ${f.padEnd(30)} | Streams: ${streams.length.toString().padEnd(5)} | Size: ${text.length} bytes`);
    } catch (e) {
      console.error(`Error with ${f}:`, e);
    }
  }
}
run();
