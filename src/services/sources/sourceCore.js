window.VeloceSourceCore = (() => {
  const CACHE_PREFIX = "veloceSourceCache:";
  const DEFAULT_REFRESH_MS = 1000 * 60 * 30;
  const corsProxy = "https://api.allorigins.win/raw?url=";

  function nowIso() {
    return new Date().toISOString();
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/https?:\/\//g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 96);
  }

  function cacheKey(sourceName, url) {
    return `${CACHE_PREFIX}${sourceName}:${slugify(url)}`;
  }

  function readCache(sourceName, url, refreshMs = DEFAULT_REFRESH_MS) {
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey(sourceName, url)) || "null");
      if (!cached?.fetchedAt) return null;
      const age = Date.now() - Date.parse(cached.fetchedAt);
      return age < refreshMs ? cached : null;
    } catch {
      return null;
    }
  }

  function writeCache(sourceName, url, payload) {
    const cached = { ...payload, fetchedAt: payload.fetchedAt || nowIso(), sourceName, url };
    localStorage.setItem(cacheKey(sourceName, url), JSON.stringify(cached));
    return cached;
  }

  async function fetchText(url, options = {}) {
    const { sourceName = "External source", refreshMs = DEFAULT_REFRESH_MS, allowProxy = true, force = false } = options;
    const cached = force ? null : readCache(sourceName, url, refreshMs);
    if (cached?.text) return { ...cached, fromCache: true };

    const attempts = [url];
    if (allowProxy && /^https?:\/\//.test(url)) attempts.push(`${corsProxy}${encodeURIComponent(url)}`);

    let lastError = "";
    for (const requestUrl of attempts) {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(requestUrl, { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        const text = await response.text();
        window.clearTimeout(timeout);
        return writeCache(sourceName, url, { ok: true, text, fetchedAt: nowIso() });
      } catch (error) {
        lastError = error?.name === "AbortError" ? "Source request timed out in this browser" : (error?.message || String(error));
      } finally {
        window.clearTimeout(timeout);
      }
    }

    return { ok: false, text: "", fetchedAt: nowIso(), error: lastError || "Unable to fetch source" };
  }

  function textFromHtml(html = "") {
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll("script, style, noscript, svg").forEach(node => node.remove());
    return doc.body?.textContent?.replace(/\s+/g, " ").trim() || "";
  }

  function firstText(node, selectors) {
    for (const selector of selectors) {
      const found = node.querySelector(selector);
      if (found?.textContent?.trim()) return found.textContent.trim();
    }
    return "";
  }

  function firstAttr(node, selectors, attr) {
    for (const selector of selectors) {
      const found = node.querySelector(selector);
      const value = found?.getAttribute(attr);
      if (value) return value;
    }
    return "";
  }

  function absolutizeUrl(url, baseUrl) {
    if (!url) return "";
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  }

  function parseRss(text, source) {
    const doc = new DOMParser().parseFromString(text, "text/xml");
    const parseError = doc.querySelector("parsererror");
    if (parseError) throw new Error("Invalid RSS/XML response");
    return [...doc.querySelectorAll("item, entry")].map(item => {
      const linkNode = item.querySelector("link");
      const link = linkNode?.getAttribute("href") || linkNode?.textContent?.trim() || "";
      const media = firstAttr(item, ["media\\:content", "media\\:thumbnail", "enclosure"], "url");
      const encoded = firstText(item, ["content\\:encoded", "content"]);
      const description = firstText(item, ["description", "summary"]);
      return {
        source: source.name,
        sourceUrl: absolutizeUrl(link, source.feedUrl || source.url),
        headline: firstText(item, ["title"]),
        author: firstText(item, ["dc\\:creator", "author", "name"]),
        publishedAt: firstText(item, ["pubDate", "published", "updated"]),
        fetchedAt: nowIso(),
        imageUrl: absolutizeUrl(media, source.feedUrl || source.url),
        excerpt: textFromHtml(description || encoded).slice(0, 360),
        rawText: textFromHtml(`${firstText(item, ["title"])} ${description} ${encoded}`),
        fullTextAvailable: Boolean(encoded),
        tags: [...item.querySelectorAll("category")].map(node => node.textContent.trim()).filter(Boolean)
      };
    }).filter(item => item.headline && item.sourceUrl);
  }

  function parseHtmlLinks(text, source, options = {}) {
    const doc = new DOMParser().parseFromString(text, "text/html");
    const cards = [...doc.querySelectorAll(options.itemSelector || "article, li, .listing, .auction-item")];
    return cards.map((card, index) => {
      const anchor = card.querySelector("a[href]");
      const title = firstText(card, options.titleSelectors || ["h1", "h2", "h3", "a"]);
      const url = absolutizeUrl(anchor?.getAttribute("href") || "", source.url);
      const image = firstAttr(card, ["img"], "src") || firstAttr(card, ["img"], "data-src");
      const textContent = card.textContent?.replace(/\s+/g, " ").trim() || "";
      return {
        id: `${slugify(source.name)}-${slugify(title || url)}-${index}`,
        source: source.name,
        sourceUrl: url,
        title,
        imageUrl: absolutizeUrl(image, source.url),
        fetchedAt: nowIso(),
        rawText: textContent,
        tags: source.tags || []
      };
    }).filter(item => item.title && item.sourceUrl && item.sourceUrl !== source.url);
  }

  function status(sourceName, state, details = {}) {
    return { sourceName, state, fetchedAt: nowIso(), ...details };
  }

  return {
    DEFAULT_REFRESH_MS,
    nowIso,
    slugify,
    fetchText,
    parseRss,
    parseHtmlLinks,
    textFromHtml,
    status
  };
})();
