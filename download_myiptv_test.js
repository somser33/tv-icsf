async function run() {
  const urls = {
    myiptv_9f70: "https://gist.githubusercontent.com/omarufulislam/9f703c7ea78fc4666e5e71a2f3b3e6c4/raw/16cb7a8829e742492ce2d66df1d44470a90b2285/myiptv"
  };
  
  for (const [name, url] of Object.entries(urls)) {
    try {
      console.log(`Downloading ${name} from ${url}...`);
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`  -> Failed: ${res.status}`);
        continue;
      }
      const text = await res.text();
      console.log(`  -> Size: ${text.length} characters`);
      const lines = text.split("\n");
      console.log(`  -> Lines: ${lines.length}`);
      
      let sample = [];
      let count = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.toLowerCase().includes("aynaott.com")) {
          count++;
          if (sample.length < 10) {
            sample.push(line.trim());
          }
        }
      }
      console.log(`  -> Found ${count} lines with 'aynaott.com'`);
      if (sample.length > 0) {
        console.log("  -> Samples:");
        sample.forEach(s => console.log(`      ${s}`));
      }
    } catch (e) {
      console.error(`  -> Fetch Error:`, e);
    }
  }
}
run();
