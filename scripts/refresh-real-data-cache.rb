require "fileutils"
require "json"
require "net/http"
require "rss"
require "time"
require "uri"

ROOT = File.expand_path("..", __dir__)
DATA_DIR = File.join(ROOT, "data")
FileUtils.mkdir_p(DATA_DIR)

USER_AGENT = "VeloceClassProject/1.0 (real source cache refresh)"

DIGEST_SOURCES = [
  {
    name: "Motor1",
    feed_url: "https://www.motor1.com/rss/news/all/",
    tags: ["News"]
  },
  {
    name: "Motor1 All Articles",
    feed_url: "https://www.motor1.com/rss/articles/all/",
    tags: ["News", "Long Reads"]
  },
  {
    name: "Car and Driver",
    feed_url: "https://www.caranddriver.com/rss/news.xml",
    tags: ["News"]
  },
  {
    name: "Hagerty Media",
    feed_url: "https://www.hagerty.com/media/feed/",
    tags: ["Market Analysis", "Long Reads"]
  }
]

def slugify(value)
  value.to_s.downcase.gsub(%r{https?://}, "").gsub(/[^a-z0-9]+/, "-").gsub(/^-|-$/, "")[0, 96]
end

def fetch_text(url)
  uri = URI(url)
  request = Net::HTTP::Get.new(uri)
  request["User-Agent"] = USER_AGENT
  Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https", read_timeout: 12, open_timeout: 8) do |http|
    response = http.request(request)
    raise "#{response.code} #{response.message}" unless response.is_a?(Net::HTTPSuccess)
    response.body
  end
end

def strip_html(value)
  value.to_s.gsub(/<script.*?<\/script>/m, " ")
    .gsub(/<style.*?<\/style>/m, " ")
    .gsub(/<[^>]+>/, " ")
    .gsub(/\s+/, " ")
    .strip
end

def item_image(item)
  enclosure = item.respond_to?(:enclosure) ? item.enclosure : nil
  return enclosure.url if enclosure&.url
  media = item.respond_to?(:media_content) ? item.media_content : nil
  return media.url if media&.respond_to?(:url) && media.url
  ""
end

def parse_feed(source, text, fetched_at)
  feed = RSS::Parser.parse(text, false)
  items = Array(feed.items).first(25)
  items.map do |item|
    description = item.respond_to?(:description) ? item.description.to_s : ""
    content = item.respond_to?(:content_encoded) ? item.content_encoded.to_s : ""
    url = item.respond_to?(:link) ? item.link.to_s : ""
    next unless item.title.to_s.strip.length.positive? && url.start_with?("http")
    excerpt = strip_html(description.empty? ? content : description)[0, 360]
    published = item.respond_to?(:pubDate) && item.pubDate ? item.pubDate.iso8601 : ""
    {
      id: "#{slugify(source[:name])}-#{slugify(url)}",
      source: source[:name],
      sourceUrl: url,
      headline: item.title.to_s.strip,
      author: item.respond_to?(:dc_creator) ? item.dc_creator.to_s : "",
      publishedAt: published,
      fetchedAt: fetched_at,
      imageUrl: item_image(item),
      excerpt: excerpt,
      fullTextAvailable: !content.empty?,
      relatedVehicleIds: [],
      detectedMakes: [],
      detectedModels: [],
      tags: source[:tags],
      rawText: strip_html("#{item.title} #{excerpt} #{source[:tags].join(" ")}")
    }
  end.compact
end

fetched_at = Time.now.utc.iso8601
statuses = []
items = []

DIGEST_SOURCES.each do |source|
  begin
    text = fetch_text(source[:feed_url])
    parsed = parse_feed(source, text, fetched_at)
    items.concat(parsed)
    statuses << {
      sourceName: source[:name],
      state: "ok",
      count: parsed.length,
      fetchedAt: fetched_at,
      url: source[:feed_url]
    }
  rescue StandardError => error
    statuses << {
      sourceName: source[:name],
      state: "error",
      count: 0,
      fetchedAt: fetched_at,
      url: source[:feed_url],
      error: error.message
    }
  end
end

deduped = items.uniq { |item| item[:sourceUrl] || item["sourceUrl"] }
File.write(
  File.join(DATA_DIR, "digest-cache.json"),
  JSON.pretty_generate({
    generatedAt: fetched_at,
    sourceType: "rss-cache",
    items: deduped,
    statuses: statuses
  })
)

File.write(
  File.join(DATA_DIR, "auction-cache.json"),
  JSON.pretty_generate({
    generatedAt: fetched_at,
    sourceType: "not-connected",
    items: [],
    statuses: [
      {
        sourceName: "Bring a Trailer",
        state: "disabled",
        count: 0,
        fetchedAt: fetched_at,
        error: "Official listing feed/API not configured for this static prototype."
      },
      {
        sourceName: "Hemmings Auctions",
        state: "disabled",
        count: 0,
        fetchedAt: fetched_at,
        error: "Official listing feed/API not configured for this static prototype."
      },
      {
        sourceName: "CLASSIC.COM",
        state: "disabled",
        count: 0,
        fetchedAt: fetched_at,
        error: "Official market/listing feed/API not configured for this static prototype."
      }
    ]
  })
)

puts "Wrote data/digest-cache.json with #{deduped.length} real article items"
puts "Wrote data/auction-cache.json with no fabricated listings"
