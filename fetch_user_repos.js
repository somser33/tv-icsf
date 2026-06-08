async function run() {
  try {
    const res = await fetch("https://api.github.com/users/omarufulislam/repos?per_page=100");
    if (!res.ok) {
      console.log(`Failed to fetch repos: ${res.status}`);
      return;
    }
    const repos = await res.json();
    console.log(`Found ${repos.length} repos for omarufulislam:`);
    repos.forEach((r, i) => {
      console.log(`  ${i+1}. Name: ${r.name} | Description: ${r.description} | Stars: ${r.stargazers_count}`);
    });
  } catch (err) {
    console.error(err);
  }
}
run();
