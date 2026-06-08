import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Tv,
  X,
  Settings,
  ShieldCheck,
  Check
} from "lucide-react";
import CyberPlayer from "./components/CyberPlayer";
import { INITIAL_CHANNELS, Channel } from "./channelsData";

function ChannelLogo({ channel, isSelected }: { channel: Channel; isSelected: boolean }) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [channel.logo, channel.id]);

  const initials = useMemo(() => {
    if (!channel.name) return "TV";
    const cleanName = channel.name
      .replace(/\[[^\]]+\]/g, "")
      .replace(/\b(hd|sd|fhd|uhd|tv|live|uk|us|bd|in)\b/gi, "")
      .trim();

    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return cleanName.slice(0, 2).toUpperCase();
  }, [channel.name]);

  const gradientClass = useMemo(() => {
    switch (channel.category) {
      case "Sports":
        return "from-emerald-600 to-teal-900 border-emerald-500/20 text-emerald-100";
      case "News":
        return "from-rose-700 to-red-950 border-red-500/20 text-rose-100";
      case "Entertainment":
        return "from-indigo-600 to-fuchsia-950 border-indigo-500/20 text-indigo-100";
      default:
        return "from-zinc-800 to-zinc-950 border-zinc-700/30 text-zinc-300";
    }
  }, [channel.category]);

  const fallback = (
    <div className={`w-full h-full rounded bg-gradient-to-br ${gradientClass} border flex flex-col items-center justify-center relative overflow-hidden select-none`}>
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
      <span className="text-sm font-extrabold tracking-wider leading-none">
        {initials}
      </span>
      <span className="text-[7.5px] text-white/50 tracking-widest uppercase mt-0.5 font-semibold">
        {channel.category.slice(0, 4)}
      </span>
    </div>
  );

  if (channel.logo && channel.logo.trim() !== "" && !imageError) {
    return (
      <img
        src={channel.logo}
        className={`max-h-full max-w-full object-contain transition-transform duration-300 ${
          isSelected ? "brightness-110 scale-102" : "brightness-95 opacity-85 group-hover:opacity-100"
        }`}
        alt={channel.name}
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
      />
    );
  }

  return fallback;
}

