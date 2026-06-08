async function run() {
  try {
    const res = await fetch("https://api.github.com/users/Denver1769/repos?per_page=100");
    if (!res.ok) {
      console.log(`Failed to fetch Denver1769 repos: ${res.status}`);
      return;
    }
    const repos = await res.json();
    console.log(`Found ${repos.length} repos for Denver1769:`);
    repos.forEach((r, i) => {
      console.log(`  ${i+1}. Name: ${r.name} | Description: ${r.description} | Stars: ${r.stargazers_count}`);
    });
  } catch (err) {
    console.error(err);
  }
}
run();
