require "fileutils"
require "json"
require "net/http"
require "uri"

ROOT = File.expand_path("..", __dir__)
LIBRARY = File.join(ROOT, "vehicleLibrary.js")
OUT_DIR = File.join(ROOT, "assets", "intelligence")

FileUtils.mkdir_p(OUT_DIR)

source = File.read(LIBRARY, encoding: "UTF-8")
vehicles = source.scan(/^\s*\["([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*\d{4}/).map do |id, make, model|
  [id, "#{make} #{model}".gsub(/\s+/, " ").strip]
end

TITLE_OVERRIDES = {
  "lamborghini-diablo" => "Lamborghini Diablo",
  "jaguar-xj220" => "Jaguar XJ220",
  "mercedes-slr-mclaren" => "Mercedes-Benz SLR McLaren",
  "bugatti-eb110" => "Bugatti EB 110",
  "pagani-zonda" => "Pagani Zonda",
  "ferrari-275-gtb" => "Ferrari 275",
  "porsche-356-speedster" => "Porsche 356",
  "shelby-cobra" => "AC Cobra",
  "toyota-2000gt" => "Toyota 2000GT",
  "ferrari-458-speciale" => "Ferrari 458",
  "ferrari-430-scuderia" => "Ferrari F430",
  "porsche-991-2-gt3-touring" => "Porsche 911 GT3",
  "porsche-992-gt3-rs" => "Porsche 911 GT3",
  "mclaren-675lt" => "McLaren 675LT",
  "lamborghini-huracan-sto" => "Lamborghini Huracan",
  "audi-r8-v10-manual" => "Audi R8",
  "ford-mustang-shelby-gt350r" => "Shelby Mustang",
  "mercedes-amg-gt-black-series" => "Mercedes-AMG GT",
  "chevrolet-corvette-c7-zr1" => "Chevrolet Corvette (C7)",
  "nissan-skyline-gt-r-r32" => "Nissan Skyline GT-R",
  "nissan-skyline-gt-r-r33" => "Nissan Skyline GT-R",
  "nissan-skyline-gt-r-r34" => "Nissan Skyline GT-R",
  "honda-nsx" => "Honda NSX",
  "mitsubishi-lancer-evolution-vi" => "Mitsubishi Lancer Evolution",
  "mitsubishi-lancer-evolution-ix" => "Mitsubishi Lancer Evolution",
  "subaru-impreza-22b" => "Subaru Impreza 22B STI",
  "toyota-celica-gt-four" => "Toyota Celica GT-Four",
  "nissan-300zx-twin-turbo" => "Nissan 300ZX",
  "porsche-959" => "Porsche 959",
  "bmw-e30-m3" => "BMW M3",
  "mercedes-190e-evo-ii" => "Mercedes-Benz 190 E",
  "lancia-delta-integrale" => "Lancia Delta",
  "ford-rs200" => "Ford RS200",
  "audi-sport-quattro" => "Audi Quattro",
  "peugeot-205-t16" => "Peugeot 205",
  "renault-5-turbo" => "Renault 5 Turbo",
  "mitsubishi-pajero-evolution" => "Mitsubishi Pajero Evolution",
  "nissan-gt-r-nismo-400r" => "Nismo 400R",
  "alfa-romeo-155-v6-ti" => "Alfa Romeo 155",
  "porsche-964-turbo" => "Porsche 911 (964)",
  "porsche-993-turbo" => "Porsche 911 (993)",
  "porsche-993-gt2" => "Porsche 911 GT2",
  "porsche-996-gt3" => "Porsche 911 GT3",
  "porsche-997-2-gt3-rs-4-0" => "Porsche 911 GT3",
  "bmw-m3-csl" => "BMW M3",
  "bmw-z8" => "BMW Z8",
  "mercedes-benz-sls-amg" => "Mercedes-Benz SLS AMG",
  "audi-rs2-avant" => "Audi RS 2 Avant",
  "ford-gt40" => "Ford GT40",
  "dodge-viper-gts" => "Dodge Viper",
  "dodge-viper-acr" => "Dodge Viper",
  "chevrolet-corvette-c6-zr1" => "Chevrolet Corvette (C6)",
  "chevrolet-corvette-c8-z06" => "Chevrolet Corvette (C8)",
  "shelby-gt500" => "Shelby Mustang",
  "plymouth-superbird" => "Plymouth Superbird",
  "buick-gnx" => "Buick Regal",
  "aston-martin-vanquish" => "Aston Martin Vanquish",
  "aston-martin-dbs" => "Aston Martin DBS",
  "ferrari-575m" => "Ferrari 575M Maranello",
  "bentley-continental-gt" => "Bentley Continental GT",
  "mercedes-benz-sl65-amg-black-series" => "Mercedes-Benz SL-Class (R230)",
  "jaguar-xkr-s" => "Jaguar XK (X150)",
  "bmw-m6-v10" => "BMW M6",
  "lexus-lc500" => "Lexus LC"
}

def fetch_json(url)
  uri = URI(url)
  request = Net::HTTP::Get.new(uri)
  request["User-Agent"] = "VeloceClassProject/1.0 (local image attribution research)"
  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") { |http| http.request(request) }
  return nil unless response.is_a?(Net::HTTPSuccess)
  JSON.parse(response.body)
rescue JSON::ParserError
  nil
end

def summary_for(title)
  query = URI.encode_www_form_component(title.tr(" ", "_"))
  page_data = fetch_json("https://en.wikipedia.org/w/api.php?action=query&titles=#{query}&prop=pageimages|info&piprop=thumbnail&pithumbsize=1400&inprop=url&format=json")
  page = page_data&.dig("query", "pages")&.values&.find { |item| item["thumbnail"] }
  if page
    return {
      "title" => page["title"],
      "thumbnail" => { "source" => page.dig("thumbnail", "source") },
      "content_urls" => { "desktop" => { "page" => page["fullurl"] } }
    }
  end

  encoded = URI.encode_www_form_component(title.tr(" ", "_"))
  data = fetch_json("https://en.wikipedia.org/api/rest_v1/page/summary/#{encoded}")
  return data if data && (data["originalimage"] || data["thumbnail"])

  search = URI.encode_www_form_component(title)
  results = fetch_json("https://en.wikipedia.org/w/api.php?action=opensearch&namespace=0&limit=3&format=json&search=#{search}")
  Array(results && results[1]).each do |candidate|
    data = fetch_json("https://en.wikipedia.org/api/rest_v1/page/summary/#{URI.encode_www_form_component(candidate.tr(" ", "_"))}")
    return data if data && (data["originalimage"] || data["thumbnail"])
  end
  nil
end

def download(url, path)
  ok = system(
    "curl",
    "-L",
    "-A",
    "VeloceClassProject/1.0 (local image attribution research)",
    "--fail",
    "--silent",
    "--show-error",
    "-o",
    path,
    url
  )
  ok && File.exist?(path) && File.size(path) > 10_000
end

downloaded = []
skipped = []

vehicles.each do |id, title|
  path = File.join(OUT_DIR, "#{id}.jpg")
  next if File.exist?(path) && File.size(path) > 10_000

  data = summary_for(TITLE_OVERRIDES[id] || title)
  image_url = data&.dig("originalimage", "source") || data&.dig("thumbnail", "source")
  if image_url && download(image_url, path)
    downloaded << [id, data["title"], data.dig("content_urls", "desktop", "page")]
  else
    FileUtils.rm_f(path)
    skipped << [id, title]
  end

  sleep 0.08
end

puts "Downloaded #{downloaded.length} images"
puts "Skipped #{skipped.length} vehicles"
downloaded.each { |row| puts "OK #{row.join(" | ")}" }
skipped.each { |row| puts "MISS #{row.join(" | ")}" }
