require "fileutils"
require "json"
require "net/http"
require "uri"

ROOT = File.expand_path("..", __dir__)
LIBRARY = File.join(ROOT, "vehicleLibrary.js")
OUT_DIR = File.join(ROOT, "assets", "intelligence")
BAD_TITLE = /(logo|badge|emblem|interior|engine|wheel|rim|diagram|drawing|rc |formula|f1 car|race car steering)/i

FileUtils.mkdir_p(OUT_DIR)

SEARCH_OVERRIDES = {
  "lamborghini-diablo" => "Lamborghini Diablo car",
  "jaguar-xj220" => "Jaguar XJ220 car",
  "mercedes-slr-mclaren" => "Mercedes-Benz SLR McLaren car",
  "bugatti-eb110" => "Bugatti EB110 car",
  "pagani-zonda" => "Pagani Zonda car",
  "ferrari-275-gtb" => "Ferrari 275 GTB car",
  "shelby-cobra" => "Shelby Cobra car",
  "toyota-2000gt" => "Toyota 2000GT car",
  "ferrari-458-speciale" => "Ferrari 458 Speciale car",
  "ferrari-430-scuderia" => "Ferrari 430 Scuderia car",
  "porsche-991-2-gt3-touring" => "Porsche 991 GT3 Touring car",
  "porsche-992-gt3-rs" => "Porsche 992 GT3 RS car",
  "mclaren-675lt" => "McLaren 675LT car",
  "mercedes-amg-gt-black-series" => "Mercedes-AMG GT Black Series car",
  "chevrolet-corvette-c7-zr1" => "Chevrolet Corvette C7 ZR1 car",
  "honda-nsx" => "Honda NSX car",
  "mitsubishi-lancer-evolution-vi" => "Mitsubishi Lancer Evolution VI car",
  "mitsubishi-lancer-evolution-ix" => "Mitsubishi Lancer Evolution IX car",
  "subaru-impreza-22b" => "Subaru Impreza 22B car",
  "toyota-celica-gt-four" => "Toyota Celica GT-Four car",
  "porsche-959" => "Porsche 959 car",
  "mercedes-190e-evo-ii" => "Mercedes 190E Evo II car",
  "lancia-delta-integrale" => "Lancia Delta Integrale car",
  "ford-rs200" => "Ford RS200 car",
  "audi-sport-quattro" => "Audi Sport Quattro car",
  "peugeot-205-t16" => "Peugeot 205 T16 car",
  "renault-5-turbo" => "Renault 5 Turbo car",
  "mitsubishi-pajero-evolution" => "Mitsubishi Pajero Evolution car",
  "nissan-gt-r-nismo-400r" => "Nismo 400R car",
  "alfa-romeo-155-v6-ti" => "Alfa Romeo 155 V6 TI car",
  "porsche-964-turbo" => "Porsche 964 Turbo car",
  "porsche-993-turbo" => "Porsche 993 Turbo car",
  "porsche-993-gt2" => "Porsche 993 GT2 car",
  "porsche-996-gt3" => "Porsche 996 GT3 car",
  "porsche-997-2-gt3-rs-4-0" => "Porsche 997 GT3 RS 4.0 car",
  "bmw-z8" => "BMW Z8 car",
  "mercedes-benz-sls-amg" => "Mercedes-Benz SLS AMG car",
  "audi-rs2-avant" => "Audi RS2 Avant car",
  "ford-gt40" => "Ford GT40 car",
  "dodge-viper-gts" => "Dodge Viper GTS car",
  "dodge-viper-acr" => "Dodge Viper ACR car",
  "buick-gnx" => "Buick GNX car",
  "aston-martin-vanquish" => "Aston Martin Vanquish car",
  "aston-martin-dbs" => "Aston Martin DBS car",
  "ferrari-575m" => "Ferrari 575M Maranello car",
  "bentley-continental-gt" => "Bentley Continental GT car",
  "mercedes-benz-sl65-amg-black-series" => "Mercedes-Benz SL65 AMG Black Series car",
  "jaguar-xkr-s" => "Jaguar XKR-S car",
  "bmw-m6-v10" => "BMW M6 V10 car",
  "lexus-lc500" => "Lexus LC500 car"
}

source = File.read(LIBRARY, encoding: "UTF-8")
vehicles = source.scan(/^\s*\["([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*\d{4}/).map do |id, make, model|
  [id, SEARCH_OVERRIDES[id] || "#{make} #{model} car"]
end

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

def commons_candidates(query)
  url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch=#{URI.encode_www_form_component(query)}&prop=imageinfo&iiprop=url|mime&iiurlwidth=1400&format=json"
  pages = fetch_json(url)&.dig("query", "pages")
  Array(pages&.values)
    .sort_by { |page| page["index"] || 99 }
    .map do |page|
      info = page.dig("imageinfo", 0) || {}
      [page["title"], info["thumburl"] || info["url"], info["mime"]]
    end
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

vehicles.each do |id, query|
  path = File.join(OUT_DIR, "#{id}.jpg")
  next if File.exist?(path) && File.size(path) > 10_000

  candidate = commons_candidates(query).find do |title, url, mime|
    title && url && mime.to_s.start_with?("image/") && title !~ BAD_TITLE
  end

  if candidate && download(candidate[1], path)
    downloaded << [id, candidate[0]]
  else
    FileUtils.rm_f(path)
    skipped << [id, query]
  end
  sleep 0.2
end

puts "Downloaded #{downloaded.length} Commons images"
puts "Skipped #{skipped.length} vehicles"
downloaded.each { |row| puts "OK #{row.join(" | ")}" }
skipped.each { |row| puts "MISS #{row.join(" | ")}" }
