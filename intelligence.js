const marketCategories = [
  "All",
  "Garage Matches",
  "Auction Results",
  "Marketplace Watch",
  "Model Markets",
  "Source Pages",
  "Manual Source"
];

const digestCategories = [
  "All",
  "For You",
  "Market Analysis",
  "Auction Results",
  "New Listings",
  "News",
  "Saved Cars",
  "Similar Models",
  "Long Reads"
];

let activeAuctionTab = "All";
let activeDigestTab = "All";
let auctionState = { items: [], statuses: [], loading: true, fetchedAt: "" };
let digestState = { items: [], statuses: [], loading: true, fetchedAt: "" };

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function decodeHtmlEntities(value) {
  let text = String(value || "");
  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    for (let i = 0; i < 2; i += 1) {
      textarea.innerHTML = text;
      text = textarea.value;
    }
    return text;
  }
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&hellip;/g, "...")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function cleanSourceText(value, fallback = "") {
  return decodeHtmlEntities(value || fallback)
    .replace(/\s*\[(?:…|\.{3}|&hellip;)\]\s*/gi, "...")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(value) {
  if (!value) return "Date unavailable";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return escapeHtml(value);
  return parsed.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatRefresh(value) {
  if (!value) return "Not refreshed yet";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Refresh time unavailable";
  return parsed.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function garageCars() {
  return window.VeloceMatcher?.garageVehicles?.() || [];
}

function itemScore(item) {
  return window.VeloceMatcher?.rankForUser?.(item) || 0;
}

function matchReason(item) {
  return window.VeloceMatcher?.reasonForItem?.(item) || "No garage match detected";
}

function itemVehicle(item) {
  return item.vehicleId ? window.getVehicle?.(item.vehicleId) : null;
}

function realItemImage(item, imageType = "thumbnail") {
  if (item.imageUrl) return item.imageUrl;
  const vehicle = itemVehicle(item);
  if (vehicle) return window.resolveVehicleImage?.(vehicle, imageType) || "";
  return window.resolveVehicleImage?.("unknown-vehicle", imageType) || "";
}

function fieldValue(value) {
  return value ? escapeHtml(value) : "Not listed";
}

function signalBadge(label) {
  return `<span class="market-signal">${escapeHtml(label)}</span>`;
}

function renderTabs(target, tabs, active, handler) {
  const el = document.querySelector(target);
  if (!el) return;
  el.innerHTML = tabs.map(tab => `
    <button class="${tab === active ? "active" : ""}" type="button" data-tab="${escapeHtml(tab)}" data-handler="${handler}">${escapeHtml(tab)}</button>
  `).join("");
}

function sourceStatusPanel(statuses, fetchedAt) {
  const okCount = (statuses || []).filter(status => status.state === "ok").length;
  const totalCount = (statuses || []).reduce((sum, status) => sum + (Number(status.count) || 0), 0);
  const hasError = (statuses || []).some(status => status.state !== "ok");
  if (!document.body?.classList.contains("show-source-health")) return "";
  if (!statuses?.length) {
    return `
      <div class="source-health-line">
        <span>Sources not configured</span>
      </div>
    `;
  }
  return `
    <div class="source-health-line ${digestState.refreshError ? "using-cache" : ""}">
      <span>${digestState.refreshError ? "Using last successful briefing" : `Updated ${formatRefresh(fetchedAt)}`}</span>
      <span>${okCount}/${statuses.length} sources available${totalCount ? ` / ${totalCount} items` : ""}</span>
      <button class="source-details-toggle" type="button" data-source-details-toggle>Source details</button>
    </div>
    ${digestState.refreshError ? `<p class="source-soft-note">Refresh could not reach every feed from this browser, so Veloce kept the last successful source cache.</p>` : ""}
    <details class="source-status-panel" data-source-details>
      <summary>Source health</summary>
      <div class="source-status-grid">
        ${statuses.map(status => `
          <div class="source-status ${status.state === "ok" ? "ok" : "warn"}">
            <span>${escapeHtml(status.sourceName)}</span>
            <strong>${status.state === "ok" ? `${status.count || 0} item${status.count === 1 ? "" : "s"}` : "Unavailable in browser refresh"}</strong>
          </div>
        `).join("")}
      </div>
      ${hasError ? `<p class="source-cache-note">Some feeds block direct browser refreshes. The scheduled cache refresh is the stable production path.</p>` : ""}
    </details>
  `;
}

function loadingPanel(label) {
  return `
    <article class="empty-intel-panel">
      <p class="eyebrow">${escapeHtml(label)}</p>
      <h2>Refreshing approved external sources.</h2>
      <p>Veloce is fetching real source data. If a source is unavailable, it will stay empty rather than showing invented content.</p>
    </article>
  `;
}

function emptyPanel(title, copy, actions = "") {
  return `
    <article class="empty-intel-panel">
      <p class="eyebrow">Real-data state</p>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(copy)}</p>
      ${actions}
    </article>
  `;
}

function garageDigestEmptyPanel() {
  return `
    <article class="garage-digest-empty-card">
      <div>
        <p class="eyebrow">Garage briefing</p>
        <h3>No cars saved yet.</h3>
        <p>Save a few models to unlock vehicle-specific source updates here. You can still read the broader Collector Digest below.</p>
      </div>
      <div class="intel-actions">
        <a class="button primary" href="explore.html">Build My Garage</a>
        <a class="button secondary" href="#collectorDigest">Read Collector Digest</a>
      </div>
    </article>
  `;
}

function actionButtons(item, type) {
  const label = type === "auction" ? "Open listing" : "Read source";
  return `
    <div class="intel-actions">
      <a class="button primary" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener">${label}</a>
      ${item.vehicleId ? `<a class="button secondary" href="explore.html">Compare</a>` : ""}
    </div>
  `;
}

function filterByTab(items, tab) {
  if (tab === "All") return items;
  if (tab === "Garage Matches" || tab === "For You" || tab === "Saved Cars") return items.filter(item => itemScore(item) > 0);
  if (tab === "Similar Models") return items.filter(item => item.relatedVehicleIds?.length);
  return items.filter(item => (item.tags || []).includes(tab));
}

function renderAuctionCard(item, featured = false) {
  const vehicle = itemVehicle(item);
  const image = realItemImage(item);
  const match = itemScore(item) > 0 ? matchReason(item) : "No saved garage match detected";
  return `
    <article class="${featured ? "auction-radar-card" : "intelligence-card"}">
      <figure>
        <img src="${escapeHtml(image)}" alt="${escapeHtml(item.title)}" loading="lazy" ${vehicle ? `data-vehicle-id="${vehicle.id}"` : ""} />
      </figure>
      <div class="intel-card-body">
        <div class="intel-meta-row">
          <span>${escapeHtml(item.source)} / fetched ${formatRefresh(item.fetchedAt)}</span>
          ${signalBadge(item.listingStatus || "source item")}
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <div class="intel-data-strip">
          <div><span>Bid</span><strong>${fieldValue(item.currentBid)}</strong></div>
          <div><span>Ask</span><strong>${fieldValue(item.askingPrice)}</strong></div>
          <div><span>Ends</span><strong>${fieldValue(item.auctionEndDate)}</strong></div>
        </div>
        <p>${escapeHtml(item.rawText ? item.rawText.slice(0, 220) : "No source excerpt available.")}</p>
        <p><strong>Detected vehicle:</strong> ${vehicle ? escapeHtml(vehicle.displayName) : "Not confidently matched"}</p>
        <p class="garage-match-label">${escapeHtml(match)}</p>
        ${actionButtons(item, "auction")}
      </div>
    </article>
  `;
}

function renderDigestCard(item, compact = false) {
  const vehicle = itemVehicle(item);
  const image = realItemImage(item);
  const match = itemScore(item) > 0 ? matchReason(item) : "No saved garage match detected";
  const headline = cleanSourceText(item.headline, "Untitled source article");
  const excerpt = cleanSourceText(item.excerpt, "No source excerpt available.");
  const source = cleanSourceText(item.source, "Source");
  return `
    <article class="${compact ? "briefing-takeaway" : "digest-briefing-card"}">
      ${compact ? "" : `<img src="${escapeHtml(image)}" alt="${escapeHtml(headline)}" loading="lazy" ${vehicle ? `data-vehicle-id="${vehicle.id}"` : ""} />`}
      <div>
        <div class="intel-meta-row">
          <span>${escapeHtml(source)} / ${formatDate(item.publishedAt)}</span>
          ${signalBadge(item.vehicleId ? "vehicle match" : "source article")}
        </div>
        <h3>${escapeHtml(headline)}</h3>
        <p>${escapeHtml(excerpt)}</p>
        <p><strong>Why you are seeing this:</strong> ${escapeHtml(match)}</p>
        ${vehicle ? `<p><strong>Related garage context:</strong> ${escapeHtml(vehicle.displayName)}</p>` : ""}
        ${compact ? "" : actionButtons(item, "digest")}
      </div>
    </article>
  `;
}

function renderDebugPanel(target, state, label) {
  const el = document.querySelector(target);
  if (!el || !new URLSearchParams(window.location.search).has("debug")) return;
  const matches = state.items.filter(item => itemScore(item) > 0).length;
  el.insertAdjacentHTML("beforeend", `
    <details class="source-debug-panel">
      <summary>${escapeHtml(label)} source debug</summary>
      <p>${state.items.length} real item${state.items.length === 1 ? "" : "s"} fetched. ${matches} matched My Garage.</p>
      <ul>
        ${state.statuses.map(status => `<li>${escapeHtml(status.sourceName)}: ${escapeHtml(status.state)} ${status.count ? `(${status.count})` : ""} ${status.error ? `- ${escapeHtml(status.error)}` : ""}</li>`).join("")}
      </ul>
    </details>
  `);
}

function renderAuctionsPage() {
  const radarGrid = document.querySelector("#auctionRadarGrid");
  if (!radarGrid) return;
  const saved = garageCars();
  const note = document.querySelector("#auctionPersonalizationNote");
  const empty = document.querySelector("#auctionEmptyState");
  const feedGrid = document.querySelector("#auctionIntelligenceGrid");
  const watchlist = document.querySelector("#watchlistMatchGrid");

  if (note) {
    note.textContent = auctionState.loading
      ? "Refreshing approved sources."
      : `${auctionState.items.length} real source item${auctionState.items.length === 1 ? "" : "s"} found. ${saved.length ? `Matched against ${saved.length} saved garage item${saved.length === 1 ? "" : "s"}.` : "Save cars to personalize ranking."}`;
  }

  if (auctionState.loading) {
    if (empty) empty.innerHTML = loadingPanel("Auction sources");
    radarGrid.innerHTML = "";
    if (feedGrid) feedGrid.innerHTML = "";
    if (watchlist) watchlist.innerHTML = "";
    renderTabs("#auctionTabs", marketCategories, activeAuctionTab, "auction");
    return;
  }

  const filtered = filterByTab(auctionState.items, activeAuctionTab);
  const garageMatches = auctionState.items.filter(item => itemScore(item) > 0);
  if (empty) {
    empty.innerHTML = [
      sourceStatusPanel(auctionState.statuses, auctionState.fetchedAt),
      !auctionState.items.length ? emptyPanel(
        "No live auction/listing items found.",
        "The configured auction sources did not return usable real listing data. Connect an official feed/API or add manual source URLs when available.",
        `<div class="intel-actions"><a class="button primary" href="explore.html">Explore cars</a><a class="button secondary" href="garage.html">Open My Garage</a></div>`
      ) : ""
    ].join("");
  }

  radarGrid.innerHTML = (garageMatches.length ? garageMatches : auctionState.items).slice(0, 3).map(item => renderAuctionCard(item, true)).join("");
  renderTabs("#auctionTabs", marketCategories, activeAuctionTab, "auction");
  if (feedGrid) {
    feedGrid.innerHTML = filtered.length
      ? filtered.map(item => renderAuctionCard(item)).join("")
      : emptyPanel("No matching real items yet.", "Try another filter or save cars to My Garage. Veloce will not fabricate auction cards for this state.");
  }
  if (watchlist) {
    watchlist.innerHTML = garageMatches.length
      ? garageMatches.slice(0, 4).map(item => `
        <article class="watchlist-match-card">
          ${signalBadge(item.source)}
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(matchReason(item))}</p>
          <a class="source-link" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener">Open source</a>
        </article>
      `).join("")
      : emptyPanel("No garage-matched listings yet.", "Save more cars or connect a listing source that exposes searchable, usable listing data.");
  }
  renderDebugPanel("#auctionEmptyState", auctionState, "Auction");
}

function renderDigestPage() {
  const briefing = document.querySelector("#briefingGrid");
  if (!briefing) return;
  const saved = garageCars();
  const note = document.querySelector("#digestPersonalizationNote");
  const empty = document.querySelector("#digestEmptyState");
  const feedGrid = document.querySelector("#digestFeedGrid");
  const deepDives = document.querySelector("#deepDiveGrid");
  const updates = document.querySelector("#savedCarUpdatesGrid");
  const refreshButton = document.querySelector("#refreshDigestSources");
  const briefingTitle = document.querySelector("#digestBriefingTitle");

  if (note) {
    note.textContent = digestState.loading
      ? "Refreshing approved feeds."
      : `${digestState.items.length} real article${digestState.items.length === 1 ? "" : "s"} / updated ${formatRefresh(digestState.fetchedAt)}`;
  }
  if (refreshButton) {
    refreshButton.disabled = digestState.loading;
    refreshButton.textContent = digestState.loading ? "Refreshing..." : "Refresh sources";
  }
  if (briefingTitle) {
    briefingTitle.textContent = "Collector Digest";
  }

  if (digestState.loading) {
    if (empty) empty.innerHTML = loadingPanel("Digest sources");
    briefing.innerHTML = "";
    if (feedGrid) feedGrid.innerHTML = "";
    if (deepDives) deepDives.innerHTML = "";
    if (updates) updates.innerHTML = "";
    renderTabs("#digestTabs", digestCategories, activeDigestTab, "digest");
    return;
  }

  const filtered = filterByTab(digestState.items, activeDigestTab);
  const garageMatches = digestState.items.filter(item => itemScore(item) > 0);
  if (empty) {
    empty.innerHTML = [
      sourceStatusPanel(digestState.statuses, digestState.fetchedAt),
      !digestState.items.length ? emptyPanel(
        "No real digest items found.",
        "The configured feeds are unavailable or returned no parseable articles. Veloce will stay blank instead of inventing a briefing.",
        `<div class="intel-actions"><a class="button primary" href="explore.html">Explore cars</a><a class="button secondary" href="garage.html">Open My Garage</a></div>`
      ) : ""
    ].join("");
  }

  briefing.innerHTML = (garageMatches.length ? garageMatches : digestState.items).slice(0, 4).map(item => renderDigestCard(item, true)).join("");
  renderTabs("#digestTabs", digestCategories, activeDigestTab, "digest");
  if (feedGrid) {
    feedGrid.innerHTML = filtered.length
      ? filtered.map(item => renderDigestCard(item)).join("")
      : emptyPanel("No matching real articles yet.", "Try another filter or save more cars. Veloce will not fabricate digest items.");
  }
  if (deepDives) {
    const longReads = digestState.items.filter(item => item.fullTextAvailable || item.tags?.includes("Long Reads")).slice(0, 4);
    deepDives.innerHTML = longReads.length
      ? longReads.map(item => renderDigestCard(item)).join("")
      : emptyPanel("No long reads available from the current fetch.", "When a connected source exposes longer article content, Veloce will show it here.");
  }
  if (updates) {
    updates.innerHTML = saved.length
      ? saved.map(vehicle => {
        const related = digestState.items.find(item => [item.vehicleId, ...(item.relatedVehicleIds || [])].includes(vehicle.id));
        return `
          <article class="saved-update-card">
            <p class="eyebrow">${escapeHtml(vehicle.categories?.[0] || vehicle.country)}</p>
            <h3>${escapeHtml(vehicle.displayName)}</h3>
            ${related ? `<p>Latest matched source: <a class="source-link" href="${escapeHtml(related.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(related.headline)}</a></p>` : "<p>No real source update matched this car in the latest refresh.</p>"}
          </article>
        `;
      }).join("")
      : garageDigestEmptyPanel();
  }
  renderDebugPanel("#digestEmptyState", digestState, "Digest");
}

async function refreshAuctions() {
  if (!document.querySelector("#auctionRadarGrid")) return;
  renderAuctionsPage();
  if (!window.VeloceAuctionService?.loadAuctions) {
    auctionState = { items: [], statuses: [], loading: false, fetchedAt: "" };
    renderAuctionsPage();
    return;
  }
  const result = await window.VeloceAuctionService.loadAuctions();
  auctionState = { ...result, loading: false };
  renderAuctionsPage();
}

async function refreshDigest(options = {}) {
  if (!document.querySelector("#briefingGrid")) return;
  digestState = { ...digestState, loading: true };
  renderDigestPage();
  if (!window.VeloceDigestService?.loadDigest) {
    digestState = { items: [], statuses: [], loading: false, fetchedAt: "" };
    renderDigestPage();
    return;
  }
  const result = await window.VeloceDigestService.loadDigest(options);
  digestState = { ...result, loading: false };
  renderDigestPage();
}

document.addEventListener("click", event => {
  const sourceToggle = event.target.closest("[data-source-details-toggle]");
  if (sourceToggle) {
    document.body.classList.toggle("show-source-health");
    renderDigestPage();
    return;
  }

  const tab = event.target.closest("[data-tab]");
  if (!tab) return;
  if (tab.dataset.handler === "auction") {
    activeAuctionTab = tab.dataset.tab;
    renderAuctionsPage();
  }
  if (tab.dataset.handler === "digest") {
    activeDigestTab = tab.dataset.tab;
    renderDigestPage();
  }
});

document.querySelector("#refreshDigestSources")?.addEventListener("click", () => {
  refreshDigest({ forceLive: true });
});

window.addEventListener("focus", () => {
  if (!document.querySelector("#briefingGrid")) return;
  digestState = { ...digestState, items: window.VeloceMatcher?.sort?.(digestState.items || []) || digestState.items };
  renderDigestPage();
});

refreshAuctions();
refreshDigest();
