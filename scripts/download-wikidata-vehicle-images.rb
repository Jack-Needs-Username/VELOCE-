require "fileutils"
require "json"
require "net/http"
require "uri"

ROOT = File.expand_path("..", __dir__)
LIBRARY = File.join(ROOT, "vehicleLibrary.js")
OUT_DIR = File.join(ROOT, "assets", "intelligence")
USER_AGENT = "VeloceClassProject/1.0 (local image attribution research)"

SEARCH_OVERRIDES = {
  "mercedes-slr-mclaren" => ["Mercedes-Benz SLR McLaren", "Mercedes-Benz SLR"],
  "bugatti-eb110" => ["Bugatti EB 110", "Bugatti EB110"],
  "ferrari-275-gtb" => ["Ferrari 275", "Ferrari 275 GTB"],
  "shelby-cobra" => ["AC Cobra", "Shelby Cobra"],
  "ferrari-458-speciale" => ["Ferrari 458", "Ferrari 458 Speciale"],
  "ferrari-430-scuderia" => ["Ferrari F430", "Ferrari 430 Scuderia"],
  "porsche-991-2-gt3-touring" => ["Porsche 911 GT3", "Porsche 991 GT3 Touring"],
  "porsche-992-gt3-rs" => ["Porsche 911 GT3", "Porsche 992 GT3 RS"],
  "audi-r8-v10-manual" => ["Audi R8"],
  "mercedes-amg-gt-black-series" => ["Mercedes-AMG GT", "Mercedes-AMG GT Black Series"],
  "chevrolet-corvette-c7-zr1" => ["Chevrolet Corvette (C7)", "Chevrolet Corvette C7 ZR1"],
  "mitsubishi-lancer-evolution-vi" => ["Mitsubishi Lancer Evolution", "Mitsubishi Lancer Evolution VI"],
  "mitsubishi-lancer-evolution-ix" => ["Mitsubishi Lancer Evolution", "Mitsubishi Lancer Evolution IX"],
  "mercedes-190e-evo-ii" => ["Mercedes-Benz 190 E", "Mercedes-Benz 190E Evo II"],
  "lancia-delta-integrale" => ["Lancia Delta", "Lancia Delta Integrale"],
  "audi-sport-quattro" => ["Audi Quattro", "Audi Sport Quattro"],
  "peugeot-205-t16" => ["Peugeot 205", "Peugeot 205 T16"],
  "alfa-romeo-155-v6-ti" => ["Alfa Romeo 155", "Alfa Romeo 155 V6 TI"],
  "porsche-964-turbo" => ["Porsche 911 (964)", "Porsche 964 Turbo"],
  "porsche-993-turbo" => ["Porsche 911 (993)", "Porsche 993 Turbo"],
  "porsche-993-gt2" => ["Porsche 911 GT2", "Porsche 993 GT2"],
  "porsche-996-gt3" => ["Porsche 911 GT3", "Porsche 996 GT3"],
  "porsche-997-2-gt3-rs-4-0" => ["Porsche 911 GT3", "Porsche 997 GT3 RS 4.0"],
  "chevrolet-corvette-c6-zr1" => ["Chevrolet Corvette (C6)", "Chevrolet Corvette C6 ZR1"],
  "chevrolet-corvette-c8-z06" => ["Chevrolet Corvette (C8)", "Chevrolet Corvette C8 Z06"],
  "shelby-gt500" => ["Shelby Mustang", "Shelby GT500"],
  "buick-gnx" => ["Buick Regal", "Buick GNX"],
  "ferrari-575m" => ["Ferrari 575M Maranello", "Ferrari 575M"],
  "mercedes-benz-sl65-amg-black-series" => ["Mercedes-Benz SL-Class (R230)", "Mercedes-Benz SL65 AMG Black Series"],
  "jaguar-xkr-s" => ["Jaguar XK (X150)", "Jaguar XKR-S"],
  "bmw-m6-v10" => ["BMW M6"],
  "lexus-lc500" => ["Lexus LC", "Lexus LC500"]
}

FileUtils.mkdir_p(OUT_DIR)

source = File.read(LIBRARY, encoding: "UTF-8")
vehicles = source.scan(/^\s*\["([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*\d{4}/).map do |id, make, model|
  [id, SEARCH_OVERRIDES[id] || ["#{make} #{model}"]]
end

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

def wikidata_ids(term)
  url = "https://www.wikidata.org/w/api.php?action=wbsearchentities&language=en&format=json&limit=5&search=#{URI.encode_www_form_component(term)}"
  Array(fetch_json(url)&.dig("search")).map { |row| row["id"] }.compact
end

def image_filename_for(entity_id)
  url = "https://www.wikidata.org/wiki/Special:EntityData/#{entity_id}.json"
  claims = fetch_json(url)&.dig("entities", entity_id, "claims", "P18")
  Array(claims).map { |claim| claim.dig("mainsnak", "datavalue", "value") }.compact.first
end

def download_file(filename, path)
  url = "https://commons.wikimedia.org/wiki/Special:FilePath/#{URI.encode_www_form_component(filename)}?width=1400"
  ok = system(
    "curl",
    "-L",
    "-A",
    USER_AGENT,
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

vehicles.each do |id, terms|
  path = File.join(OUT_DIR, "#{id}.jpg")
  next if File.exist?(path) && File.size(path) > 10_000

  filename = nil
  entity_id = nil
  Array(terms).each do |term|
    wikidata_ids(term).each do |candidate_id|
      candidate_file = image_filename_for(candidate_id)
      next unless candidate_file
      filename = candidate_file
      entity_id = candidate_id
      break
    end
    break if filename
  end

  if filename && download_file(filename, path)
    downloaded << [id, entity_id, filename]
  else
    FileUtils.rm_f(path)
    skipped << [id, Array(terms).join(" / ")]
  end
  sleep 0.18
end

puts "Downloaded #{downloaded.length} Wikidata images"
puts "Skipped #{skipped.length} vehicles"
downloaded.each { |row| puts "OK #{row.join(" | ")}" }
skipped.each { |row| puts "MISS #{row.join(" | ")}" }
