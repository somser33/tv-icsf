async function run() {
  try {
    const res = await fetch("https://api.github.com/users/omarufulislam/gists?per_page=100");
    if (!res.ok) {
       console.log(`Failed to fetch gists: ${res.status}`);
       return;
    }
    const gists = await res.json();
    console.log(`Found ${gists.length} total gists:`);
    for (const g of gists) {
      console.log(`\n- ID: ${g.id} | Desc: ${g.description} | Created: ${g.created_at} | Files: ${Object.keys(g.files).join(", ")}`);
    }
  } catch (err) {
    console.error(err);
  }
}
run();
