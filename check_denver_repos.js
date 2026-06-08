async function run() {
  try {
    const res = await fetch("https://api.github.com/users/Denver1769/repos");
    if (!res.ok) {
      console.log(`Failed to fetch Denver1769 repos: ${res.status}`);
      return;
    }
    const repos = await res.json();
    console.log(`Found ${repos.length} repositories for Denver1769:`);
    repos.forEach(r => {
      console.log(`- ${r.full_name}: ${r.description}`);
    });
  } catch (err) {
    console.error(err);
  }
}
run();
