async function run() {
  try {
    const res = await fetch("https://api.github.com/repos/sohag1192/BDIX-TV-/contents");
    if (!res.ok) {
      console.log(`Failed to fetch repo contents: ${res.status}`);
      return;
    }
    const files = await res.json();
    console.log(`Found ${files.length} files in sohag1192/BDIX-TV-:`);
    files.forEach(f => {
      console.log(`  - ${f.name} (${f.type}, size: ${f.size})`);
      console.log(`    Download URL: ${f.download_url}`);
    });
  } catch (err) {
    console.error(err);
  }
}
run();
