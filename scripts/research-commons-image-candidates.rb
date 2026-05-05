require "json"
require "net/http"
require "uri"

ROOT = File.expand_path("..", __dir__)
LIBRARY = File.join(ROOT, "vehicleLibrary.js")
USER_AGENT = "VeloceClassProject/1.0 (local image attribution research)"

QUERY_OVERRIDES = {
  "alfa-romeo-155-v6-ti" => ["Alfa Romeo 155 V6 TI", "Alfa Romeo 155 V6 Ti DTM"],
  "aston-martin-dbs" => ["Aston Martin DBS 2007", "Aston Martin DBS V12"],
  "aston-martin-vanquish" => ["Aston Martin Vanquish 2001", "Aston Martin Vanquish S 2004"],
  "audi-rs2-avant" => ["Audi RS2 Avant"],
  "audi-sport-quattro" => ["Audi Sport Quattro"],
  "bentley-continental-gt" => ["Bentley Continental GT 2003"],
  "bmw-m6-v10" => ["BMW M6 E63"],
  "bugatti-eb110" => ["Bugatti EB110"],
  "buick-gnx" => ["Buick GNX"],
  "dodge-viper-acr" => ["Dodge Viper ACR"],
  "dodge-viper-gts" => ["Dodge Viper GTS"],
  "ferrari-275-gtb" => ["Ferrari 275 GTB"],
  "ferrari-430-scuderia" => ["Ferrari 430 Scuderia"],
  "ferrari-458-speciale" => ["Ferrari 458 Speciale"],
  "ford-gt40" => ["Ford GT40"],
  "ford-rs200" => ["Ford RS200"],
  "jaguar-xkr-s" => ["Jaguar XKR-S"],
  "lancia-delta-integrale" => ["Lancia Delta Integrale"],
  "lexus-lc500" => ["Lexus LC500"],
  "mclaren-675lt" => ["McLaren 675LT"],
  "mercedes-190e-evo-ii" => ["Mercedes 190E Evo II", "Mercedes-Benz 190E 2.5-16 Evolution II"],
  "mercedes-amg-gt-black-series" => ["Mercedes-AMG GT Black Series"],
  "mercedes-benz-sl65-amg-black-series" => ["Mercedes-Benz SL65 AMG Black Series"],
  "mercedes-slr-mclaren" => ["Mercedes-Benz SLR McLaren"],
  "mitsubishi-lancer-evolution-ix" => ["Mitsubishi Lancer Evolution IX"],
  "mitsubishi-lancer-evolution-vi" => ["Mitsubishi Lancer Evolution VI"],
  "mitsubishi-pajero-evolution" => ["Mitsubishi Pajero Evolution"],
  "nissan-gt-r-nismo-400r" => ["Nismo 400R"],
  "peugeot-205-t16" => ["Peugeot 205 T16"],
  "porsche-959" => ["Porsche 959"],
  "porsche-964-turbo" => ["Porsche 964 Turbo"],
  "porsche-991-2-gt3-touring" => ["Porsche 991 GT3 Touring"],
  "porsche-993-gt2" => ["Porsche 993 GT2"],
  "porsche-993-turbo" => ["Porsche 993 Turbo"],
  "porsche-996-gt3" => ["Porsche 996 GT3"],
  "porsche-997-2-gt3-rs-4-0" => ["Porsche 997 GT3 RS 4.0"],
  "renault-5-turbo" => ["Renault 5 Turbo"],
  "shelby-cobra" => ["Shelby Cobra", "AC Cobra"],
  "subaru-impreza-22b" => ["Subaru Impreza 22B"],
  "toyota-2000gt" => ["Toyota 2000GT"]
}

BAD_TITLE = /(logo|badge|emblem|interior|engine|wheel|rim|diagram|drawing|rc |formula|f1 car|steering|toy|model|kit)/i

def fetch_json(url)
  uri = URI(url)
  request = Net::HTTP::Get.new(uri)
  request["User-Agent"] = USER_AGENT
  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") { |http| http.request(request) }
  return nil unless response.is_a?(Net::HTTPSuccess)
  JSON.parse(response.body)
rescue JSON::ParserError
  nil
end

def commons_candidates(query)
  search_url = "https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=8&srsearch=#{URI.encode_www_form_component(query)}&format=json"
  titles = Array(fetch_json(search_url)&.dig("query", "search")).map { |row| row["title"] }.compact
  return [] if titles.empty?

  encoded_titles = titles.map { |title| URI::DEFAULT_PARSER.escape(title.tr(" ", "_")) }.join("|")
  info_url = "https://commons.wikimedia.org/w/api.php?action=query&titles=#{encoded_titles}&prop=imageinfo&iiprop=url|mime&iiurlwidth=1000&format=json"
  pages = fetch_json(info_url)&.dig("query", "pages")
  Array(pages&.values)
    .sort_by { |page| titles.index(page["title"]) || 99 }
    .map do |page|
      info = page.dig("imageinfo", 0) || {}
      [page["title"], info["thumburl"] || info["url"], info["mime"]]
    end
end

source = File.read(LIBRARY, encoding: "UTF-8")
ids = source.scan(/^\s*\["([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*\d{4}/).map { |id, make, model| [id, "#{make} #{model}"] }
local = source[/localIntelligenceImageIds = new Set\(\[([\s\S]*?)\]\);/, 1].scan(/"([^"]+)"/).flatten
owned = File.exist?(File.join(ROOT, "image-data.js")) ? File.read(File.join(ROOT, "image-data.js"), encoding: "UTF-8").scan(/"([^"]+)": \{/).flatten : []
missing = ids.reject { |id, _| (local + owned).include?(id) }

missing.each do |id, name|
  queries = QUERY_OVERRIDES[id] || [name]
  puts "\n#{id} | #{name}"
  queries.each do |query|
    puts "  query: #{query}"
    candidates = (commons_candidates(query) + commons_candidates("#{query} car")).uniq { |title, _url, _mime| title }
    candidates.reject { |title, _, mime| title =~ BAD_TITLE || !mime.to_s.start_with?("image/") }.first(4).each_with_index do |(title, url, _mime), index|
      puts "    #{index + 1}. #{title} | #{url}"
    end
  end
  sleep 0.15
end
