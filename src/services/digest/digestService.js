window.VeloceDigestService = (() => {
  const core = window.VeloceSourceCore;
  const matcher = window.VeloceMatcher;

  const digestSources = [
    {
      name: "Motor1",
      type: "rss",
      feedUrl: "https://www.motor1.com/rss/news/all/",
      tags: ["News", "New Listings"],
      refreshMs: 1000 * 60 * 45
    },
    {
      name: "Motor1 All Articles",
      type: "rss",
      feedUrl: "https://www.motor1.com/rss/articles/all/",
      tags: ["News", "Long Reads"],
      refreshMs: 1000 * 60 * 60
    },
    {
      name: "Car and Driver",
      type: "rss",
      feedUrl: "https://www.caranddriver.com/rss/news.xml",
      tags: ["News"],
      refreshMs: 1000 * 60 * 45
    },
    {
      name: "Hagerty Media",
      type: "rss",
      feedUrl: "https://www.hagerty.com/media/feed/",
      tags: ["Market Analysis", "Long Reads"],
      refreshMs: 1000 * 60 * 60
    }
  ];

  function normalizeArticle(item, source) {
    const annotated = matcher.annotateItem({
      id: `${core.slugify(source.name)}-${core.slugify(item.headline || item.sourceUrl)}`,
      source: item.source,
      sourceUrl: item.sourceUrl,
      headline: item.headline,
      author: item.author || "",
      publishedAt: item.publishedAt || "",
      fetchedAt: item.fetchedAt || core.nowIso(),
      imageUrl: item.imageUrl || "",
      excerpt: item.excerpt || "",
      fullTextAvailable: Boolean(item.fullTextAvailable),
      relatedVehicleIds: [],
      detectedMakes: [],
      detectedModels: [],
      tags: [...new Set([...(source.tags || []), ...(item.tags || [])])],
      rawText: item.rawText || ""
    }, "headline");

    return {
      ...annotated,
      whyItMatters: annotated.vehicleId ? matcher.reasonForItem(annotated) : "",
      marketImplication: ""
    };
  }

  async function fetchSource(source, options = {}) {
    const result = await core.fetchText(source.feedUrl, {
      sourceName: source.name,
      refreshMs: source.refreshMs,
      force: Boolean(options.force)
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
      const items = core.parseRss(result.text, source)
        .map(item => normalizeArticle({ ...item, fetchedAt: result.fetchedAt }, source))
        .filter(item => item.sourceUrl && item.headline);
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

  async function loadLocalCache() {
    try {
      const response = await fetch("data/digest-cache.json", { cache: "no-store" });
      if (!response.ok) return null;
      const cache = await response.json();
      const items = (cache.items || [])
        .filter(item => item.sourceUrl && item.headline)
        .map(item => ({
          ...matcher.annotateItem(item, "headline"),
          whyItMatters: item.vehicleId ? matcher.reasonForItem(item) : ""
        }));
      return {
        items: matcher.sort(items),
        statuses: cache.statuses || [],
        fetchedAt: cache.generatedAt || core.nowIso(),
        sourceType: cache.sourceType || "cache"
      };
    } catch {
      return null;
    }
  }

  async function loadDigest(options = {}) {
    const fallbackCache = await loadLocalCache();
    const cached = options.forceLive ? null : fallbackCache;
    if (cached?.items?.length) {
      console.groupCollapsed?.("[Veloce real data] Digest cache");
      console.log("digest cached items", cached.items.length);
      console.groupEnd?.();
      return cached;
    }

    const responses = await Promise.all(digestSources.map(source => fetchSource(source, { force: options.forceLive })));
    const statuses = responses.map(response => response.status);
    const items = responses
      .flatMap(response => response.items)
      .filter(item => item.sourceUrl)
      .filter((item, index, all) => all.findIndex(candidate => candidate.sourceUrl === item.sourceUrl) === index);

    const ranked = matcher.sort(items);
    console.groupCollapsed?.("[Veloce real data] Digest refresh");
    statuses.forEach(status => console.log(status.sourceName, status.state, status.count || 0, status.error || ""));
    console.log("digest items", ranked.length, "garage matches", ranked.filter(item => matcher.rankForUser(item) > 0).length);
    console.groupEnd?.();
    if (options.forceLive && !ranked.length && fallbackCache?.items?.length) {
      return {
        ...fallbackCache,
        statuses,
        attemptedAt: core.nowIso(),
        refreshError: "Browser source refresh could not retrieve parseable feed items. Showing the last successful cache.",
        sourceType: "cache-after-failed-browser-refresh"
      };
    }
    return { items: ranked, statuses, fetchedAt: core.nowIso(), sourceType: options.forceLive ? "browser-refresh" : "live-fetch" };
  }

  return { digestSources, loadDigest };
})();
