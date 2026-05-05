window.VeloceSourceAdapters = {
  rssSource: {
    type: "rss",
    supports: ["fetch", "parse", "normalize", "cache"],
    limitation: "Browser CORS may require a proxy or backend relay on GitHub Pages."
  },
  genericArticleSource: {
    type: "html",
    supports: ["fetch", "extract links", "normalize"],
    limitation: "Only displays items with real source URLs and parsed titles."
  },
  bringATrailerSource: {
    name: "Bring a Trailer",
    type: "source-page",
    url: "https://bringatrailer.com/auctions/",
    enabled: false,
    limitation: "No official public API is configured; parsed source-page data may be unavailable if blocked."
  },
  hemmingsSource: {
    name: "Hemmings Auctions",
    type: "source-page",
    url: "https://www.hemmings.com/auctions",
    enabled: false,
    limitation: "Listing fields are shown only if present in fetched source text."
  },
  classicComSource: {
    name: "CLASSIC.COM",
    type: "source-page",
    url: "https://www.classic.com/markets/",
    enabled: false,
    limitation: "Market pages are source links unless listing data is fetchable."
  },
  hagertySource: {
    name: "Hagerty Media",
    type: "rss",
    feedUrl: "https://www.hagerty.com/media/feed/"
  },
  roadAndTrackSource: {
    name: "Road & Track",
    type: "rss",
    feedUrl: "",
    limitation: "Not enabled until a stable approved feed is confirmed."
  },
  carAndDriverSource: {
    name: "Car and Driver",
    type: "rss",
    feedUrl: "https://www.caranddriver.com/rss/news.xml"
  },
  motor1Source: {
    name: "Motor1",
    type: "rss",
    feedUrl: "https://www.motor1.com/rss/news/all/"
  }
};
