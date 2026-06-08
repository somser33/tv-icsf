async function run() {
  const gists = [
    { name: "27f0da73500141749490506d6c9c24cd", filename: "gistfile1.txt" },
    { name: "e5f79ada3a4f8a377c1b5d74347c08fe", filename: "gistfile1.txt" },
    { name: "3570fe3e42bbb1350dd2b0a3a2e47861", filename: "iptv" },
    { name: "ce723f927d6084a7fa153753a29a5bd2", filename: "gistfile1.txt" },
    { name: "2ba9cc365557f39d8a449b20fc5d86e7", filename: "sport" },
    { name: "055219408fe53cee2816a27cc4129b3a", filename: "gistfile1.txt" },
    { name: "a57c8d84d43f07a93edf264ceea13ee2", filename: "gistfile1.txt" },
    { name: "eb0fcd5af1fdcd2f025097c3088df6e7", filename: "gistfile1.txt" },
    { name: "9f703c7ea78fc4666e5e71a2f3b3e6c4", filename: "myiptv" },
    { name: "ab6606b6c5c499beca001da769df746f", filename: "TOP%20IPTV" },
    { name: "8a4b6409d8b699e7f69e0d07f34e009d", filename: "myiptv" },
    { name: "aecf408adb1cb05cc39d67d01bea08b1", filename: "myiptv" },
    { name: "09f986e91b8c3015b762393c74d87c7d", filename: "myiptv" },
    { name: "8ad36f95107343825ea80fb541fd9652", filename: "mafdfg" }
  ];

  for (const g of gists) {
    try {
      // Latest raw URL structure: https://gist.githubusercontent.com/omarufulislam/[GIST_ID]/raw/[FILENAME]
      const url = `https://gist.githubusercontent.com/omarufulislam/${g.name}/raw/${g.filename}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`Failed for Gist ${g.name}: ${res.status}`);
        continue;
      }
      const text = await res.text();
      const countAyna = (text.match(/aynaott\.com/gi) || []).length;
      const countToken = (text.match(/78be/gi) || []).length;
      console.log(`Gist ${g.name} | aynaott: ${countAyna} | 78be: ${countToken} | size: ${text.length}`);
      
      if (countAyna > 0) {
        const lines = text.split("\n");
        const streams = lines.filter(l => l.startsWith("http://") || l.startsWith("https://"));
        console.log(`  -> SUCCESS! Streams count: ${streams.length}`);
        console.log(`  -> First 3 streams:`);
        streams.slice(0, 3).forEach(s => console.log(`      ${s.trim()}`));
      }
    } catch (e) {
      console.log(`Error checking ${g.name}: ${e.message}`);
    }
  }
}
run();
