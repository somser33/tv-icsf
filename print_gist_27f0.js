async function run() {
  const url = "https://gist.githubusercontent.com/omarufulislam/27f0da73500141749490506d6c9c24cd/raw/42a81b689028e07c7f93a9c36de857e7cc5a75f7/gistfile1.txt";
  const res = await fetch(url);
  const text = await res.text();
  console.log("=== Printing whole gist_27f0 content ===");
  console.log(text);
}
run();
