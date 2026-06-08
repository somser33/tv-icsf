async function run() {
  const url = "https://gist.githubusercontent.com/omarufulislam/aecf408adb1cb05cc39d67d01bea08b1/raw";
  try {
    const res = await fetch(url);
    const text = await res.text();
    const lines = text.split("\n");
    
    const groups = {};
    let totalChannels = 0;
    let bdChannels = 0;
    
    let currentGroup = "NO_GROUP";
    for (const line of lines) {
      if (line.startsWith("#EXTINF:")) {
        totalChannels++;
        const groupMatch = line.match(/group-title="([^"]+)"/i);
        currentGroup = groupMatch ? groupMatch[1] : "NO_GROUP";
        groups[currentGroup] = (groups[currentGroup] || 0) + 1;
        if (currentGroup.toUpperCase().includes("BANGLADESH") || currentGroup.toUpperCase().includes("BD")) {
          bdChannels++;
        }
      }
    }
    
    console.log(`Total channels count in Gist: ${totalChannels}`);
    console.log("\nGroups distribution:");
    const sorted = Object.entries(groups).sort((a,b) => b[1] - a[1]);
    sorted.forEach(([g, count]) => {
      console.log(`- ${g}: ${count}`);
    });
    
  } catch (err) {
    console.error(err);
  }
}
run();