export default function App() {
  const [aynaU, setAynaU] = useState(() => localStorage.getItem("ayna_u") || "78be6644-0a65-48ec-81a4-089ac65a2619");
  const [aynaE, setAynaE] = useState(() => localStorage.getItem("ayna_e") || "1779283759");
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [tempU, setTempU] = useState(aynaU);
  const [tempE, setTempE] = useState(aynaE);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("ayna_u", tempU.trim());
    localStorage.setItem("ayna_e", tempE.trim());
    setAynaU(tempU.trim());
    setAynaE(tempE.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsSettingOpen(false);
    }, 1200);
  };

  const [channelStatus, setChannelStatus] = useState<Record<string, "works" | "fails">>(() => {
    try {
      const saved = localStorage.getItem("icsf_channel_status");
      if (saved) {
        const parsed = JSON.parse(saved);
        const premiumIds = [
          "ananda-tv", "bangla-tv", "channel-9", "duronto-tv", "boishakhi-tv",
          "t-sports", "cricket-gold", "somoy-news-tv", "jamuna-tv", "dw-news"
        ];
        let updated = false;
        premiumIds.forEach(id => {
          if (!parsed[id]) {
            parsed[id] = "works";
            updated = true;
          }
        });
        if (updated) {
          localStorage.setItem("icsf_channel_status", JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    const initial: Record<string, "works" | "fails"> = {
      "ananda-tv": "works",
      "bangla-tv": "works",
      "channel-9": "works",
      "duronto-tv": "works",
      "boishakhi-tv": "works",
      "t-sports": "works",
      "cricket-gold": "works",
      "somoy-news-tv": "works",
      "jamuna-tv": "works",
      "dw-news": "works",
    };
    try {
      localStorage.setItem("icsf_channel_status", JSON.stringify(initial));
    } catch (e) {}
    return initial;
  });

  const handleChannelStatusChange = (channelId: string, status: "PLAYING" | "ERROR") => {
    setChannelStatus((prev) => {
      const mapped = status === "PLAYING" ? "works" : "fails";
      if (prev[channelId] === mapped) return prev;
      const next = { ...prev, [channelId]: mapped };
      try {
        localStorage.setItem("icsf_channel_status", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Sort channels: HTTPS first (since HTTPS works natively in secure pages/environments), 
  // keeping the relative positions of all other streams fully stable.
  const sortedChannels = useMemo(() => {
    return [...INITIAL_CHANNELS].sort((a, b) => {
      const isHttpsA = a.url.startsWith("https://");
      const isHttpsB = b.url.startsWith("https://");
      
      if (isHttpsA !== isHttpsB) {
        return isHttpsB ? 1 : -1;
      }
      return 0; // Maintain stable relative order
    });
  }, []);

  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(120);
  const playerSectionRef = useRef<HTMLDivElement>(null);

  // Default to the first channel
  useEffect(() => {
    if (sortedChannels.length > 0 && !selectedChannel) {
      setSelectedChannel(sortedChannels[0]);
    }
  }, [selectedChannel, sortedChannels]);

  // Filter channels using both Search query and Category Tab
  const filteredChannels = useMemo(() => {
    return sortedChannels.filter((ch) => {
      const matchesSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesCategory = false;
      if (selectedCategory === "All") {
        matchesCategory = true;
      } else if (selectedCategory === "Active") {
        matchesCategory = channelStatus[ch.id] === "works";
      } else {
        matchesCategory = ch.category === selectedCategory;
      }
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, sortedChannels, channelStatus]);

  // Handle pagination list segmenting
  const displayedChannels = useMemo(() => {
    return filteredChannels.slice(0, visibleCount);
  }, [filteredChannels, visibleCount]);

  // Reset page size when filters change
  useEffect(() => {
    setVisibleCount(120);
  }, [searchQuery, selectedCategory]);

  // Switch to the Next Channel
  const handleNextChannel = () => {
    if (!selectedChannel || filteredChannels.length === 0) return;
    const currentIndex = filteredChannels.findIndex((ch) => ch.id === selectedChannel.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % filteredChannels.length;
      setSelectedChannel(filteredChannels[nextIndex]);
    } else {
      setSelectedChannel(filteredChannels[0]);
    }
  };

  // Switch to the Previous Channel
  const handlePrevChannel = () => {
    if (!selectedChannel || filteredChannels.length === 0) return;
    const currentIndex = filteredChannels.findIndex((ch) => ch.id === selectedChannel.id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + filteredChannels.length) % filteredChannels.length;
      setSelectedChannel(filteredChannels[prevIndex]);
    } else {
      setSelectedChannel(filteredChannels[filteredChannels.length - 1]);
    }
  };

  // Link state updates of custom user credentials & verify dynamic play paths
  const playableChannel = useMemo(() => {
    if (!selectedChannel) return null;
    let url = selectedChannel.url;
    if (url.includes("aynaott.com")) {
      const u = aynaU.trim();
      const e = aynaE.trim();
      try {
        const parsedUrl = new URL(url);
        parsedUrl.searchParams.set("u", u);
        parsedUrl.searchParams.set("e", e);
        url = parsedUrl.toString();
      } catch (err) {
        // Fallback safely if url parsing fails
        if (!url.includes("u=")) {
          const separator = url.includes("?") ? "&" : "?";
          url = `${url}${separator}e=${e}&u=${u}`;
        }
      }
    }
    return { ...selectedChannel, url };
  }, [selectedChannel, aynaU, aynaE]);

  // Keyboard navigation for channel changing (Left & Right Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input boxes
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        return;
      }
      if (e.key === "ArrowRight") {
        handleNextChannel();
      } else if (e.key === "ArrowLeft") {
        handlePrevChannel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedChannel, filteredChannels]);

  // Handle active channel selection click and scroll to player
  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    if (playerSectionRef.current) {
      playerSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-white selection:text-black">
      
      {/* Visual Accent Top Line */}
      <div className="h-[2px] w-full bg-white/10 fixed top-0 left-0 z-50"></div>

      {/* Main Single Column Container */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
        
        {/* ========================================================= */}
        {/* HEADER SECTION                                            */}
        {/* ========================================================= */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
              <Tv className="w-5.5 h-5.5 text-white stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white leading-tight">
                ICSF TV
              </h1>
              <span className="text-[10px] text-zinc-500 block">
                লাইভ টিভি পোর্টাল
              </span>
            </div>
          </div>

          {/* Minimalist Search box & Settings Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="চ্যানেলের নাম খুঁজুন..."
                className="w-full bg-zinc-950 border border-white/10 focus:border-white/20 rounded-xl py-1.5 pl-8 pr-10 text-xs text-white focus:outline-none transition-all placeholder-zinc-600"
              />
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-white transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setTempU(aynaU);
                setTempE(aynaE);
                setIsSettingOpen(true);
              }}
              className="p-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center justify-center relative group"
              title="টোকেন সেটিংস"
            >
              <Settings className="w-4 h-4" />
              <span className="absolute -bottom-8 right-0 bg-zinc-900 border border-white/10 text-[9px] text-zinc-300 px-1.5 py-0.5 rounded shadow pointer-events-none opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                টোকেন সেটিংস
              </span>
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* VIDEO PLAYER SCREEN PORTLET                               */}
        {/* ========================================================= */}
        <main className="space-y-6">
          
          <div ref={playerSectionRef} className="w-full">
            <div className="relative rounded-xl overflow-hidden bg-black shadow-2xl">
              <CyberPlayer 
                channel={playableChannel} 
                onPrev={handlePrevChannel}
                onNext={handleNextChannel}
                onStatusChange={handleChannelStatusChange}
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* STATION GRID MATRIX SECTION                               */}
          {/* ========================================================= */}
          <section className="bg-zinc-950 border border-white/5 rounded-xl p-5 md:p-6 shadow-2xl space-y-5">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-white/5">
              <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 shrink-0">
                <Tv className="w-3.5 h-3.5 text-zinc-400" />
                টেলিভিশন চ্যানেল তালিকা ({filteredChannels.length}টি)
              </h2>

              {/* Category Pills Tab Handler */}
              <div className="flex items-center flex-wrap gap-1.5 overflow-x-auto text-xs max-w-full">
                {[
                  { id: "All", label: "সব চ্যানেল" },
                  { id: "Active", label: "এক্টিভ চ্যানেল" },
                  { id: "Entertainment", label: "বিনোদন" },
                  { id: "Sports", label: "খেলাধুলা" },
                  { id: "News", label: "খবর" },
                ].map((tab) => {
                  const isActive = selectedCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`px-3 py-1.5 rounded-lg border transition-all text-[11px] font-semibold shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-white text-black border-white shadow-sm"
                          : "bg-zinc-900/30 text-zinc-400 border-white/5 hover:border-white/10 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {displayedChannels.length === 0 ? (
              <div className="py-12 text-center rounded-xl border border-dashed border-white/5 bg-white/5">
                <p className="text-xs text-zinc-400">কোনো চ্যানেল পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Station Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {displayedChannels.map((ch) => {
                    const isSelected = selectedChannel?.id === ch.id;

                    return (
                      <div
                        id={`channel-card-${ch.id}`}
                        key={ch.id}
                        onClick={() => handleSelectChannel(ch)}
                        className={`bg-zinc-900/10 border p-2.5 rounded-xl flex flex-col justify-between gap-3 transition-all duration-200 cursor-pointer relative group ${
                          isSelected 
                            ? "bg-white text-black border-white ring-1 ring-white shadow-md font-semibold" 
                            : "border-white/5 hover:border-white/10 hover:bg-white/5"
                        }`}
                      >
                        <div>
                          {/* Channel Logo Frame */}
                          <div className={`w-full h-14 rounded-lg flex items-center justify-center p-2 shrink-0 border relative ${
                            isSelected ? "bg-black border-transparent" : "bg-black border-white/5"
                          }`}>
                            <ChannelLogo channel={ch} isSelected={isSelected} />

                            {/* Status Indicator */}
                            <div className="absolute top-1 right-1 flex items-center gap-1 z-10">
                              {!ch.url.startsWith("https://") ? (
                                <span className="text-[7.5px] bg-amber-500 text-black px-1 py-0.5 rounded-sm font-black scale-90 tracking-wider" title="HTTP Stream (Only plays if browser supports mixed content)">
                                  HTTP
                                </span>
                              ) : channelStatus[ch.id] === "works" ? (
                                <span className="flex h-2 w-2 relative" title="এক্টিভ">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                              ) : channelStatus[ch.id] === "fails" ? (
                                <span className="h-1.5 w-1.5 rounded-full bg-red-600" title="সমস্যা" />
                              ) : null}
                            </div>
                          </div>

                          {/* Channel Title */}
                          <div className="w-full mt-2 text-center">
                            <span className={`text-[11px] block truncate w-full tracking-wide ${
                              isSelected ? "text-black font-semibold" : "text-white"
                            }`}>
                              {ch.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Show More Pagination Button */}
                {filteredChannels.length > visibleCount && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 120)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-white/10 rounded-xl text-xs font-semibold text-white transition-all shadow-md active:scale-98 cursor-pointer"
                    >
                      চ্যানেল আরও দেখান (+১২০)
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

        </main>

        {/* ========================================================= */}
        {/* FOOTER SECTION                                            */}
        {/* ========================================================= */}
        <footer className="py-6 border-t border-white/5 text-zinc-600 text-[11px] text-center">
          <p className="font-sans">
            © ICSF {new Date().getFullYear()}. Developed by{" "}
            <a 
              href="https://Somser-SA.Pro.BD" 
              target="_blank" 
              rel="noreferrer" 
              className="text-zinc-500 hover:text-white underline transition"
            >
              Somser SA
            </a>
          </p>
        </footer>

      </div>

      {/* ========================================================= */}
      {/* SETTINGS DIALOG MODAL                                    */}
      {/* ========================================================= */}
      {isSettingOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => setIsSettingOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4 text-white" />
                টোকেন সেটিংস
              </h3>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                টোকেন আইপিটিভি চ্যানেলের অ্যাক্টিভেশন কী কনফিগার করুন
              </p>
            </div>
            
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    ব্যবহারকারী আইডি (User ID - u)
                  </label>
                  <input
                    type="text"
                    required
                    value={tempU}
                    onChange={(e) => setTempU(e.target.value)}
                    placeholder="u= parameter..."
                    className="w-full bg-black border border-white/5 focus:border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/10 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    মেয়াদোত্তীর্ণের তারিখ (Expiration - e)
                  </label>
                  <input
                    type="text"
                    required
                    value={tempE}
                    onChange={(e) => setTempE(e.target.value)}
                    placeholder="e= parameter..."
                    className="w-full bg-black border border-white/5 focus:border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/10 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setTempU("78be6644-0a65-48ec-81a4-089ac65a2619");
                    setTempE("1779283759");
                  }}
                  className="px-3 py-2 bg-zinc-900/40 border border-white/5 hover:border-white/10 text-zinc-400 hover:text-white rounded-xl text-[10px] font-bold transition active:scale-95 cursor-pointer"
                >
                  ডিফল্ট টোকেন
                </button>
                <button
                  type="submit"
                  disabled={saveSuccess}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-black tracking-wider transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {saveSuccess ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-green-600 shrink-0 animate-pulse" />
                      সেভড!
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 shrink-0" />
                      টোকেন সেভ করুন
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
