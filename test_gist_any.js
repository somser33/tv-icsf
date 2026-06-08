async function run() {
  const rawUrl = "https://gist.githubusercontent.com/omarufulislam/aecf408adb1cb05cc39d67d01bea08b1/raw";
  try {
    const res = await fetch(rawUrl);
    const text = await res.text();
    const lines = text.split("\n");
    console.log(`Gist total lines: ${lines.length}`);
    
    let aynaottLines = [];
    let tokenLines = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.toLowerCase().includes("aynaott")) {
        aynaottLines.push({ lineNum: i, text: line.trim() });
      }
      if (line.toLowerCase().includes("78be")) {
        tokenLines.push({ lineNum: i, text: line.trim() });
      }
    }
    
    console.log(`Found ${aynaottLines.length} lines with 'aynaott':`);
    aynaottLines.slice(0, 10).forEach(l => console.log(`- L${l.lineNum}: ${l.text}`));
    
    console.log(`Found ${tokenLines.length} lines with '78be':`);
    tokenLines.slice(0, 10).forEach(l => console.log(`- L${l.lineNum}: ${l.text}`));
    
  } catch (err) {
    console.error(err);
  }
}
run();
