async function run() {
  const url = "https://gist.githubusercontent.com/omarufulislam/3570fe3e42bbb1350dd2b0a3a2e47861/raw/1f57a1aed31e82cfafa6e92a75ebb098b1120b3c/iptv";
  try {
    const res = await fetch(url);
    const text = await res.text();
    const lines = text.split("\n");
    const streamLines = lines.filter(l => l.startsWith("http://") || l.startsWith("https://"));
    console.log(`iptv_3570: size: ${text.length}, lines: ${lines.length}, streams count: ${streamLines.length}`);
    if (streamLines.length > 0) {
      console.log("First 10 streams:");
      streamLines.slice(0, 10).forEach(s => console.log(`  - ${s.trim()}`));
    }
  } catch (err) {
    console.error(err);
  }
}
run();
