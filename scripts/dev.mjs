import { spawn } from "node:child_process";
const children = [
  spawn(
    process.execPath,
    ["node_modules/vite/bin/vite.js", "build", "--watch"],
    { stdio: "inherit" },
  ),
  spawn(
    process.execPath,
    ["node_modules/@11ty/eleventy/cmd.cjs", "--serve", "--port=5183"],
    { stdio: "inherit" },
  ),
];
function stop() {
  for (const child of children) child.kill();
}
process.on("SIGINT", () => {
  stop();
  process.exit();
});
process.on("SIGTERM", () => {
  stop();
  process.exit();
});
for (const child of children)
  child.on("exit", (code) => {
    if (code) {
      stop();
      process.exit(code);
    }
  });
