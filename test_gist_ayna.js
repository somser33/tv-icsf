async function run() {
  const rawUrl = "https://gist.githubusercontent.com/omarufulislam/aecf408adb1cb05cc39d67d01bea08b1/raw";
  const res = await fetch(rawUrl);
  const text = await res.text();
  const lines = text.split("\n");
  console.log("Analyzing aynaott.com entries in gist:");
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes("aynaott.com")) {
      console.log(`Line ${i}: ${line}`);
      count++;
      if (count > 25) break;
    }
  }
}
run();
