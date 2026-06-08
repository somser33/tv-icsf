async function run() {
  try {
    const res = await fetch("https://api.github.com/users/Denver1769/repos");
    const contentsUrl = "https://api.github.com/repos/Denver1769/Jiotv/contents";
    const res2 = await fetch(contentsUrl);
    if (!res2.ok) {
      console.log(`Failed to fetch Denver1769/Jiotv contents: ${res2.status}`);
      return;
    }
    const files = await res2.json();
    console.log("Files in Denver1769/Jiotv:");
    files.forEach(f => {
      console.log(`- ${f.name} (size: ${f.size})`);
    });
  } catch (err) {
    console.error(err);
  }
}
run();
