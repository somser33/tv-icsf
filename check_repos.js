async function run() {
  try {
    const res = await fetch("https://api.github.com/users/omarufulislam/repos");
    if (!res.ok) {
      console.log(`Failed to fetch repos: ${res.status}`);
      return;
    }
    const repos = await res.json();
    console.log(`Found ${repos.length} repositories for omarufulislam:`);
    repos.forEach((r, idx) => {
      console.log(`\n[${idx + 1}] Repository: ${r.full_name}`);
      console.log(`Description: ${r.description}`);
      console.log(`Stars: ${r.stargazers_count}`);
      console.log(`URL: ${r.html_url}`);
    });
  } catch (err) {
    console.error(err);
  }
}
run();
