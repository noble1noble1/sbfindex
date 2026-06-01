"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { POSITIONS, HERO_COPY, KEY_DATES, getTotalGhostValue, type Position } from "@/lib/positions";

// Format large dollar amounts
function formatDollars(n: number, compact = false): string {
  if (compact) {
    if (n >= 1_000_000_000_000) return `$${(n / 1_000_000_000_000).toFixed(1)}T`;
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  }
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

// Animated counter: counts up from 0 to target over duration ms
function useCountUp(target: number, duration = 2000, start = true) {
  const [value, setValue] = useState(0);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;
    startTimeRef.current = null;

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      }
    };

    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [target, duration, start]);

  return value;
}

// Live SOL price from CoinGecko (simple public endpoint)
async function fetchSolPrice(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      { next: { revalidate: 300 } } // 5-minute cache hint
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.solana?.usd ?? null;
  } catch {
    return null;
  }
}

export default function Home() {
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [tickClass, setTickClass] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  // Derive total ghost value incorporating live SOL price
  const totalGhost = useCallback(() => {
    const positions = POSITIONS.map((p) => {
      if (p.id === "solana" && solPrice !== null) {
        return {
          ...p,
          ghostValueDisplay: Math.round((p.stakeSize as number) * solPrice),
        };
      }
      return p;
    });
    return getTotalGhostValue(positions);
  }, [solPrice]);

  const currentTotal = totalGhost();
  const displayValue = useCountUp(currentTotal, 2200, hasLoaded);

  useEffect(() => {
    setHasLoaded(true);
    fetchSolPrice().then((price) => {
      if (price) setSolPrice(price);
    });
    // Refresh SOL price every 5 minutes
    const interval = setInterval(() => {
      fetchSolPrice().then((price) => {
        if (price) {
          setSolPrice(price);
          // Trigger tick animation
          setTickClass("ticking");
          setTimeout(() => setTickClass(""), 500);
        }
      });
    }, 300_000);
    return () => clearInterval(interval);
  }, []);

  const twitterShareText = encodeURIComponent(
    `Sam Bankman-Fried would be worth ${formatDollars(currentTotal, true)} today if the FTX estate had held his book.\n\nInstead he's Federal Inmate No. 99011-398 serving 25 years.\n\nThe ghost portfolio: sbfindex.com`
  );

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f5f5f0" }}>
      {/* NAV */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 32px",
          borderBottom: "1px solid #1a1a1a",
          fontSize: "13px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#888",
        }}
      >
        <span style={{ color: "#f5f5f0", fontWeight: 600 }}>SBF INDEX</span>
        <div style={{ display: "flex", gap: "24px" }}>
          <a href="#positions" style={{ color: "#888", textDecoration: "none" }}>Positions</a>
          <a href="#about" style={{ color: "#888", textDecoration: "none" }}>About</a>
          <a
            href="https://twitter.com/intent/tweet?text=placeholder"
            onClick={(e) => {
              e.preventDefault();
              window.open(`https://twitter.com/intent/tweet?text=${twitterShareText}`, "_blank");
            }}
            style={{ color: "#888", textDecoration: "none" }}
          >
            Share
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          padding: "80px 32px 64px",
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#888",
            marginBottom: "24px",
          }}
        >
          Updated live
        </p>

        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 300,
            marginBottom: "12px",
            color: "#aaa",
          }}
        >
          {HERO_COPY.name}
        </p>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
            fontWeight: 300,
            marginBottom: "8px",
            color: "#888",
          }}
        >
          {HERO_COPY.subhead}
        </p>

        <div
          className={`hero-number tabular ${tickClass}`}
          style={{ marginBottom: "16px" }}
        >
          {formatDollars(displayValue)}
        </div>

        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "clamp(1rem, 2vw, 1.4rem)",
            fontWeight: 300,
            color: "#888",
            marginBottom: "8px",
          }}
        >
          {HERO_COPY.caveat}
        </p>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
            color: "#555",
            marginBottom: "40px",
          }}
        >
          {HERO_COPY.subtext}
        </p>

        {/* Anthropic callout box */}
        <div
          style={{
            border: "1px solid #00d47e33",
            background: "#00d47e0a",
            borderRadius: "6px",
            padding: "20px 24px",
            marginBottom: "40px",
            maxWidth: "640px",
          }}
        >
          <p style={{ fontSize: "13px", color: "#00d47e", marginBottom: "8px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Anthropic
          </p>
          <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#ccc" }}>
            The Anthropic stake alone is worth <strong style={{ color: "#f5f5f0" }}>$77.2 billion</strong> at the $965B private round price (8% × $965B).
            That exceeds the entire FTX customer deficit. From a single position.
          </p>
          <p style={{ fontSize: "13px", color: "#555", marginTop: "10px" }}>
            Source: CNBC, Jun 1 2026. Anthropic confidentially filed its IPO prospectus with the SEC after closing a $965B private round late May.
          </p>
        </div>

        {/* Share buttons */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${twitterShareText}`, "_blank")}
            style={{
              padding: "10px 20px",
              background: "#f5f5f0",
              color: "#0a0a0a",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            Tweet this
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `Sam Bankman-Fried would be worth ${formatDollars(currentTotal, true)} today if the FTX estate had held his book. sbfindex.com`
              );
            }}
            style={{
              padding: "10px 20px",
              background: "transparent",
              color: "#888",
              border: "1px solid #333",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
              letterSpacing: "0.05em",
            }}
          >
            Copy stat
          </button>
        </div>
      </section>

      {/* POSITIONS */}
      <section id="positions" style={{ padding: "0 32px 80px", maxWidth: "960px", margin: "0 auto" }}>
        <div
          style={{
            borderTop: "1px solid #222",
            paddingTop: "48px",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#555",
              marginBottom: "24px",
            }}
          >
            Holdings — Ghost Portfolio
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1px",
            background: "#1a1a1a",
            border: "1px solid #1a1a1a",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          {POSITIONS.filter((p) => p.ghostValueDisplay > 0).map((position, i) => (
            <PositionCard
              key={position.id}
              position={position}
              index={i}
              solPrice={solPrice}
            />
          ))}
        </div>

        {/* Losers */}
        <div style={{ marginTop: "48px" }}>
          <h2
            style={{
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#555",
              marginBottom: "8px",
            }}
          >
            The losers — positions that went to zero or near-zero
          </h2>
          <p style={{ fontSize: "14px", color: "#555", marginBottom: "24px" }}>
            Not all of Sam's bets were good. These positions lost value even in the ghost scenario.
            Including them here because the math is honest.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1px",
              background: "#1a1a1a",
              border: "1px solid #1a1a1a",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            {POSITIONS.filter((p) => p.ghostValueDisplay === 0 || p.multiple < 1).map(
              (position, i) => (
                <PositionCard
                  key={position.id}
                  position={position}
                  index={i}
                  solPrice={solPrice}
                  isLoser
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* ABOUT / METHODOLOGY */}
      <section
        id="about"
        style={{
          borderTop: "1px solid #1a1a1a",
          padding: "64px 32px",
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#555",
            marginBottom: "24px",
          }}
        >
          Methodology
        </h2>
        <div style={{ maxWidth: "640px", lineHeight: 1.8, color: "#888", fontSize: "15px" }}>
          <p style={{ marginBottom: "16px" }}>
            This site reconstructs the FTX / Alameda Research position book as of November 11, 2022
            (the Chapter 11 filing date) and asks: what would those positions be worth if the estate
            had held them instead of liquidating?
          </p>
          <p style={{ marginBottom: "16px" }}>
            Position data comes from the{" "}
            <a href="https://www.forbes.com/sites/josipamajic/2026/03/18/ftx-owned-anthropic-solana-and-spacex-then-had-to-sell-too-soon/" style={{ color: "#888" }}>
              Forbes March 2026 reconstruction
            </a>
            , primary SEC filings, court documents from the Delaware bankruptcy (Case No. 1-22-bk-11068),
            and Anthropic's official funding round press releases. The Cursor position was first documented
            by{" "}
            <a href="https://www.theblock.co/post/353270/ftx-sold-alamedas-anysphere-stake-for-200k-the-ai-firm-is-now-worth-9-billion" style={{ color: "#888" }}>
              The Block in May 2025
            </a>
            .
          </p>
          <p style={{ marginBottom: "16px" }}>
            Anthropic is shown at two values: $30.4B (8% x $380B Series G, February 2026) and $77.2B
            (8% x $965B private round closed late May 2026, one week before Anthropic's confidential
            IPO filing with the SEC on June 1, 2026). The site uses the private round / IPO filing
            figure as the primary display because it reflects current market demand, but both figures
            are sourced and cited.
          </p>
          <p style={{ marginBottom: "16px" }}>
            Solana price is fetched live from CoinGecko. All private company valuations are updated
            manually when new funding rounds or private round / IPO filing data is reported.
          </p>
          <p>
            Built by{" "}
            <a href="https://twitter.com/noble1noble1" style={{ color: "#888" }}>
              Noble
            </a>
            .
          </p>
        </div>
      </section>

      {/* KEY DATES */}
      <section
        style={{
          borderTop: "1px solid #1a1a1a",
          padding: "64px 32px",
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#555",
            marginBottom: "24px",
          }}
        >
          Key dates
        </h2>
        <div style={{ maxWidth: "640px" }}>
          {KEY_DATES.map((event) => (
            <div
              key={event.date}
              style={{
                display: "flex",
                gap: "24px",
                paddingBottom: "16px",
                borderBottom: "1px solid #111",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "12px",
                  color: "#444",
                  minWidth: "90px",
                }}
              >
                {event.date}
              </span>
              <span style={{ fontSize: "14px", color: "#888" }}>{event.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid #1a1a1a",
          padding: "24px 32px",
          textAlign: "center",
          fontSize: "13px",
          color: "#333",
        }}
      >
        <p>
          SBF Index is a counterfactual exercise in financial journalism. Not investment advice.
          Prices update live where available.
          Data last fully audited April 29, 2026.
        </p>
        <p style={{ marginTop: "8px" }}>
          Built by <a href="https://twitter.com/noble1noble1" style={{ color: "#444" }}>Noble</a>.
          Source data: <a href="https://www.forbes.com/sites/josipamajic/2026/03/18/ftx-owned-anthropic-solana-and-spacex-then-had-to-sell-too-soon/" style={{ color: "#444" }}>Forbes</a>,
          Anthropic press releases, Delaware Bankruptcy Court.
        </p>
      </footer>
    </div>
  );
}

function PositionCard({
  position,
  index,
  solPrice,
  isLoser = false,
}: {
  position: Position;
  index: number;
  solPrice: number | null;
  isLoser?: boolean;
}) {
  const liveValue =
    position.id === "solana" && solPrice !== null
      ? Math.round((position.stakeSize as number) * solPrice)
      : position.ghostValueDisplay;

  const isDown = liveValue < position.costBasis;
  const accentColor = isDown ? "#ff4444" : "#00d47e";

  const tweetText = encodeURIComponent(
    `${position.tagline}\n\nFull ghost portfolio: sbfindex.com`
  );

  return (
    <div
      className="fade-up"
      style={{
        background: "#0f0f0f",
        padding: "24px",
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#f5f5f0" }}>
            {position.name}
          </p>
          {position.ticker && (
            <p style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>
              {position.ticker}
            </p>
          )}
        </div>
        <span
          style={{
            fontSize: "11px",
            padding: "2px 8px",
            borderRadius: "2px",
            background: position.confidence === "high" ? "#00d47e15" : "#88888815",
            color: position.confidence === "high" ? "#00d47e" : "#888",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {position.confidence}
        </span>
      </div>

      <p
        className="tabular"
        style={{
          fontSize: "22px",
          fontFamily: "'IBM Plex Mono', monospace",
          color: accentColor,
          marginBottom: "4px",
        }}
      >
        {formatDollars(liveValue, true)}
      </p>

      <p style={{ fontSize: "12px", color: "#444", marginBottom: "12px" }}>
        cost: {formatDollars(position.costBasis, true)} &bull; estate got:{" "}
        {formatDollars(position.estateRealized, true)}
        {!isDown && (
          <span style={{ color: "#00d47e" }}>
            {" "}
            &bull; {position.multiple.toFixed(1)}x if held
          </span>
        )}
        {isDown && <span style={{ color: "#ff4444" }}> &bull; loss</span>}
      </p>

      <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.5, marginBottom: "16px" }}>
        {position.tagline}
      </p>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <a
          href={`https://twitter.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "11px",
            color: "#444",
            textDecoration: "none",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Tweet
        </a>
        <a
          href={position.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "11px",
            color: "#333",
            textDecoration: "none",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Source
        </a>
      </div>
    </div>
  );
}
