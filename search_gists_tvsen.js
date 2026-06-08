async function run() {
  const gists = [
    { name: "27f0da73500141749490506d6c9c24cd", url: "https://gist.githubusercontent.com/omarufulislam/27f0da73500141749490506d6c9c24cd/raw/42a81b689028e07c7f93a9c36de857e7cc5a75f7/gistfile1.txt" },
    { name: "e5f79ada3a4f8a377c1b5d74347c08fe", url: "https://gist.githubusercontent.com/omarufulislam/e5f79ada3a4f8a377c1b5d74347c08fe/raw/d57305c47588114a1e0021da6aedfc5791475500/gistfile1.txt" },
    { name: "3570fe3e42bbb1350dd2b0a3a2e47861", url: "https://gist.githubusercontent.com/omarufulislam/3570fe3e42bbb1350dd2b0a3a2e47861/raw/1f57a1aed31e82cfafa6e92a75ebb098b1120b3c/iptv" },
    { name: "ce723f927d6084a7fa153753a29a5bd2", url: "https://gist.githubusercontent.com/omarufulislam/ce723f927d6084a7fa153753a29a5bd2/raw/2b9b1c8d9f8a637dcf151feb5b111edd8ccb9c6c/gistfile1.txt" },
    { name: "2ba9cc365557f39d8a449b20fc5d86e7", url: "https://gist.githubusercontent.com/omarufulislam/2ba9cc365557f39d8a449b20fc5d86e7/raw/7d3f5058fa7141b245a9552c1208f4b0a508d1d0/sport" },
    { name: "055219408fe53cee2816a27cc4129b3a", url: "https://gist.githubusercontent.com/omarufulislam/055219408fe53cee2816a27cc4129b3a/raw/42d218b03265e2fd8150af9f0d0349055b62f5a2/gistfile1.txt" },
    { name: "a57c8d84d43f07a93edf264ceea13ee2", url: "https://gist.githubusercontent.com/omarufulislam/a57c8d84d43f07a93edf264ceea13ee2/raw/59cc6891067c4b5a6061ea1aab0d7e1f98b1a19b/gistfile1.txt" },
    { name: "eb0fcd5af1fdcd2f025097c3088df6e7", url: "https://gist.githubusercontent.com/omarufulislam/eb0fcd5af1fdcd2f025097c3088df6e7/raw/8254d938a209aebed82d9068fea8f971fa068a5e/gistfile1.txt" },
    { name: "9f703c7ea78fc4666e5e71a2f3b3e6c4", url: "https://gist.githubusercontent.com/omarufulislam/9f703c7ea78fc4666e5e71a2f3b3e6c4/raw/16cb7a8829e742492ce2d66df1d44470a90b2285/myiptv" },
    { name: "ab6606b6c5c499beca001da769df746f", url: "https://gist.githubusercontent.com/omarufulislam/ab6606b6c5c499beca001da769df746f/raw/e89531e28536a544eff6443e36fa2e4f104b14e0/TOP%20IPTV" },
    { name: "aecf408adb1cb05cc39d67d01bea08b1", url: "https://gist.githubusercontent.com/omarufulislam/aecf408adb1cb05cc39d67d01bea08b1/raw/d59e00cef7a0c2b1efb25d89c2e327c77af0d847/myiptv" },
    { name: "09f986e91b8c3015b762393c74d87c7d", url: "https://gist.githubusercontent.com/omarufulislam/09f986e91b8c3015b762393c74d87c7d/raw/d59e00cef7a0c2b1efb25d89c2e327c77af0d847/myiptv" },
    { name: "8ad36f95107343825ea80fb541fd9652", url: "https://gist.githubusercontent.com/omarufulislam/8ad36f95107343825ea80fb541fd9652/raw/f1440c23583fb393edb48f9fc9c8a40bf2f45135/mafdfg" }
  ];

  for (const g of gists) {
    try {
      const res = await fetch(g.url);
      if (!res.ok) continue;
      const text = await res.text();
      const countTvsen = (text.match(/tvsen/gi) || []).length;
      if (countTvsen > 0) {
        console.log(`\n=== Gist ${g.name} has ${countTvsen} 'tvsen' occurrences ===`);
        const lines = text.split("\n");
        let matches = lines.filter(l => l.toLowerCase().includes("tvsen"));
        console.log("Matches:");
        matches.slice(0, 10).forEach(m => console.log(`  ${m.trim()}`));
      }
    } catch (e) {
      console.log(`Failed for ${g.name}: ${e.message}`);
    }
  }
}
run();
