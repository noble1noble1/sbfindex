// SBF Ghost Portfolio — Position Data
// All values in USD
// Last updated: 2026-06-01
// Note: Anthropic filed confidentially for IPO on June 1, 2026 at $965B private round price

export type ConfidenceTier = "high" | "medium" | "low";
export type PositionCategory = "private_equity" | "public_equity" | "liquid_crypto" | "token_book";

export interface ValuationWaypoint {
  date: string; // YYYY-MM-DD
  value: number; // ghost portfolio value in USD at that date
  label: string;
}

export interface Position {
  id: string;
  name: string;
  ticker?: string;
  category: PositionCategory;
  costBasis: number;
  estateRealized: number;
  ghostValueBase: number; // conservative (official round / current price)
  ghostValueDisplay: number; // what to show as primary (may use secondary market)
  ghostValueNote: string;
  multiple: number; // ghostValueDisplay / costBasis
  confidence: ConfidenceTier;
  sector: string;
  tagline: string; // one sentence for position card
  sourceUrl: string;
  isLive: boolean; // if true, value is fetched from an API endpoint at runtime
  apiId?: string; // CoinGecko ID for liquid crypto positions
  stakeSize?: number; // token amount for liquid crypto, fraction for equity
  stakeUnit?: string;
  waypoints: ValuationWaypoint[];
}

