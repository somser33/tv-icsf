export interface Channel {
  id: string;
  name: string;
  url: string;
  logo: string;
  category: string;
}

import rawChannels from "./parsedChannels.json";

export const INITIAL_CHANNELS: Channel[] = (rawChannels && rawChannels.length > 0) 
  ? (rawChannels as Channel[]) 
  : [];

export function determineCategory(name: string): string {
  const normalized = name.toLowerCase();
  if (
    normalized.includes("sports") ||
    normalized.includes("sport") ||
    normalized.includes("football") ||
    normalized.includes("cricket") ||
    normalized.includes("play") ||
    normalized.includes("golf") ||
    normalized.includes("fight") ||
    normalized.includes("tsn") ||
    normalized.includes("espn") ||
    normalized.includes("bein") ||
    normalized.includes("premier") ||
    normalized.includes("madrid") ||
    normalized.includes("psl") ||
    normalized.includes("ufc")
  ) {
    return "Sports";
  }
  if (
    normalized.includes("news") ||
    normalized.includes("cnn") ||
    normalized.includes("jazeera") ||
    normalized.includes("wion") ||
    normalized.includes("dw") ||
    normalized.includes("khabar") ||
    normalized.includes("today") ||
    normalized.includes("nation") ||
    normalized.includes("somoy") ||
    normalized.includes("jamuna") ||
    normalized.includes("independent") ||
    normalized.includes("abc") ||
    normalized.includes("cbs") ||
    normalized.includes("trt")
  ) {
    return "News";
  }
  return "Entertainment";
}
