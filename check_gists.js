async function run() {
  try {
    const res = await fetch("https://api.github.com/users/omarufulislam/gists");
    if (!res.ok) {
      console.log(`Failed to fetch gists: ${res.status}`);
      return;
    }
    const gists = await res.json();
    console.log(`Found ${gists.length} gists for omarufulislam:`);
    gists.forEach((g, idx) => {
      console.log(`\n[${idx + 1}] Gist ID: ${g.id}`);
      console.log(`Description: ${g.description}`);
      console.log(`Files count: ${Object.keys(g.files).length}`);
      Object.keys(g.files).forEach(fName => {
        const file = g.files[fName];
        console.log(`  - File: ${fName} (${file.size} bytes)`);
        console.log(`    Raw URL: ${file.raw_url}`);
      });
    });
  } catch (err) {
    console.error(err);
  }
}
run();
