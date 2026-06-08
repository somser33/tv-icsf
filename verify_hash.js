import crypto from "crypto";

const target = "504b9350b4703116ca4ab20e4013288e"; // anandatv token

const u = "78be6644-0a65-48ec-81a4-089ac65a2619";
const e = "1779283759";
const channel = "anandatv";

// Let's test common MD5 patterns
const patterns = [
  `${channel}${u}${e}`,
  `${channel}${e}${u}`,
  `${u}${channel}${e}`,
  `${e}${u}${channel}`,
  `${u}${e}${channel}`,
  `anandatv`,
];

patterns.forEach(p => {
  const hash = crypto.createHash("md5").update(p).digest("hex");
  if (hash === target) {
    console.log("MATCH FOUND for input:", p);
  }
});

console.log("MD5 of 'anandatv':", crypto.createHash("md5").update("anandatv").digest("hex"));
console.log("Check complete.");
