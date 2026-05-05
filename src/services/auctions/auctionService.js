window.VeloceAuctionService = (() => {
  const core = window.VeloceSourceCore;
  const matcher = window.VeloceMatcher;

  const auctionSources = [
    {
      name: "Bring a Trailer",
      type: "source-page",
      url: "https://bringatrailer.com/auctions/",
      tags: ["Auction Results", "Marketplace Watch"],
      enabled: false,
      disabledReason: "Official listing feed/API not configured for this static prototype.",
      parser: {
        itemSelector: "article, .auction-item, .listing, li",
        titleSelectors: ["h3", "h2", "a"]
      },
      refreshMs: 1000 * 60 * 30
    },
    {
      name: "Hemmings Auctions",
      type: "source-page",
      url: "https://www.hemmings.com/auctions",
      tags: ["Marketplace Watch", "Source Pages"],
      enabled: false,
      disabledReason: "Official listing feed/API not configured for this static prototype.",
      parser: {
        itemSelector: "article, .auction-card, .vehicle-card, li",
        titleSelectors: ["h3", "h2", "a"]
      },
      refreshMs: 1000 * 60 * 30
    },
    {
      name: "CLASSIC.COM",
      type: "source-page",
      url: "https://www.classic.com/markets/",
      tags: ["Model Markets", "Source Pages"],
      enabled: false,
      disabledReason: "Official market/listing feed/API not configured for this static prototype.",
      parser: {
        itemSelector: "article, .market, .card, li",
        titleSelectors: ["h3", "h2", "a"]
      },
      refreshMs: 1000 * 60 * 60
    }
  ];

  function detectYear(text = "") {
    const match = text.match(/\b(19[3-9]\d|20[0-2]\d)\b/);
    return match ? Number(match[1]) : undefined;
  }

  function detectMoney(text = "") {
    const match = text.match(/\$[\d,]+(?:\.\d+)?\s?(?:k|K|m|M)?/);
    return match ? match[0] : "";
  }

  function normalizeListing(item, source) {
    const annotated = matcher.annotateItem({
      id: item.id || `${core.slugify(source.name)}-${core.slugify(item.title || item.sourceUrl)}`,
      source: item.source || source.name,
      sourceUrl: item.sourceUrl,
      title: item.title,
      vehicleId: item.vehicleId,
      detectedMake: "",
      detectedModel: "",
      detectedYear: detectYear(`${item.title} ${item.rawText}`),
      imageUrl: item.imageUrl || "",
      currentBid: detectMoney(item.rawText || ""),
      askingPrice: "",
      estimateLow: "",
      estimateHigh: "",
      location: "",
      auctionEndDate: "",
      listingStatus: "unknown",
      fetchedAt: item.fetchedAt || core.nowIso(),
      sourcePublishedAt: "",
      summary: "",
      rawText: item.rawText || item.title || "",
      tags: [...new Set([...(source.tags || []), ...(item.tags || [])])]
    }, "title");

    const vehicle = annotated.vehicleId ? window.getVehicle?.(annotated.vehicleId) : null;
    return {
      ...annotated,
      detectedMake: annotated.detectedMakes?.[0] || vehicle?.make || "",
      detectedModel: annotated.detectedModels?.[0] || vehicle?.model || ""
    };
  }

  function looksLikeVehicleListing(item) {
    const text = `${item.title || ""} ${item.rawText || ""}`;
    const hasVehicleLanguage = /\b(car|truck|coupe|sedan|roadster|convertible|wagon|auction|bid|sold|porsche|ferrari|ford|chevrolet|bmw|mercedes|nissan|toyota|honda|dodge|jaguar|lamborghini|mclaren|aston|audi|mazda|lotus|lexus|cadillac|shelby|plymouth|buick)\b/i.test(text);
    return Boolean(item.vehicleId || (item.detectedYear && hasVehicleLanguage));
  }

  async function fetchSource(source) {
    if (!source.enabled) {
      return {
        source,
        items: [],
        status: core.status(source.name, "disabled", { error: source.disabledReason || "Connect a source to enable this feed" })
      };
    }
    const result = await core.fetchText(source.url, {
      sourceName: source.name,
      refreshMs: source.refreshMs
    });
    if (!result.ok || !result.text) {
      return {
        source,
        items: [],
        status: core.status(source.name, "error", {
          error: result.error || "Source unavailable",
          lastSuccessfulFetch: result.fetchedAt || ""
        })
      };
    }

    try {
      const items = core.parseHtmlLinks(result.text, source, source.parser)
        .map(item => normalizeListing({ ...item, fetchedAt: result.fetchedAt }, source))
        .filter(item => item.sourceUrl && item.title)
        .filter(item => item.title.length > 8)
        .filter(looksLikeVehicleListing)
        .slice(0, 30);
      return {
        source,
        items,
        status: core.status(source.name, "ok", {
          count: items.length,
          fetchedAt: result.fetchedAt,
          fromCache: Boolean(result.fromCache)
        })
      };
    } catch (error) {
      return {
        source,
        items: [],
        status: core.status(source.name, "error", { error: error?.message || "Unable to parse source" })
      };
    }
  }

  function manualItems() {
    const raw = localStorage.getItem("veloceManualAuctionUrls");
    if (!raw) return [];
    try {
      return JSON.parse(raw)
        .filter(item => item.sourceUrl && item.title)
        .map(item => normalizeListing({
          ...item,
          source: item.source || "Manual source",
          fetchedAt: item.fetchedAt || core.nowIso(),
          rawText: `${item.title} ${item.rawText || ""}`
        }, { name: item.source || "Manual source", tags: ["Manual Source"] }));
    } catch {
      return [];
    }
  }

  async function loadLocalCache() {
    try {
      const response = await fetch("data/auction-cache.json", { cache: "no-store" });
      if (!response.ok) return null;
      const cache = await response.json();
      const items = (cache.items || [])
        .filter(item => item.sourceUrl && item.title)
        .map(item => normalizeListing(item, { name: item.source || "Cached source", tags: item.tags || [] }));
      return {
        items: matcher.sort([...items, ...manualItems()]),
        statuses: cache.statuses || [],
        fetchedAt: cache.generatedAt || core.nowIso(),
        sourceType: cache.sourceType || "cache"
      };
    } catch {
      return null;
    }
  }

  async function loadAuctions() {
    const cached = await loadLocalCache();
    if (cached) {
      console.groupCollapsed?.("[Veloce real data] Auction cache");
      console.log("auction cached items", cached.items.length);
      console.groupEnd?.();
      return cached;
    }

    const responses = await Promise.all(auctionSources.map(fetchSource));
    const statuses = responses.map(response => response.status);
    const items = [...responses.flatMap(response => response.items), ...manualItems()]
      .filter(item => item.sourceUrl)
      .filter((item, index, all) => all.findIndex(candidate => candidate.sourceUrl === item.sourceUrl) === index);

    const ranked = matcher.sort(items);
    console.groupCollapsed?.("[Veloce real data] Auction refresh");
    statuses.forEach(status => console.log(status.sourceName, status.state, status.count || 0, status.error || ""));
    console.log("auction items", ranked.length, "garage matches", ranked.filter(item => matcher.rankForUser(item) > 0).length);
    console.groupEnd?.();
    return { items: ranked, statuses, fetchedAt: core.nowIso() };
  }

  return { auctionSources, loadAuctions };
})();
