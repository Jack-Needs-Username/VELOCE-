require "fileutils"
require "uri"

ROOT = File.expand_path("..", __dir__)
OUT_DIR = File.join(ROOT, "assets", "intelligence")
USER_AGENT = "VeloceClassProject/1.0 (local image attribution research)"

SELECTED_FILES = {
  "alfa-romeo-155-v6-ti" => "1993 Alfa Romeo 155 V6 TI DTM ARM.jpg",
  "aston-martin-dbs" => "2008 Aston Martin DBS V12 (25783297402).jpg",
  "aston-martin-vanquish" => "2001 Aston Martin Vanquish 6.0 Front.jpg",
  "audi-rs2-avant" => "Audi RS2 Avant MYLE Festival 2025 DSC 9761.jpg",
  "audi-sport-quattro" => "Audi Sport Quattro Classic-Days 2022 IMG 7075.jpg",
  "bentley-continental-gt" => "Bentley Continental GT Mulliner 000 since 2003 2006 frontright 2010-02-21 A.jpg",
  "bmw-m6-v10" => "BMW M6 E63 - Flickr - Alexandre Prévot (12) (cropped).jpg",
  "bugatti-eb110" => "Bugatti EB110 (8195062320).jpg",
  "buick-gnx" => "Sloan Museum at Courtland Center December 2018 30 (1987 Buick GNX).jpg",
  "dodge-viper-acr" => "Dodge Viper ACR at NAS Fallon for Top Gear filming 1.jpg",
  "dodge-viper-gts" => "Red Dodge Viper GTS.jpg",
  "ferrari-275-gtb" => "1966 Ferrari 275 GTB sn 08549, front left (Greenwich 2019).jpg",
  "ferrari-430-scuderia" => "Ferrari 430 Scuderia (8606098237).jpg",
  "ferrari-458-speciale" => "2015 Ferrari 458 Speciale, front left.jpg",
  "ford-gt40" => "Ford GT40 (1966) Solitude Revival 2022 1X7A0005.jpg",
  "ford-rs200" => "1985 Ford RS200 (44807).jpg",
  "jaguar-xkr-s" => "Jaguar XKR-S, IAA 2011, Frankfurt am Main (DSC03149).jpg",
  "lancia-delta-integrale" => "Lancia Delta, Motortreff Bella Italia 2024, Munich (P1190463).jpg",
  "lexus-lc500" => "Lexus LC500 (Z100) Greater Toronto Area, Canada.jpg",
  "mclaren-675lt" => "675LT 06-29-2019 1.jpg",
  "mercedes-190e-evo-ii" => "Mercedes-Benz 190E Evolution II DTM top Mercedes-Benz Museum.jpg",
  "mercedes-amg-gt-black-series" => "Mercedes-AMG GT Black Series IMG 0324.jpg",
  "mercedes-benz-sl65-amg-black-series" => "The frontview of Mercedes-Benz SL65 AMG Black Series (R230).JPG",
  "mercedes-slr-mclaren" => "Mercedes SLR C199 2007 amk.jpg",
  "mitsubishi-lancer-evolution-ix" => "2005 Mitsubishi Lancer Evolution IX BS O24.jpg",
  "mitsubishi-lancer-evolution-vi" => "Mitsubishi Lancer Evolution VI IMG 0346.jpg",
  "mitsubishi-pajero-evolution" => "Mitsubishi Pajero Evolution Gen2 V55W 1997-1999 frontleft 2012-03-04 U.jpg",
  "peugeot-205-t16" => "1985 Peugeot 205 T16 Evo2.jpg",
  "porsche-959" => "Porsche 959 S 1X7A7874.jpg",
  "porsche-964-turbo" => "Porsche 911-964 turbo 1990-1993 frontright 2009-10-04 U.jpg",
  "porsche-991-2-gt3-touring" => "Porsche 911 GT3 Touring - Caramulo (50583133203).jpg",
  "porsche-993-gt2" => "Porsche 993 GT2 Clubsport Classic-Gala 2021 1X7A0069.jpg",
  "porsche-993-turbo" => "White Porsche 993 turbo coupé.jpg",
  "porsche-996-gt3" => "2003 Porsche 911 996 GT3.jpg",
  "porsche-997-2-gt3-rs-4-0" => "Porsche 911 GT3 RS 4.0 (10543917945).jpg",
  "renault-5-turbo" => "Renault 5 Turbo-RockvilleMDshow2007.jpg",
  "shelby-cobra" => "AC Cobra 427.jpg",
  "subaru-impreza-22b" => "1998 Subaru Impreza 22B STi (14249).jpg",
  "toyota-2000gt" => "1968 Toyota 2000GT (49561680437).jpg"
}

FileUtils.mkdir_p(OUT_DIR)

def download_file(filename, path)
  file_title = filename.start_with?("File:") ? filename : "File:#{filename}"
  encoded_title = URI::DEFAULT_PARSER.escape(file_title.tr(" ", "_"))
  url = "https://commons.wikimedia.org/wiki/Special:FilePath/#{encoded_title}?width=1400"
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
failed = []

SELECTED_FILES.each do |id, filename|
  path = File.join(OUT_DIR, "#{id}.jpg")
  if download_file(filename, path)
    downloaded << [id, filename]
  else
    FileUtils.rm_f(path)
    failed << [id, filename]
  end
end

puts "Downloaded #{downloaded.length} selected Commons images"
downloaded.each { |row| puts "OK #{row.join(" | ")}" }
failed.each { |row| puts "FAIL #{row.join(" | ")}" }
