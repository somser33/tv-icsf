async function run() {
  const gistId = "8a4b6409d8b699e7f69e0d07f34e009d";
  try {
    const res = await fetch(`https://api.github.com/gists/${gistId}`);
    if (!res.ok) {
      console.log(`Failed to fetch gist ${gistId}: ${res.status}`);
      return;
    }
    const gist = await res.json();
    console.log(`Gist ${gistId} description: ${gist.description}`);
    for (const [filename, file] of Object.entries(gist.files)) {
      console.log(`File: ${filename}, size: ${file.size}, rawUrl: ${file.raw_url}`);
      // Fetch contents
      const contentRes = await fetch(file.raw_url);
      const text = await contentRes.text();
      console.log(`  -> Fetched size: ${text.length}`);
      const matches = (text.match(/aynaott\.com/gi) || []).length;
      console.log(`  -> Aynaott occurrences: ${matches}`);
      const matches78be = (text.match(/78be/gi) || []).length;
      console.log(`  -> 78be occurrences: ${matches78be}`);
    }
  } catch (err) {
    console.error(err);
  }
}
run();
