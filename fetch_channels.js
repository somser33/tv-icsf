import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function determineCategory(name) {
  const norm = name.toLowerCase();
  if (
    norm.includes("sports") ||
    norm.includes("sport") ||
    norm.includes("football") ||
    norm.includes("cricket") ||
    norm.includes("play") ||
    norm.includes("golf") ||
    norm.includes("fight") ||
    norm.includes("tsn") ||
    norm.includes("espn") ||
    norm.includes("bein") ||
    norm.includes("premier") ||
    norm.includes("madrid") ||
    norm.includes("psl") ||
    norm.includes("ufc")
  ) {
    return "Sports";
  }
  if (
    norm.includes("news") ||
    norm.includes("cnn") ||
    norm.includes("jazeera") ||
    norm.includes("wion") ||
    norm.includes("dw") ||
    norm.includes("khabar") ||
    norm.includes("today") ||
    norm.includes("nation") ||
    norm.includes("somoy") ||
    norm.includes("jamuna") ||
    norm.includes("independent") ||
    norm.includes("abc") ||
    norm.includes("cbs") ||
    norm.includes("trt")
  ) {
    return "News";
  }
  return "Entertainment";
}

function generateId(name) {
  let id = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  
  if (id.includes("ananda-tv") || id === "anandatv") return "ananda-tv";
  if (id.includes("bangla-tv") || id === "banglatv") return "bangla-tv";
  if (id.includes("channel-9") || id === "channel9") return "channel-9";
  if (id.includes("duronto-tv") || id === "durontotv") return "duronto-tv";
  if (id.includes("boishakhi-tv") || id === "boishakhitv") return "boishakhi-tv";
  if (id.includes("t-sports") || id === "tsports") return "t-sports";
  if (id.includes("somoy-news") || id === "somoytv" || id.includes("somoy-tv")) return "somoy-news-tv";
  if (id.includes("jamuna-tv") || id === "jamunatv") return "jamuna-tv";
  return id;
}

async function run() {
  try {
    const files = [
      "Aynaott",
      "Bdcast",
      "Bdix",
      "Bdix 2",
      "Bdixtv 3",
      "Jadoo",
      "Toffee.m3u",
      "ayna-playlist.m3u",
      "bdixtv4.m3u",
      "Ottbangla",
      "Livetv2",
      "Live 2",
      "Live 3"
    ];

    const seenKeys = new Set();
    const seenIds = new Set();
    const channels = [];

    console.log("Combining premium playlists from sohag1192 repo...");

    for (const f of files) {
      try {
        const url = `https://raw.githubusercontent.com/sohag1192/BDIX-TV-/main/${encodeURIComponent(f)}`;
        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`  - Skip ${f}: Failed to download (${res.status})`);
          continue;
        }
        const text = await res.text();
        const lines = text.split("\n");
        
        let current = null;
        let fileCount = 0;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          if (line.startsWith("#EXTINF:")) {
            let name = "";
            const commaIndex = line.lastIndexOf(",");
            if (commaIndex !== -1) {
              name = line.substring(commaIndex + 1).trim();
            }
            
            const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
            const logo = logoMatch ? logoMatch[1] : "";
            
            current = {
              name: name || "Unknown Channel",
              logo: logo || "",
              category: determineCategory(name)
            };
          } else if (line.startsWith("http://") || line.startsWith("https://")) {
            if (current) {
              current.url = line;
              
              const lowerName = current.name.toLowerCase();
              const urlClean = current.url.trim().toLowerCase();
              const normName = current.name.trim().toLowerCase();
              const uniqueKey = `${normName}||${urlClean}`;
              
              const isPlaceholder = 
                lowerName.includes("corona-live") || 
                lowerName.includes("user guide") ||
                lowerName.includes("important notice") ||
                lowerName.includes("fake") ||
                lowerName.includes("test") ||
                lowerName.includes("tutorial");
                
              if (current.name && !isPlaceholder && !seenKeys.has(uniqueKey)) {
                seenKeys.add(uniqueKey);
                
                // Keep the original name extremely clean, absolutely no suffix like Backup or duplicates!
                let chId = generateId(current.name);
                let finalId = chId;
                let counter = 1;
                while (seenIds.has(finalId)) {
                  finalId = `${chId}-${counter}`;
                  counter++;
                }
                current.id = finalId;
                seenIds.add(finalId);
                
                channels.push(current);
                fileCount++;
              }
              current = null;
            }
          }
        }
        console.log(`  - Parsed ${fileCount} unique streams from file '${f}'`);
      } catch (err) {
        console.error(`  - Error parsing file '${f}':`, err.message);
      }
    }

    console.log(`\nSuccessfully combined premium local Bangladeshi playlists!`);
    console.log(`Total highly authentic channels: ${channels.length}`);

    const outputPath = path.join(__dirname, "src", "parsedChannels.json");
    fs.writeFileSync(outputPath, JSON.stringify(channels, null, 2), "utf-8");
    console.log(`Saved clean channels to ${outputPath}`);

  } catch (err) {
    console.error("Critical error in fetch_channels execution:", err);
    // Fallback to empty array if write fails
    const outputPath = path.join(__dirname, "src", "parsedChannels.json");
    if (!fs.existsSync(outputPath)) {
      fs.writeFileSync(outputPath, JSON.stringify([], null, 2), "utf-8");
    }
  }
}

run();
