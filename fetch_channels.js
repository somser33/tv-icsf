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

    const PREMIUM_GPCDN_CHANNELS = [
      {
        "name": "Somoy TV Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1735560559088.png",
        "category": "News",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1702/output/index.m3u8",
        "id": "somoy-tv-premium"
      },
      {
        "name": "BTV Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1735561595482.png",
        "category": "Entertainment",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1709/output/index.m3u8",
        "id": "btv-premium"
      },
      {
        "name": "Jamuna TV Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1735560213832.png",
        "category": "News",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1701/output/index.m3u8",
        "id": "jamuna-tv-premium"
      },
      {
        "name": "DBC News Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1770186306600.png",
        "category": "News",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1728/output/index.m3u8",
        "id": "dbc-news-premium"
      },
      {
        "name": "Independent TV Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1739964387847.png",
        "category": "News",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1704/output/index.m3u8",
        "id": "independent-premium"
      },
      {
        "name": "Ekattor TV Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1739963327549.png",
        "category": "News",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1705/output/index.m3u8",
        "id": "ekattor-premium"
      },
      {
        "name": "Channel 24 Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1735556516924.png",
        "category": "Entertainment",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1703/output/index.m3u8",
        "id": "channel-24-premium"
      },
      {
        "name": "News 24 Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1770186895850.png",
        "category": "News",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1708/output/index.m3u8",
        "id": "news-24-premium"
      },
      {
        "name": "ATN News Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1739962961772.png",
        "category": "News",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1706/output/index.m3u8",
        "id": "atn-news-premium"
      },
      {
        "name": "Al Jazeera",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1735547218986.png",
        "category": "News",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1721/output/index.m3u8",
        "id": "al-jazeera-premium"
      },
      {
        "name": "Star News",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1770189826301.png",
        "category": "News",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1710/output/index.m3u8",
        "id": "star-news-premium"
      },
      {
        "name": "Deepto TV Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1742713000749.png",
        "category": "Entertainment",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1711/output/index.m3u8",
        "id": "deepto-premium"
      },
      {
        "name": "SA TV Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1770187361105.png",
        "category": "Entertainment",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1720/output/index.m3u8",
        "id": "sa-tv-premium"
      },
      {
        "name": "Channel 9 Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1770188008067.png",
        "category": "Entertainment",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1729/output/index.m3u8",
        "id": "channel-9-premium"
      },
      {
        "name": "Ekhon TV Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1770189283848.png",
        "category": "News",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1713/output/index.m3u8",
        "id": "ekhon-premium"
      },
      {
        "name": "Channel I Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1740567626692.png",
        "category": "Entertainment",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1723/output/index.m3u8",
        "id": "channel-i-premium"
      },
      {
        "name": "ATN Bangla Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1740553740665.png",
        "category": "Entertainment",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1722/output/index.m3u8",
        "id": "atn-bangla-premium"
      },
      {
        "name": "Bangla Vision Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1735561344354.png",
        "category": "Entertainment",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1715/output/index.m3u8",
        "id": "bangla-vision-premium"
      },
      {
        "name": "NTV Premium",
        "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1735560841094.png",
        "category": "Entertainment",
        "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1716/output/index.m3u8",
        "id": "ntv-premium"
      }
    ];

    // Filter out any duplicates dynamically found from the fetched list that match the premium ids
    const premiumIds = new Set(PREMIUM_GPCDN_CHANNELS.map(p => p.id));
    const processedFetched = channels.filter(c => !premiumIds.has(c.id));
    const combined = [...PREMIUM_GPCDN_CHANNELS, ...processedFetched];

    console.log(`\nSuccessfully combined premium local Bangladeshi playlists!`);
    console.log(`Prepend ${PREMIUM_GPCDN_CHANNELS.length} stable high-quality GPCDN channels.`);
    console.log(`Total highly authentic channels: ${combined.length}`);

    const outputPath = path.join(__dirname, "src", "parsedChannels.json");
    fs.writeFileSync(outputPath, JSON.stringify(combined, null, 2), "utf-8");
    console.log(`Saved clean channels to ${outputPath}`);

    // Helper to obfuscate URLs (Base64 + Caesar Shift (+3) + Hex encoding)
    function obfuscateUrl(u) {
      if (!u) return "";
      const b64 = Buffer.from(u, "utf-8").toString("base64");
      let scrambled = "";
      for (let i = 0; i < b64.length; i++) {
        scrambled += String.fromCharCode(b64.charCodeAt(i) + 3);
      }
      return Buffer.from(scrambled, "binary").toString("hex");
    }

    // Encrypt watermarked stream URLs to prevent scraper theft of live playlist URLs
    const securedCombined = combined.map(ch => ({
      ...ch,
      url: obfuscateUrl(ch.url)
    }));

    // Sync directly to the static client channels.js with encrypted URLs
    const staticChannelsPath = path.join(__dirname, "tv-icsf", "channels.js");
    const channelsJSContent = `// Channels Data for ICSF TV Portal - Highly Obfuscated/Encrypted
const INITIAL_CHANNELS = ${JSON.stringify(securedCombined, null, 2)};

if (typeof window !== "undefined") {
  window.INITIAL_CHANNELS = INITIAL_CHANNELS;
}
`;
    fs.writeFileSync(staticChannelsPath, channelsJSContent, "utf-8");
    console.log(`Synced static channels script (Encrypted) to ${staticChannelsPath}`);

    // Sync directly to the static secure channels.php with domain restriction checks
    const phpChannelsPath = path.join(__dirname, "tv-icsf", "channels.php");
    const phpChannelsContent = `<?php
/**
 * ICSF TV Portal - Securing Channel Streams
 * Authorized Domain Access Control Script
 * Developed by Somser SA
 */
header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

// ==========================================
// SECURITY CONFIGURATION: ALLOWED DOMAINS
// ==========================================
// Add or edit domains that are allowed to run your TV applet script.
// If anyone else hosts the player or tries to use this channels script, it will fail.
$ALLOWED_DOMAINS = [
    'localhost',
    '127.0.0.1',
    'icsf.com.bd',       // Default domain
    'somser-sa.pro.bd',  // Developer domain
];

$referer = $_SERVER['HTTP_REFERER'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';

$is_allowed = false;

// Validate host
foreach ($ALLOWED_DOMAINS as $domain) {
    if (stripos($host, $domain) !== false) {
        $is_allowed = true;
        break;
    }
}

// Validate referer (where the script is loaded from)
if (!empty($referer)) {
    $referer_allowed = false;
    foreach ($ALLOWED_DOMAINS as $domain) {
        if (stripos($referer, $domain) !== false) {
            $referer_allowed = true;
            break;
        }
    }
    $is_allowed = $is_allowed || $referer_allowed;
}

// Automatically whitelist Google AI Studio sandbox environments for development/preview comfort
if (stripos($host, 'run.app') !== false || stripos($host, 'google.com') !== false || stripos($referer, 'run.app') !== false) {
    $is_allowed = true;
}

if (!$is_allowed) {
    header("HTTP/1.1 403 Forbidden");
    echo "console.error('ICSF Security Warning: Unauthorized Domain Reference - Access Denied.');";
    exit;
}

// Hex encoded, Caesar-Shifted channels playlist
$channels_data = json_decode('${JSON.stringify(securedCombined)}', true);
?>
const INITIAL_CHANNELS = <?php echo json_encode($channels_data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>;

if (typeof window !== "undefined") {
  window.INITIAL_CHANNELS = INITIAL_CHANNELS;
}
`;
    fs.writeFileSync(phpChannelsPath, phpChannelsContent, "utf-8");
    console.log(`Created secure channels.php with domain guards at ${phpChannelsPath}`);

  } catch (err) {
    console.error("Critical error in fetch_channels execution:", err);
    // Fallback if write fails
    const outputPath = path.join(__dirname, "src", "parsedChannels.json");
    if (!fs.existsSync(outputPath)) {
      fs.writeFileSync(outputPath, JSON.stringify([], null, 2), "utf-8");
    }
  }
}

run();
