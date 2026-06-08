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
    "Sonyliv2",
    "Toffee.m3u",
    "allinone",
    "ayna-playlist.m3u",
    "bdixtv4.m3u",
    "opplex.m3u",
    "playlist.m3u",
    "psl-world-wide.m3u",
    "tata-play-playlist.m3u"
  ];
  
  let totalMatches = 0;
  for (const f of files) {
    try {
      const url = `https://raw.githubusercontent.com/sohag1192/BDIX-TV-/main/${encodeURIComponent(f)}`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const text = await res.text();
      const occurrences = (text.match(/aynaott\.com/gi) || []).length;
      if (occurrences > 0) {
        console.log(`- File '${f}' contains ${occurrences} occurrences of aynaott.com`);
        totalMatches += occurrences;
      }
    } catch (e) {
      // ignore
    }
  }
  console.log(`Total occurrences in all list: ${totalMatches}`);
}
run();