export const POSITIONS: Position[] = [
  {
    id: "anthropic",
    name: "Anthropic",
    category: "private_equity",
    sector: "AI",
    costBasis: 500_000_000,
    estateRealized: 1_300_000_000,
    ghostValueBase: 30_400_000_000,   // 8% × $380B (Series G, Feb 2026)
    ghostValueDisplay: 77_200_000_000, // 8% × $965B (private round closed late May 2026)
    ghostValueNote:
      "$77.2B at the $965B private round price (closed late May 2026, one week before Anthropic's confidential IPO filing on June 1, 2026). Conservative anchor: $30.4B at Series G ($380B, Feb 2026).",
    multiple: 154,
    confidence: "high",
    tagline:
      "FTX led Anthropic's Series B in April 2022. The estate sold the entire 8% stake in 2024 for $1.3B. Anthropic filed for IPO on June 1, 2026 at a $965B valuation. The stake would be worth $77.2B today.",
    sourceUrl:
      "https://www.cnbc.com/2026/06/01/anthropic-ipo-s1-prospectus.html",
    isLive: false,
    stakeSize: 0.08,
    stakeUnit: "equity fraction",
    waypoints: [
      { date: "2022-11-11", value: 320_000_000, label: "FTX bankruptcy" },
      { date: "2024-02-22", value: 1_300_000_000, label: "Estate sells stake" },
      { date: "2025-03-01", value: 4_920_000_000, label: "Series E ($61.5B)" },
      { date: "2025-09-01", value: 14_640_000_000, label: "Series F ($183B)" },
      { date: "2026-02-12", value: 30_400_000_000, label: "Series G ($380B)" },
      { date: "2026-04-23", value: 80_000_000_000, label: "Secondary market ($1T)" },
      { date: "2026-06-01", value: 77_200_000_000, label: "Anthropic files for IPO ($965B valuation)" },
    ],
  },
  {
    id: "robinhood",
    name: "Robinhood",
    ticker: "HOOD",
    category: "public_equity",
    sector: "Fintech",
    costBasis: 648_000_000,
    estateRealized: 605_000_000,
    ghostValueBase: 5_600_000_000,   // 7.6% × $74B market cap (HOOD ~$82, Apr 28 2026)
    ghostValueDisplay: 5_600_000_000,
    ghostValueNote: "7.6% stake × ~$74B market cap (HOOD at $82.21 on Apr 28, 2026). DOJ seized shares in Jan 2023; Robinhood bought them back at ~$11/share. HOOD now trades at $82.",
    multiple: 8.6,
    confidence: "high",
    tagline:
      "SBF bought 7.6% of Robinhood in May 2022 for $648M. The DOJ seized the shares. They sold them back at $11. HOOD now trades at $82.",
    sourceUrl: "https://robinhood.com/us/en/stocks/HOOD/",
    isLive: true,
    apiId: "HOOD", // Yahoo Finance public equity -- handled in server component
    stakeSize: 56_000_000,
    stakeUnit: "shares",
    waypoints: [
      { date: "2022-11-11", value: 340_000_000, label: "FTX bankruptcy (~$6/share)" },
      { date: "2023-09-01", value: 605_000_000, label: "DOJ-forced sale ($11/share)" },
      { date: "2024-06-01", value: 2_100_000_000, label: "HOOD at ~$18/share" },
      { date: "2025-06-01", value: 3_800_000_000, label: "HOOD at ~$30/share" },
      { date: "2026-04-28", value: 5_600_000_000, label: "HOOD at ~$82/share" },
    ],
  },
  {
    id: "solana",
    name: "Solana",
    ticker: "SOL",
    category: "liquid_crypto",
    sector: "L1 Blockchain",
    costBasis: 1_000_000_000,
    estateRealized: 1_900_000_000,
    ghostValueBase: 4_900_000_000, // 58M × $84 (Apr 29 2026)
    ghostValueDisplay: 4_900_000_000,
    ghostValueNote:
      "58M SOL × current price. Estate sold 25-30M locked tokens at $64/SOL in April 2024. Buyers (Galaxy, Pantera) saw SOL hit $174 the same week.",
    multiple: 4.9,
    confidence: "high",
    tagline:
      "The estate sold locked SOL at $64 in April 2024. SOL was trading at $174 that week. Galaxy and Pantera captured the gain.",
    sourceUrl:
      "https://www.theblock.co/post/286717/ftx-estate-sells-1-9-billion-worth-of-locked-up-sol-for-64-per-token-report",
    isLive: true,
    apiId: "solana",
    stakeSize: 58_000_000,
    stakeUnit: "SOL",
    waypoints: [
      { date: "2022-11-11", value: 754_000_000, label: "FTX bankruptcy (~$13/SOL)" },
      { date: "2023-12-01", value: 3_480_000_000, label: "SOL rally ($60)" },
      { date: "2024-04-05", value: 3_712_000_000, label: "Estate sells at $64 (SOL at $174)" },
      { date: "2025-01-01", value: 13_340_000_000, label: "SOL ATH ~$230" },
      { date: "2026-04-29", value: 4_900_000_000, label: "SOL at ~$84" },
    ],
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "private_equity",
    sector: "Dev Tools / AI",
    costBasis: 200_000,
    estateRealized: 200_000,
    ghostValueBase: 3_000_000_000, // 5% × $60B SpaceX option
    ghostValueDisplay: 3_000_000_000,
    ghostValueNote:
      "5% pre-seed stake × $60B SpaceX option price (announced Apr 21, 2026). Post-dilution through Series A+B: ~$2.4B. Site uses $3B ceiling per sourced reporting.",
    multiple: 15000,
    confidence: "high",
    tagline:
      "Alameda put $200,000 into Cursor's pre-seed in April 2022. The estate sold it one year later for $200,000 exactly. SpaceX now has an option to buy Cursor for $60 billion.",
    sourceUrl:
      "https://www.reuters.com/technology/spacex-says-it-has-option-acquire-startup-cursor-60-billion-2026-04-21/",
    isLive: false,
    stakeSize: 0.05,
    stakeUnit: "equity fraction (pre-seed, ~5%)",
    waypoints: [
      { date: "2022-11-11", value: 200_000, label: "FTX bankruptcy (cost basis)" },
      { date: "2023-04-01", value: 200_000, label: "Estate sells at cost" },
      { date: "2024-06-01", value: 20_000_000, label: "Series A ($400M valuation)" },
      { date: "2025-06-05", value: 495_000_000, label: "Series B ($9.9B valuation)" },
      { date: "2026-04-21", value: 3_000_000_000, label: "SpaceX $60B option" },
    ],
  },
  {
    id: "k5-spacex",
    name: "K5 Global / SpaceX",
    category: "private_equity",
    sector: "Defense / Aerospace",
    costBasis: 700_000_000,
    estateRealized: 700_000_000, // settled, estate retained stake
    ghostValueBase: 3_000_000_000,
    ghostValueDisplay: 3_000_000_000,
    ghostValueNote:
      "FTX transferred $700M to K5 Global funds. Estate sued and settled Jan 2025, retaining the LP stake. K5 holds SpaceX, Anduril, xAI, and others. SpaceX alone is ~$350B+. Estimate per Forbes Mar 2026. SpaceX filed its S-1 on May 20, 2026 (CIK 0001181412), filed an S-1/A on June 1, and plans to debut publicly within weeks. K5 Global's SpaceX exposure is about to mark to market.",
    multiple: 4.3,
    confidence: "medium",
    tagline:
      "SBF moved $700M to K5 Global, a fund co-founded by Michael Kives with LP exposure to SpaceX. The estate sued, then settled, retaining the stake. SpaceX filed its S-1 on May 20, 2026 and debuts on public markets next week.",
    sourceUrl:
      "https://www.forbes.com/sites/josipamajic/2026/03/18/ftx-owned-anthropic-solana-and-spacex-then-had-to-sell-too-soon/",
    isLive: false,
    waypoints: [],
  },
  {
    id: "genesis-digital",
    name: "Genesis Digital Assets",
    category: "private_equity",
    sector: "Bitcoin Mining",
    costBasis: 1_150_000_000,
    estateRealized: 0, // litigation pending (FTX Trust sued Sep 2025)
    ghostValueBase: 3_500_000_000,
    ghostValueDisplay: 3_500_000_000,
    ghostValueNote:
      "FTX invested $1.15B across 4 tranches. FTX Recovery Trust sued GDA in Sep 2025 calling it one of SBF's 'most reckless' investments. GDA now exploring U.S. IPO at ~$3.5B valuation.",
    multiple: 3.0,
    confidence: "medium",
    tagline:
      "SBF invested $1.15B in a Kazakhstan-based Bitcoin miner. The estate is suing to get the money back. GDA is now exploring an IPO at $3.5B.",
    sourceUrl:
      "https://www.forbes.com/sites/josipamajic/2026/03/18/ftx-owned-anthropic-solana-and-spacex-then-had-to-sell-too-soon/",
    isLive: false,
    waypoints: [],
  },
  {
    id: "sui-mysten",
    name: "Mysten Labs / Sui",
    ticker: "SUI",
    category: "liquid_crypto",
    sector: "L1 Blockchain",
    costBasis: 100_000_000,
    estateRealized: 95_000_000, // sold warrants and preferred early 2023
    ghostValueBase: 400_000_000,
    ghostValueDisplay: 400_000_000,
    ghostValueNote:
      "FTX Ventures co-led Mysten Labs' $300M Series B in 2022. Estate sold SUI token warrants and preferred stock for <$100M in early 2023. SUI now ~$0.95/token, $9.5B FDV.",
    multiple: 4.0,
    confidence: "medium",
    tagline:
      "FTX led Mysten Labs' $300M round. The estate sold the SUI warrants for under $100M. SUI has a $9.5B FDV today.",
    sourceUrl:
      "https://www.forbes.com/sites/josipamajic/2026/03/18/ftx-owned-anthropic-solana-and-spacex-then-had-to-sell-too-soon/",
    isLive: false,
    waypoints: [],
  },
  // Losers (positions with negative ghost outcome — important for credibility)
  {
    id: "yuga-labs",
    name: "Yuga Labs (Bored Apes)",
    category: "private_equity",
    sector: "NFTs",
    costBasis: 50_000_000,
    estateRealized: 50_000_000,
    ghostValueBase: 15_000_000, // NFT market collapsed
    ghostValueDisplay: 15_000_000,
    ghostValueNote:
      "FTX Ventures put $50M in Yuga Labs at the peak of the NFT bubble (Mar 2022, $4B valuation). BAYC floor has collapsed from 1M+ to under $3K. Ghost scenario = loss.",
    multiple: 0.3,
    confidence: "medium",
    tagline:
      "FTX bought into Bored Apes at the exact top. If the estate had held, this position would have lost 70%. Not all of Sam's bets were good.",
    sourceUrl: "https://techcrunch.com/2022/12/06/ftx-and-alamedas-massive-investments-will-take-a-long-time-to-unwind-from-crypto-industry/",
    isLive: false,
    waypoints: [],
  },
  {
    id: "aptos",
    name: "Aptos (APT)",
    ticker: "APT",
    category: "liquid_crypto",
    sector: "L1 Blockchain",
    costBasis: 150_000_000,
    estateRealized: 120_000_000,
    ghostValueBase: 5_000_000, // APT at ~$0.93
    ghostValueDisplay: 5_000_000,
    ghostValueNote:
      "FTX Ventures co-led Aptos' $150M Series A at $2B valuation (Jul 2022). APT token is ~$0.93 today, 99%+ below the 2022 implied price. Ghost scenario = major loss.",
    multiple: 0.03,
    confidence: "medium",
    tagline:
      "FTX led Aptos' $150M round at a $2B valuation. APT is down 99%+ from that price. The ghost scenario here is a loss.",
    sourceUrl: "https://coincentral.com/ftx-ventures-joins-jump-crypto-in-aptos-series-a/",
    isLive: false,
    waypoints: [],
  },
];

