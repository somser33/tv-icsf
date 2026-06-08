import { execSync } from "child_process";

try {
  console.log("=== Git Log ===");
  const log = execSync("git log --oneline").toString();
  console.log(log);
} catch (e) {
  console.error("Failed to run git log:", e.message);
}
