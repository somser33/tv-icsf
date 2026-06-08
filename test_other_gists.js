async function run() {
  const urls = {
    mafdfg_8ad3: "https://gist.githubusercontent.com/omarufulislam/8ad36f95107343825ea80fb541fd9652/raw/f1440c23583fb393edb48f9fc9c8a40bf2f45135/mafdfg",
    gist_27f0: "https://gist.githubusercontent.com/omarufulislam/27f0da73500141749490506d6c9c24cd/raw/42a81b689028e07c7f93a9c36de857e7cc5a75f7/gistfile1.txt",
    sport_2ba9: "https://gist.githubusercontent.com/omarufulislam/2ba9cc365557f39d8a449b20fc5d86e7/raw/7d3f5058fa7141b245a9552c1208f4b0a508d1d0/sport",
    gist_a57c: "https://gist.githubusercontent.com/omarufulislam/a57c8d84d43f07a93edf264ceea13ee2/raw/59cc6891067c4b5a6061ea1aab0d7e1f98b1a19b/gistfile1.txt"
  };
  
  for (const [name, url] of Object.entries(urls)) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      const lines = text.split("\n");
      const streams = lines.filter(l => l.startsWith("http://") || l.startsWith("https://"));
      console.log(`\nFile ${name}: size ${text.length}, lines ${lines.length}, streams count ${streams.length}`);
      if (streams.length > 0) {
        console.log(`First 3 streams:`);
        streams.slice(0, 3).forEach(s => console.log(`  - ${s.trim()}`));
      }
    } catch (e) {
      console.error(`Error ${name}:`, e);
    }
  }
}
run();