// Compute total ghost portfolio value (display)
export function getTotalGhostValue(positions: Position[] = POSITIONS): number {
  return positions
    .filter((p) => p.ghostValueDisplay > 0)
    .reduce((sum, p) => sum + p.ghostValueDisplay, 0);
}

// Anthropic-specific: updated Jun 1 2026 with IPO filing
export const ANTHROPIC_SECONDARY_MARKET_NOTE =
  "On June 1, 2026, Anthropic confidentially filed its IPO prospectus with the SEC. Its last private round (closed late May 2026) priced the company at $965B, topping OpenAI's $852B from March. Revenue run rate hit $47B (up from $10B annual last year). The 8% ghost stake at $965B = $77.2B. The SpaceX S-1 filed May 20 means BOTH a major FTX-adjacent portfolio company (Anthropic via direct stake, SpaceX via K5 Global LP exposure) are headed public in 2026.";

// Hero text components
export const HERO_COPY = {
  name: "Sam Bankman-Fried",
  subhead: "would be worth",
  caveat: "if the FTX estate had held his book.",
  subtext: "Instead, he is Federal Inmate No. 99011-398.",
  anthropicNote: "On June 1, 2026, Anthropic filed for IPO at a $965B valuation. The 8% stake the FTX estate sold for $1.3B is now worth $77.2B.",
};

// Key contextual dates for the chart annotations
export const KEY_DATES = [
  { date: "2022-11-11", label: "FTX files Chapter 11" },
  { date: "2023-11-02", label: "SBF convicted on all 7 counts" },
  { date: "2024-03-22", label: "Estate sells Anthropic stake" },
  { date: "2024-03-28", label: "SBF sentenced to 25 years" },
  { date: "2024-04-05", label: "Estate dumps SOL at $64 (SOL at $174)" },
  { date: "2025-03-01", label: "Anthropic Series E ($61.5B)" },
  { date: "2025-09-01", label: "Anthropic Series F ($183B)" },
  { date: "2026-02-12", label: "Anthropic Series G ($380B)" },
  { date: "2026-04-21", label: "SpaceX options to buy Cursor for $60B" },
  { date: "2026-04-23", label: "Anthropic hits $1T on secondary markets" },
  { date: "2026-05-20", label: "SpaceX files S-1 with SEC" },
  { date: "2026-05-27", label: "Anthropic closes $965B private round" },
  { date: "2026-06-01", label: "Anthropic confidentially files IPO prospectus" },
];
