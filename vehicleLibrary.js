const vehicleImageData = window.veloceOwnedImages || {};
const approvedVehicleImageSources = window.veloceImageSources || {};

const baseVehicles = [
  ["mazda-mx-5-miata-na-nb", "Mazda", "MX-5 Miata NA/NB", 1989, 2005, "Japan", ["sports-car", "affordable-icon", "roadster"], ["lightweight", "manual", "rwd"]],
  ["honda-s2000", "Honda", "S2000", 1999, 2009, "Japan", ["sports-car", "modern-classic", "roadster"], ["high-revving", "manual", "rwd"]],
  ["bmw-m3-e46", "BMW", "M3 E46", 2000, 2006, "Germany", ["sports-car", "modern-classic"], ["manual", "inline-six", "driver-car"]],
  ["porsche-boxster-cayman-986-987", "Porsche", "Boxster/Cayman 986/987", 1996, 2012, "Germany", ["sports-car", "modern-classic"], ["mid-engine", "manual", "porsche"]],
  ["nissan-350z", "Nissan", "350Z", 2002, 2009, "Japan", ["sports-car", "affordable-icon"], ["rwd", "manual", "tuner"]],
  ["toyota-supra-mk4", "Toyota", "Supra Mk4", 1993, 2002, "Japan", ["jdm-icon", "modern-classic"], ["turbo", "manual", "2jz"]],
  ["acura-honda-nsx-na1-na2", "Acura/Honda", "NSX NA1/NA2", 1990, 2005, "Japan", ["analog-supercar", "jdm-icon"], ["mid-engine", "manual", "aluminum"]],
  ["mazda-rx-7-fd", "Mazda", "RX-7 FD", 1992, 2002, "Japan", ["jdm-icon", "sports-car"], ["rotary", "turbo", "lightweight"]],
  ["nissan-skyline-gt-r-r32-r34", "Nissan", "Skyline GT-R R32-R34", 1989, 2002, "Japan", ["jdm-icon", "homologation-special"], ["awd", "turbo", "rb26"]],
  ["mitsubishi-lancer-evolution-viii-ix", "Mitsubishi", "Lancer Evolution VIII/IX", 2003, 2007, "Japan", ["jdm-icon", "homologation-special"], ["awd", "turbo", "rally"]],
  ["porsche-911-air-cooled", "Porsche", "911 air-cooled", 1964, 1998, "Germany", ["blue-chip", "vintage-classic"], ["air-cooled", "manual", "porsche"]],
  ["porsche-911-997", "Porsche", "911 997", 2004, 2012, "Germany", ["modern-classic", "sports-car"], ["manual", "porsche", "911"]],
  ["porsche-cayman-gt4", "Porsche", "Cayman GT4", 2015, 2024, "Germany", ["modern-classic", "sports-car"], ["mid-engine", "manual", "gt"]],
  ["porsche-930-turbo", "Porsche", "930 Turbo", 1975, 1989, "Germany", ["blue-chip", "analog-supercar"], ["turbo", "air-cooled", "poster-car"]],
  ["chevrolet-corvette-c5-c6-z06", "Chevrolet", "Corvette C5/C6 Z06", 2001, 2013, "United States", ["sports-car", "american-performance"], ["v8", "manual", "track"]],
  ["cadillac-ct5-v-blackwing", "Cadillac", "CT5-V Blackwing", 2022, 2026, "United States", ["modern-classic", "american-performance"], ["manual", "supercharged", "sedan"]],
  ["ford-mustang-shelby-gt350", "Ford", "Mustang Shelby GT350", 2015, 2020, "United States", ["modern-classic", "american-performance"], ["manual", "flat-plane-crank", "v8"]],
  ["dodge-viper", "Dodge", "Viper", 1992, 2017, "United States", ["analog-supercar", "american-performance"], ["v10", "manual", "raw"]],
  ["bmw-m2-cs", "BMW", "M2 CS", 2020, 2020, "Germany", ["modern-classic", "sports-car"], ["manual", "limited-production", "m-car"]],
  ["mercedes-benz-500e-e500-w124", "Mercedes-Benz", "500E/E500 W124", 1990, 1995, "Germany", ["youngtimer", "gt-car"], ["v8", "sedan", "porsche-built"]],
  ["audi-r8-manual", "Audi", "R8 manual", 2006, 2015, "Germany", ["analog-supercar", "modern-classic"], ["mid-engine", "manual", "gated"]],
  ["lotus-elise-exige", "Lotus", "Elise/Exige", 1996, 2021, "United Kingdom", ["sports-car", "modern-classic"], ["lightweight", "manual", "driver-car"]],
  ["ferrari-f355", "Ferrari", "F355", 1994, 1999, "Italy", ["analog-supercar", "modern-classic"], ["manual", "v8", "ferrari"]],
  ["lamborghini-gallardo-manual", "Lamborghini", "Gallardo manual", 2003, 2013, "Italy", ["analog-supercar", "modern-classic"], ["manual", "v10", "gated"]],
  ["aston-martin-v8-vantage-manual", "Aston Martin", "V8 Vantage manual", 2005, 2017, "United Kingdom", ["gt-car", "modern-classic"], ["manual", "v8", "grand-tourer"]]
];

const marketVehicles = [
  ["ferrari-f40", "Ferrari", "F40", 1987, 1992, "Italy", ["analog-supercar", "modern-classic", "blue-chip"], ["turbo", "manual", "limited-production", "poster-car"], "assets/intelligence/ferrari-f40.jpg"],
  ["porsche-carrera-gt", "Porsche", "Carrera GT", 2003, 2006, "Germany", ["analog-supercar", "modern-classic", "blue-chip"], ["v10", "manual", "carbon-tub"], "assets/intelligence/porsche-carrera-gt.jpg"],
  ["mclaren-f1", "McLaren", "F1", 1992, 1998, "United Kingdom", ["analog-supercar", "blue-chip"], ["v12", "manual", "central-seat"], "assets/intelligence/mclaren-f1.jpg"],
  ["ferrari-250-gto", "Ferrari", "250 GTO", 1962, 1964, "Italy", ["vintage-racing", "blue-chip"], ["v12", "competition", "provenance"], "assets/intelligence/ferrari-250-gto.jpg"],
  ["lamborghini-miura", "Lamborghini", "Miura", 1966, 1973, "Italy", ["vintage-classic", "blue-chip"], ["v12", "mid-engine", "design-icon"], "assets/intelligence/lamborghini-miura.jpg"],
  ["mercedes-300sl", "Mercedes-Benz", "300SL", 1954, 1963, "Germany", ["vintage-classic", "blue-chip"], ["gullwing", "engineering", "provenance"], "assets/intelligence/mercedes-300sl.jpg"],
  ["porsche-997-gt3-rs", "Porsche", "911 997 GT3 RS", 2006, 2011, "Germany", ["modern-classic", "track-car"], ["manual", "gt3", "rs"], "assets/intelligence/porsche-997-gt3-rs.jpg"],
  ["ferrari-enzo", "Ferrari", "Enzo", 2002, 2004, "Italy", ["modern-supercar", "blue-chip"], ["v12", "carbon", "halo-car"], "assets/intelligence/ferrari-enzo.jpg"],
  ["lexus-lfa", "Lexus", "LFA", 2010, 2012, "Japan", ["modern-supercar", "jdm-icon"], ["v10", "limited-production", "halo-car"], "assets/intelligence/lexus-lfa.jpg"],
  ["ford-gt", "Ford", "GT", 2005, 2006, "United States", ["modern-classic", "american-performance"], ["v8", "manual", "le-mans"], "assets/intelligence/ford-gt.jpg"]
];

const expandedVehicles = [
  ["ferrari-f50", "Ferrari", "F50", 1995, 1997, "Italy", ["analog-supercar", "blue-chip"], ["v12", "manual", "limited-production"], "", "$1M+"],
  ["lamborghini-diablo", "Lamborghini", "Diablo", 1990, 2001, "Italy", ["analog-supercar", "blue-chip"], ["v12", "manual", "poster-car"], "", "$500k-$1M"],
  ["jaguar-xj220", "Jaguar", "XJ220", 1992, 1994, "United Kingdom", ["analog-supercar", "blue-chip"], ["turbo", "limited-production", "1990s"], "", "$500k-$1M"],
  ["mercedes-slr-mclaren", "Mercedes-Benz", "SLR McLaren", 2003, 2010, "Germany", ["analog-supercar", "grand-tourer"], ["v8", "supercharged", "carbon"], "", "$500k-$1M"],
  ["bugatti-eb110", "Bugatti", "EB110", 1991, 1995, "Italy", ["analog-supercar", "blue-chip"], ["quad-turbo", "awd", "limited-production"], "", "$1M+"],
  ["pagani-zonda", "Pagani", "Zonda", 1999, 2019, "Italy", ["analog-supercar", "blue-chip"], ["v12", "carbon", "manual"], "", "$1M+"],
  ["ferrari-275-gtb", "Ferrari", "275 GTB", 1964, 1968, "Italy", ["blue-chip", "vintage-classic"], ["v12", "coachbuilt", "front-engine"], "", "$1M+"],
  ["ferrari-daytona", "Ferrari", "Daytona", 1968, 1973, "Italy", ["blue-chip", "vintage-classic", "grand-tourer"], ["v12", "front-engine", "daytona"], "", "$500k-$1M"],
  ["porsche-356-speedster", "Porsche", "356 Speedster", 1954, 1958, "Germany", ["blue-chip", "vintage-classic"], ["air-cooled", "roadster", "porsche"], "", "$100k-$500k"],
  ["jaguar-e-type", "Jaguar", "E-Type", 1961, 1975, "United Kingdom", ["blue-chip", "vintage-classic", "grand-tourer"], ["inline-six", "v12", "design-icon"], "", "$100k-$500k"],
  ["aston-martin-db5", "Aston Martin", "DB5", 1963, 1965, "United Kingdom", ["blue-chip", "vintage-classic", "grand-tourer"], ["six-cylinder", "bond", "coachbuilt"], "", "$500k-$1M"],
  ["shelby-cobra", "Shelby", "Cobra", 1962, 1967, "United States", ["blue-chip", "american-collector"], ["v8", "roadster", "competition"], "", "$1M+"],
  ["bmw-507", "BMW", "507", 1956, 1959, "Germany", ["blue-chip", "vintage-classic", "porsche-german"], ["v8", "roadster", "design-icon"], "", "$1M+"],
  ["toyota-2000gt", "Toyota", "2000GT", 1967, 1970, "Japan", ["blue-chip", "jdm-icon", "vintage-classic"], ["inline-six", "limited-production", "japanese"], "", "$1M+"],
  ["maserati-ghibli", "Maserati", "Ghibli", 1967, 1973, "Italy", ["blue-chip", "vintage-classic", "grand-tourer"], ["v8", "italian", "giugiaro"], "", "$100k-$500k"],
  ["ferrari-458-speciale", "Ferrari", "458 Speciale", 2013, 2015, "Italy", ["modern-collectible", "modern-supercar"], ["v8", "naturally-aspirated", "track"], "", "$500k-$1M"],
  ["ferrari-430-scuderia", "Ferrari", "430 Scuderia", 2007, 2009, "Italy", ["modern-collectible", "modern-supercar"], ["v8", "track", "single-clutch"], "", "$100k-$500k"],
  ["porsche-991-2-gt3-touring", "Porsche", "911 991.2 GT3 Touring", 2017, 2019, "Germany", ["modern-collectible", "porsche-german"], ["manual", "gt3", "touring"], "", "$100k-$500k"],
  ["porsche-992-gt3-rs", "Porsche", "911 992 GT3 RS", 2022, 2026, "Germany", ["modern-collectible", "porsche-german"], ["gt3", "rs", "aero"], "", "$100k-$500k"],
  ["mclaren-675lt", "McLaren", "675LT", 2015, 2017, "United Kingdom", ["modern-collectible", "modern-supercar"], ["turbo", "longtail", "carbon"], "", "$100k-$500k"],
  ["lamborghini-huracan-sto", "Lamborghini", "Huracan STO", 2020, 2024, "Italy", ["modern-collectible", "modern-supercar"], ["v10", "track", "aero"], "", "$100k-$500k"],
  ["audi-r8-v10-manual", "Audi", "R8 V10 manual", 2009, 2015, "Germany", ["modern-collectible", "analog-supercar", "porsche-german"], ["v10", "manual", "gated"], "", "$100k-$500k"],
  ["ford-mustang-shelby-gt350r", "Ford", "Mustang Shelby GT350R", 2015, 2020, "United States", ["modern-collectible", "american-collector"], ["manual", "flat-plane-crank", "track"], "", "Under $100k"],
  ["mercedes-amg-gt-black-series", "Mercedes-AMG", "GT Black Series", 2020, 2022, "Germany", ["modern-collectible", "porsche-german"], ["v8", "black-series", "track"], "", "$100k-$500k"],
  ["chevrolet-corvette-c7-zr1", "Chevrolet", "Corvette C7 ZR1", 2019, 2019, "United States", ["modern-collectible", "american-collector"], ["v8", "supercharged", "track"], "", "$100k-$500k"],
  ["nissan-skyline-gt-r-r32", "Nissan", "Skyline GT-R R32", 1989, 1994, "Japan", ["jdm-icon", "homologation"], ["rb26", "awd", "group-a"], "", "$100k-$500k"],
  ["nissan-skyline-gt-r-r33", "Nissan", "Skyline GT-R R33", 1995, 1998, "Japan", ["jdm-icon", "homologation"], ["rb26", "awd", "1990s"], "", "Under $100k"],
  ["nissan-skyline-gt-r-r34", "Nissan", "Skyline GT-R R34", 1999, 2002, "Japan", ["jdm-icon", "modern-collectible"], ["rb26", "awd", "collector"], "", "$100k-$500k"],
  ["honda-nsx", "Honda", "NSX", 1990, 2005, "Japan", ["jdm-icon", "analog-supercar"], ["mid-engine", "manual", "aluminum"], "", "$100k-$500k"],
  ["mitsubishi-lancer-evolution-vi", "Mitsubishi", "Lancer Evolution VI", 1999, 2001, "Japan", ["jdm-icon", "homologation"], ["awd", "turbo", "rally"], "", "Under $100k"],
  ["mitsubishi-lancer-evolution-ix", "Mitsubishi", "Lancer Evolution IX", 2005, 2007, "Japan", ["jdm-icon", "homologation"], ["awd", "turbo", "rally"], "", "Under $100k"],
  ["subaru-impreza-22b", "Subaru", "Impreza 22B", 1998, 1998, "Japan", ["jdm-icon", "homologation"], ["awd", "turbo", "rally"], "", "$100k-$500k"],
  ["toyota-celica-gt-four", "Toyota", "Celica GT-Four", 1986, 1999, "Japan", ["jdm-icon", "homologation"], ["awd", "turbo", "rally"], "", "Under $100k"],
  ["nissan-300zx-twin-turbo", "Nissan", "300ZX Twin Turbo", 1989, 2000, "Japan", ["jdm-icon", "sports-car"], ["turbo", "manual", "z-car"], "", "Under $100k"],
  ["ferrari-288-gto", "Ferrari", "288 GTO", 1984, 1987, "Italy", ["homologation", "analog-supercar", "blue-chip"], ["turbo", "group-b", "limited-production"], "", "$1M+"],
  ["porsche-959", "Porsche", "959", 1986, 1993, "Germany", ["homologation", "analog-supercar", "porsche-german"], ["awd", "turbo", "technology"], "", "$1M+"],
  ["bmw-e30-m3", "BMW", "E30 M3", 1986, 1991, "Germany", ["homologation", "porsche-german"], ["dtm", "four-cylinder", "manual"], "", "$100k-$500k"],
  ["mercedes-190e-evo-ii", "Mercedes-Benz", "190E Evo II", 1990, 1990, "Germany", ["homologation", "porsche-german"], ["dtm", "manual", "widebody"], "", "$100k-$500k"],
  ["lancia-delta-integrale", "Lancia", "Delta Integrale", 1987, 1994, "Italy", ["homologation", "rally"], ["awd", "turbo", "wrc"], "", "Under $100k"],
  ["ford-rs200", "Ford", "RS200", 1984, 1986, "United Kingdom", ["homologation", "rally", "blue-chip"], ["group-b", "awd", "turbo"], "", "$500k-$1M"],
  ["audi-sport-quattro", "Audi", "Sport Quattro", 1984, 1985, "Germany", ["homologation", "porsche-german", "blue-chip"], ["group-b", "awd", "turbo"], "", "$500k-$1M"],
  ["peugeot-205-t16", "Peugeot", "205 T16", 1984, 1986, "France", ["homologation", "rally"], ["group-b", "awd", "turbo"], "", "$500k-$1M"],
  ["renault-5-turbo", "Renault", "5 Turbo", 1980, 1986, "France", ["homologation", "rally"], ["mid-engine", "turbo", "widebody"], "", "$100k-$500k"],
  ["mitsubishi-pajero-evolution", "Mitsubishi", "Pajero Evolution", 1997, 1999, "Japan", ["homologation", "jdm-icon"], ["dakar", "4x4", "limited-production"], "", "Under $100k"],
  ["nissan-gt-r-nismo-400r", "Nissan", "GT-R Nismo 400R", 1996, 1998, "Japan", ["homologation", "jdm-icon"], ["rb-x", "limited-production", "nismo"], "", "$1M+"],
  ["alfa-romeo-155-v6-ti", "Alfa Romeo", "155 V6 TI", 1993, 1996, "Italy", ["homologation", "motorsport"], ["dtm", "v6", "race-car"], "", "$500k-$1M"],
  ["porsche-964-turbo", "Porsche", "911 964 Turbo", 1990, 1994, "Germany", ["porsche-german", "blue-chip"], ["air-cooled", "turbo", "911"], "", "$100k-$500k"],
  ["porsche-993-turbo", "Porsche", "911 993 Turbo", 1995, 1998, "Germany", ["porsche-german", "blue-chip"], ["air-cooled", "turbo", "awd"], "", "$100k-$500k"],
  ["porsche-993-gt2", "Porsche", "911 993 GT2", 1995, 1998, "Germany", ["porsche-german", "blue-chip", "homologation"], ["air-cooled", "gt2", "turbo"], "", "$1M+"],
  ["porsche-996-gt3", "Porsche", "911 996 GT3", 1999, 2005, "Germany", ["porsche-german", "modern-collectible"], ["gt3", "manual", "mezger"], "", "$100k-$500k"],
  ["porsche-997-2-gt3-rs-4-0", "Porsche", "911 997.2 GT3 RS 4.0", 2011, 2011, "Germany", ["porsche-german", "modern-collectible", "blue-chip"], ["gt3", "rs", "manual"], "", "$500k-$1M"],
  ["bmw-m3-csl", "BMW", "M3 CSL", 2003, 2004, "Germany", ["porsche-german", "modern-collectible"], ["e46", "lightweight", "m-car"], "", "$100k-$500k"],
  ["bmw-z8", "BMW", "Z8", 2000, 2003, "Germany", ["porsche-german", "modern-collectible", "grand-tourer"], ["v8", "roadster", "design"], "", "$100k-$500k"],
  ["mercedes-benz-sls-amg", "Mercedes-Benz", "SLS AMG", 2010, 2015, "Germany", ["porsche-german", "modern-collectible", "grand-tourer"], ["v8", "gullwing", "amg"], "", "$100k-$500k"],
  ["audi-rs2-avant", "Audi", "RS2 Avant", 1994, 1995, "Germany", ["porsche-german", "modern-collectible"], ["wagon", "awd", "porsche-built"], "", "Under $100k"],
  ["ford-gt40", "Ford", "GT40", 1964, 1969, "United States", ["american-collector", "blue-chip", "motorsport"], ["le-mans", "v8", "race-car"], "", "$1M+"],
  ["ford-gt-2017", "Ford", "GT", 2017, 2022, "United States", ["american-collector", "modern-collectible"], ["ecoboost", "carbon", "le-mans"], "", "$500k-$1M"],
  ["dodge-viper-gts", "Dodge", "Viper GTS", 1996, 2002, "United States", ["american-collector", "analog-supercar"], ["v10", "manual", "coupe"], "", "$100k-$500k"],
  ["dodge-viper-acr", "Dodge", "Viper ACR", 2008, 2017, "United States", ["american-collector", "modern-collectible"], ["v10", "manual", "track"], "", "$100k-$500k"],
  ["chevrolet-corvette-c6-zr1", "Chevrolet", "Corvette C6 ZR1", 2009, 2013, "United States", ["american-collector", "modern-collectible"], ["v8", "supercharged", "manual"], "", "$100k-$500k"],
  ["chevrolet-corvette-c8-z06", "Chevrolet", "Corvette C8 Z06", 2023, 2026, "United States", ["american-collector", "modern-collectible"], ["v8", "flat-plane-crank", "mid-engine"], "", "$100k-$500k"],
  ["shelby-gt500", "Ford", "Shelby GT500", 1967, 1970, "United States", ["american-collector", "blue-chip"], ["v8", "mustang", "shelby"], "", "$100k-$500k"],
  ["plymouth-superbird", "Plymouth", "Superbird", 1970, 1970, "United States", ["american-collector", "blue-chip", "homologation"], ["aero", "nascar", "wing-car"], "", "$100k-$500k"],
  ["buick-gnx", "Buick", "GNX", 1987, 1987, "United States", ["american-collector", "modern-collectible"], ["turbo", "muscle", "limited-production"], "", "$100k-$500k"],
  ["aston-martin-vanquish", "Aston Martin", "Vanquish", 2001, 2007, "United Kingdom", ["grand-tourer", "modern-collectible"], ["v12", "bond", "gt"], "", "$100k-$500k"],
  ["aston-martin-dbs", "Aston Martin", "DBS", 2007, 2012, "United Kingdom", ["grand-tourer", "modern-collectible"], ["v12", "manual", "gt"], "", "$100k-$500k"],
  ["ferrari-550-maranello", "Ferrari", "550 Maranello", 1996, 2001, "Italy", ["grand-tourer", "modern-collectible"], ["v12", "manual", "front-engine"], "", "$100k-$500k"],
  ["ferrari-575m", "Ferrari", "575M", 2002, 2006, "Italy", ["grand-tourer", "modern-collectible"], ["v12", "manual", "f1"], "", "$100k-$500k"],
  ["bentley-continental-gt", "Bentley", "Continental GT", 2003, 2011, "United Kingdom", ["grand-tourer"], ["w12", "luxury", "awd"], "", "Under $100k"],
  ["maserati-granturismo", "Maserati", "GranTurismo", 2007, 2019, "Italy", ["grand-tourer"], ["v8", "pininfarina", "italian"], "", "Under $100k"],
  ["mercedes-benz-sl65-amg-black-series", "Mercedes-Benz", "SL65 AMG Black Series", 2008, 2011, "Germany", ["grand-tourer", "modern-collectible", "porsche-german"], ["v12", "black-series", "amg"], "", "$100k-$500k"],
  ["jaguar-xkr-s", "Jaguar", "XKR-S", 2011, 2015, "United Kingdom", ["grand-tourer", "modern-collectible"], ["v8", "supercharged", "gt"], "", "Under $100k"],
  ["bmw-m6-v10", "BMW", "M6 V10", 2005, 2010, "Germany", ["grand-tourer", "porsche-german"], ["v10", "manual", "gt"], "", "Under $100k"],
  ["lexus-lc500", "Lexus", "LC500", 2017, 2026, "Japan", ["grand-tourer", "modern-collectible"], ["v8", "luxury", "japanese"], "", "Under $100k"]
];

const sourcedImageMeta = {
  "ferrari-f40": ["Ferrari F40 vehicle photo.", "Image: sourced Veloce vehicle asset.", "", ""],
  "porsche-carrera-gt": ["Porsche Carrera GT exterior vehicle photo.", "Image: Calreyn88 via Wikimedia Commons.", "https://commons.wikimedia.org/wiki/File:2005_Porsche_Carrera_GT_(90343).jpg", "CC BY-SA 4.0"],
  "mclaren-f1": ["McLaren F1 road car photo.", "Image: Wikipedia/Wikimedia Commons.", "https://en.wikipedia.org/wiki/McLaren_F1", ""],
  "ferrari-250-gto": ["Ferrari 250 GTO vehicle photo.", "Image: SG2012 via Wikimedia Commons.", "https://commons.wikimedia.org/wiki/File:Ferrari_250_GTO.jpg", "CC BY 2.0"],
  "lamborghini-miura": ["Lamborghini Miura vehicle photo.", "Image: Calreyn88 via Wikimedia Commons.", "https://commons.wikimedia.org/wiki/File:1968_Lamborghini_Miura.jpg", "CC BY-SA 4.0"],
  "mercedes-300sl": ["Mercedes-Benz 300SL vehicle photo.", "Image: MrWalkr via Wikimedia Commons.", "https://commons.wikimedia.org/wiki/File:1956_Mercedes-Benz_300SL.jpg", "CC BY-SA"],
  "porsche-997-gt3-rs": ["Porsche 911 997 GT3 RS vehicle photo.", "Image: Calreyn88 via Wikimedia Commons.", "https://commons.wikimedia.org/wiki/File:Porsche_911_997_GT3_RS.jpg", "CC BY-SA 4.0"],
  "ferrari-enzo": ["Ferrari Enzo vehicle photo.", "Image: Calreyn88 via Wikimedia Commons.", "https://commons.wikimedia.org/wiki/File:Ferrari_Enzo.jpg", "CC BY-SA 4.0"],
  "lexus-lfa": ["Lexus LFA vehicle photo.", "Image: Calreyn88 via Wikimedia Commons.", "https://commons.wikimedia.org/wiki/File:Lexus_LFA_(62499).jpg", "CC BY-SA 4.0"],
  "ford-gt": ["2005 Ford GT vehicle photo.", "Image: Rian Castillo via Wikimedia Commons.", "https://commons.wikimedia.org/wiki/File:2005_Ford_GT_(3970866700).jpg", "CC BY 2.0"],
  "audi-r8-v10-manual": ["Audi R8 vehicle photo.", "Image: Wikipedia/Wikimedia page image.", "https://en.wikipedia.org/wiki/Audi_R8", ""],
  "bmw-z8": ["BMW Z8 vehicle photo.", "Image: Wikipedia/Wikimedia page image.", "https://en.wikipedia.org/wiki/BMW_Z8", ""],
  "chevrolet-corvette-c7-zr1": ["Chevrolet Corvette C7 ZR1 vehicle photo.", "Image: Wikipedia/Wikimedia page image.", "https://en.wikipedia.org/wiki/Chevrolet_Corvette_(C7)", ""],
  "ferrari-575m": ["Ferrari 575M Maranello vehicle photo.", "Image: Wikipedia/Wikimedia page image.", "https://en.wikipedia.org/wiki/Ferrari_575M_Maranello", ""],
  "honda-nsx": ["Honda/Acura NSX vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:AcuraNSX-05-cropped.jpg", ""],
  "mercedes-benz-sls-amg": ["Mercedes-Benz SLS AMG vehicle photo.", "Image: Wikipedia/Wikimedia page image.", "https://en.wikipedia.org/wiki/Mercedes-Benz_SLS_AMG", ""],
  "pagani-zonda": ["Pagani Zonda vehicle photo.", "Image: Wikipedia/Wikimedia page image.", "https://en.wikipedia.org/wiki/Pagani_Zonda", ""],
  "porsche-992-gt3-rs": ["Porsche 911 992 GT3 RS vehicle photo.", "Image: Wikipedia/Wikimedia page image.", "https://en.wikipedia.org/wiki/Porsche_911_GT3", ""],
  "toyota-celica-gt-four": ["Toyota Celica GT-Four vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:CelicaST185GT4APuenteHills.jpg", ""],
  "alfa-romeo-155-v6-ti": ["Alfa Romeo 155 V6 TI race car photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:1993_Alfa_Romeo_155_V6_TI_DTM_ARM.jpg", ""],
  "aston-martin-dbs": ["Aston Martin DBS vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:2008_Aston_Martin_DBS_V12_(25783297402).jpg", ""],
  "aston-martin-vanquish": ["Aston Martin Vanquish vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:2001_Aston_Martin_Vanquish_6.0_Front.jpg", ""],
  "audi-rs2-avant": ["Audi RS2 Avant vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Audi_RS2_Avant_MYLE_Festival_2025_DSC_9761.jpg", ""],
  "audi-sport-quattro": ["Audi Sport Quattro vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Audi_Sport_Quattro_Classic-Days_2022_IMG_7075.jpg", ""],
  "bentley-continental-gt": ["Bentley Continental GT vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Bentley_Continental_GT_Mulliner_000_since_2003_2006_frontright_2010-02-21_A.jpg", ""],
  "bmw-m6-v10": ["BMW M6 V10 vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:BMW_M6_E63_-_Flickr_-_Alexandre_Pr%C3%A9vot_(12)_(cropped).jpg", ""],
  "bugatti-eb110": ["Bugatti EB110 vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Bugatti_EB110_(8195062320).jpg", ""],
  "buick-gnx": ["Buick GNX vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Sloan_Museum_at_Courtland_Center_December_2018_30_(1987_Buick_GNX).jpg", ""],
  "dodge-viper-acr": ["Dodge Viper ACR vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Dodge_Viper_ACR_at_NAS_Fallon_for_Top_Gear_filming_1.jpg", ""],
  "dodge-viper-gts": ["Dodge Viper GTS vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Red_Dodge_Viper_GTS.jpg", ""],
  "ferrari-275-gtb": ["Ferrari 275 GTB vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:1966_Ferrari_275_GTB_sn_08549,_front_left_(Greenwich_2019).jpg", ""],
  "ferrari-430-scuderia": ["Ferrari 430 Scuderia vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Ferrari_430_Scuderia_(8606098237).jpg", ""],
  "ferrari-458-speciale": ["Ferrari 458 Speciale vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:2015_Ferrari_458_Speciale,_front_left.jpg", ""],
  "ford-gt40": ["Ford GT40 vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Ford_GT40_(1966)_Solitude_Revival_2022_1X7A0005.jpg", ""],
  "ford-rs200": ["Ford RS200 vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:1985_Ford_RS200_(44807).jpg", ""],
  "jaguar-xkr-s": ["Jaguar XKR-S vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Jaguar_XKR-S,_IAA_2011,_Frankfurt_am_Main_(DSC03149).jpg", ""],
  "lancia-delta-integrale": ["Lancia Delta Integrale vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Lancia_Delta,_Motortreff_Bella_Italia_2024,_Munich_(P1190463).jpg", ""],
  "lexus-lc500": ["Lexus LC500 vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Lexus_LC500_(Z100)_Greater_Toronto_Area,_Canada.jpg", ""],
  "mclaren-675lt": ["McLaren 675LT vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:675LT_06-29-2019_1.jpg", ""],
  "mercedes-190e-evo-ii": ["Mercedes-Benz 190E Evo II vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_190E_Evolution_II_DTM_top_Mercedes-Benz_Museum.jpg", ""],
  "mercedes-amg-gt-black-series": ["Mercedes-AMG GT Black Series vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Mercedes-AMG_GT_Black_Series_IMG_0324.jpg", ""],
  "mercedes-benz-sl65-amg-black-series": ["Mercedes-Benz SL65 AMG Black Series vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:The_frontview_of_Mercedes-Benz_SL65_AMG_Black_Series_(R230).JPG", ""],
  "mercedes-slr-mclaren": ["Mercedes-Benz SLR McLaren vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Mercedes_SLR_C199_2007_amk.jpg", ""],
  "mitsubishi-lancer-evolution-ix": ["Mitsubishi Lancer Evolution IX vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:2005_Mitsubishi_Lancer_Evolution_IX_BS_O24.jpg", ""],
  "mitsubishi-lancer-evolution-vi": ["Mitsubishi Lancer Evolution VI vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Mitsubishi_Lancer_Evolution_VI_IMG_0346.jpg", ""],
  "mitsubishi-pajero-evolution": ["Mitsubishi Pajero Evolution vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Mitsubishi_Pajero_Evolution_Gen2_V55W_1997-1999_frontleft_2012-03-04_U.jpg", ""],
  "peugeot-205-t16": ["Peugeot 205 T16 vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:1985_Peugeot_205_T16_Evo2.jpg", ""],
  "porsche-959": ["Porsche 959 vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Porsche_959_S_1X7A7874.jpg", ""],
  "porsche-964-turbo": ["Porsche 911 964 Turbo vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Porsche_911-964_turbo_1990-1993_frontright_2009-10-04_U.jpg", ""],
  "porsche-991-2-gt3-touring": ["Porsche 911 991.2 GT3 Touring vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Porsche_911_GT3_Touring_-_Caramulo_(50583133203).jpg", ""],
  "porsche-993-gt2": ["Porsche 911 993 GT2 vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Porsche_993_GT2_Clubsport_Classic-Gala_2021_1X7A0069.jpg", ""],
  "porsche-993-turbo": ["Porsche 911 993 Turbo vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:White_Porsche_993_turbo_coup%C3%A9.jpg", ""],
  "porsche-996-gt3": ["Porsche 911 996 GT3 vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:2003_Porsche_911_996_GT3.jpg", ""],
  "porsche-997-2-gt3-rs-4-0": ["Porsche 911 997.2 GT3 RS 4.0 vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Porsche_911_GT3_RS_4.0_(10543917945).jpg", ""],
  "renault-5-turbo": ["Renault 5 Turbo vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:Renault_5_Turbo-RockvilleMDshow2007.jpg", ""],
  "shelby-cobra": ["Shelby Cobra vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:AC_Cobra_427.jpg", ""],
  "subaru-impreza-22b": ["Subaru Impreza 22B vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:1998_Subaru_Impreza_22B_STi_(14249).jpg", ""],
  "toyota-2000gt": ["Toyota 2000GT vehicle photo.", "Image: Wikimedia Commons vehicle image.", "https://commons.wikimedia.org/wiki/File:1968_Toyota_2000GT_(49561680437).jpg", ""]
};

const localIntelligenceImageIds = new Set([
  "alfa-romeo-155-v6-ti",
  "aston-martin-db5",
  "aston-martin-dbs",
  "aston-martin-vanquish",
  "audi-r8-v10-manual",
  "audi-rs2-avant",
  "audi-sport-quattro",
  "bentley-continental-gt",
  "bmw-507",
  "bmw-e30-m3",
  "bmw-m6-v10",
  "bmw-m2-cs",
  "bmw-m3-csl",
  "bmw-m3-e46",
  "bmw-z8",
  "bugatti-eb110",
  "buick-gnx",
  "cadillac-ct5-v-blackwing",
  "chevrolet-corvette-c5-c6-z06",
  "chevrolet-corvette-c6-zr1",
  "chevrolet-corvette-c7-zr1",
  "chevrolet-corvette-c8-z06",
  "dodge-viper",
  "dodge-viper-acr",
  "dodge-viper-gts",
  "ferrari-250-gto",
  "ferrari-275-gtb",
  "ferrari-288-gto",
  "ferrari-430-scuderia",
  "ferrari-458-speciale",
  "ferrari-550-maranello",
  "ferrari-575m",
  "ferrari-daytona",
  "ferrari-enzo",
  "ferrari-f355",
  "ferrari-f40",
  "ferrari-f50",
  "ford-gt",
  "ford-gt40",
  "ford-gt-2017",
  "ford-mustang-shelby-gt350",
  "ford-mustang-shelby-gt350r",
  "ford-rs200",
  "honda-nsx",
  "honda-s2000",
  "jaguar-e-type",
  "jaguar-xkr-s",
  "jaguar-xj220",
  "lancia-delta-integrale",
  "lamborghini-diablo",
  "lamborghini-huracan-sto",
  "lamborghini-miura",
  "lexus-lc500",
  "lexus-lfa",
  "lotus-elise-exige",
  "maserati-ghibli",
  "maserati-granturismo",
  "mazda-mx-5-miata-na-nb",
  "mazda-rx-7-fd",
  "mclaren-675lt",
  "mclaren-f1",
  "mercedes-300sl",
  "mercedes-190e-evo-ii",
  "mercedes-amg-gt-black-series",
  "mercedes-benz-sl65-amg-black-series",
  "mercedes-benz-sls-amg",
  "mercedes-slr-mclaren",
  "mitsubishi-lancer-evolution-ix",
  "mitsubishi-lancer-evolution-viii-ix",
  "mitsubishi-lancer-evolution-vi",
  "mitsubishi-pajero-evolution",
  "nissan-300zx-twin-turbo",
  "nissan-350z",
  "nissan-skyline-gt-r-r32",
  "nissan-skyline-gt-r-r33",
  "nissan-skyline-gt-r-r34",
  "pagani-zonda",
  "peugeot-205-t16",
  "plymouth-superbird",
  "porsche-356-speedster",
  "porsche-911-997",
  "porsche-930-turbo",
  "porsche-959",
  "porsche-964-turbo",
  "porsche-991-2-gt3-touring",
  "porsche-992-gt3-rs",
  "porsche-993-gt2",
  "porsche-993-turbo",
  "porsche-996-gt3",
  "porsche-997-2-gt3-rs-4-0",
  "porsche-997-gt3-rs",
  "porsche-boxster-cayman-986-987",
  "porsche-carrera-gt",
  "porsche-cayman-gt4",
  "renault-5-turbo",
  "shelby-cobra",
  "shelby-gt500",
  "subaru-impreza-22b",
  "toyota-2000gt",
  "toyota-celica-gt-four",
  "toyota-supra-mk4"
]);

function eraFromYears(start, end) {
  const years = [start, end].filter(Boolean);
  if (!years.length) return "Era unknown";
  const min = Math.min(...years);
  const max = Math.max(...years);
  if (max < 1970) return "1950s-60s";
  if (max < 1990) return "1970s-80s";
  if (max < 2010) return "1990s-2000s";
  return "2010s-today";
}

function marketTierFromCategories(categories, tags = []) {
  if (tags.includes("under-100k")) return "Under $100k";
  if (tags.includes("100k-500k")) return "$100k-$500k";
  if (tags.includes("500k-1m")) return "$500k-$1M";
  if (tags.includes("1m-plus")) return "$1M+";
  if (categories.includes("affordable-icon") || categories.includes("youngtimer")) return "Under $100k";
  if (categories.includes("blue-chip")) return "$1M+";
  if (categories.includes("analog-supercar")) return "$500k-$1M";
  if (categories.includes("modern-classic") || categories.includes("modern-collectible")) return "$100k-$500k";
  return "Market varies";
}

function marketDataForVehicle(displayName) {
  const query = encodeURIComponent(displayName);
  return {
    classicComMarketUrl: `https://www.classic.com/search/?q=${query}`,
    classicComEmbedUrl: "",
    hagertyValuationUrl: "https://www.hagerty.com/valuation-tools",
    otherMarketUrls: [
      {
        label: "Bring a Trailer results search",
        url: `https://bringatrailer.com/search/?s=${query}`
      },
      {
        label: "Hemmings marketplace search",
        url: `https://www.hemmings.com/classifieds/?q=${query}`
      }
    ],
    dataStatus: "source-link-only"
  };
}

function makeVehicle([id, make, model, yearStart, yearEnd, country, categories, tags, hero, marketTier]) {
  const image = vehicleImageData[id];
  const approvedImage = approvedVehicleImageSources[id];
  const downloadedImage = localIntelligenceImageIds.has(id) ? `assets/intelligence/${id}.jpg` : "";
  const heroImage = approvedImage?.src || hero || image?.src || downloadedImage;
  const displayName = `${make} ${model}`;
  const meta = sourcedImageMeta[id];
  return {
    id,
    make,
    model,
    displayName,
    yearStart,
    yearEnd,
    yearRange: yearStart === yearEnd ? String(yearStart) : `${yearStart}-${yearEnd}`,
    era: eraFromYears(yearStart, yearEnd),
    country,
    categories,
    tags,
    aliases: [
      model,
      displayName,
      `${yearStart} ${displayName}`,
      `${yearEnd} ${displayName}`,
      make
    ],
    marketTier: marketTier || marketTierFromCategories(categories, tags),
    shortDescription: `${displayName} is a curated model-level collector profile in the Veloce library.`,
    imageSet: {
      hero: heroImage,
      thumbnail: heroImage,
      gallery: []
    },
    imageMeta: approvedImage || image || (meta ? {
      alt: meta[0],
      credit: meta[1],
      sourceUrl: meta[2],
      license: meta[3]
    } : (downloadedImage ? {
      alt: `${displayName} vehicle photo.`,
      credit: "Image: Wikipedia/Wikimedia page image.",
      sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(displayName.replace(/\s+/g, "_"))}`,
      license: ""
    } : (hero ? { alt: `${displayName} vehicle photo.` } : {}))),
    marketData: marketDataForVehicle(displayName),
    relatedVehicleIds: []
  };
}

const vehicleLibrary = [...baseVehicles, ...marketVehicles, ...expandedVehicles]
  .reduce((vehicles, entry) => {
    if (!vehicles.some(vehicle => vehicle[0] === entry[0])) vehicles.push(entry);
    return vehicles;
  }, [])
  .map(makeVehicle);

vehicleLibrary.forEach(vehicle => {
  vehicle.relatedVehicleIds = vehicleLibrary
    .filter(candidate => candidate.id !== vehicle.id)
    .map(candidate => ({
      id: candidate.id,
      score:
        (candidate.make === vehicle.make ? 5 : 0) +
        candidate.categories.filter(category => vehicle.categories.includes(category)).length * 3 +
        candidate.tags.filter(tag => vehicle.tags.includes(tag)).length
    }))
    .filter(candidate => candidate.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(candidate => candidate.id);
});

function vehicleWarn(message, payload) {
  if (console?.warn) console.warn(`[Veloce vehicle library] ${message}`, payload || "");
}

function getVehicle(vehicleId) {
  const vehicle = vehicleLibrary.find(item => item.id === vehicleId);
  if (!vehicle) vehicleWarn(`Unknown vehicleId: ${vehicleId}`);
  return vehicle || null;
}

function categoryFallbackLabel(vehicle) {
  if (!vehicle) return "Collector Vehicle";
  if (vehicle.categories.includes("analog-supercar")) return "Analog Supercar";
  if (vehicle.categories.includes("blue-chip")) return "Blue-Chip Classic";
  if (vehicle.categories.includes("jdm-icon")) return "JDM Icon";
  if (vehicle.categories.includes("homologation")) return "Homologation";
  if (vehicle.categories.includes("american-collector") || vehicle.categories.includes("american-performance")) return "American Collector";
  if (vehicle.categories.includes("grand-tourer")) return "Grand Tourer";
  if (vehicle.categories.includes("modern-collectible") || vehicle.categories.includes("modern-classic")) return "Modern Collectible";
  return "Collector Vehicle";
}

function vehiclePlaceholder(vehicleId, label = "Collector vehicle") {
  const vehicle = getVehicle(vehicleId);
  const safeLabel = String(label).replace(/[<>&]/g, "");
  const safeName = String(vehicle?.displayName || vehicleId || "Collector vehicle").replace(/[<>&]/g, "");
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720">
  <rect width="1200" height="720" fill="#101113"/>
  <rect x="42" y="42" width="1116" height="636" fill="none" stroke="#2b2d2f" stroke-width="2"/>
  <path d="M170 198h860" stroke="#c7a96d" stroke-width="2" opacity=".34"/>
  <path d="M120 535h960" stroke="#c7a96d" stroke-width="2" opacity=".55"/>
  <path d="M260 456h680l-92-118H385z" fill="none" stroke="#c9ced0" stroke-width="8" opacity=".65"/>
  <circle cx="405" cy="478" r="52" fill="none" stroke="#c9ced0" stroke-width="8" opacity=".65"/>
  <circle cx="795" cy="478" r="52" fill="none" stroke="#c9ced0" stroke-width="8" opacity=".65"/>
  <text x="600" y="260" text-anchor="middle" font-family="Georgia, serif" font-size="58" fill="#f4f1ea">${safeLabel}</text>
  <text x="600" y="316" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#aaa39a">${safeName}</text>
</svg>`);
}

function resolveVehicleImage(vehicleOrId, imageType = "thumbnail") {
  const vehicle = typeof vehicleOrId === "string" ? getVehicle(vehicleOrId) : vehicleOrId;
  if (!vehicle) return vehiclePlaceholder(vehicleOrId, "Collector vehicle");
  if (!vehicle.imageSet) {
    vehicleWarn(`Vehicle has no imageSet: ${vehicle.id}`);
    return vehiclePlaceholder(vehicle.id, categoryFallbackLabel(vehicle));
  }
  const image = vehicle.imageSet[imageType] || vehicle.imageSet.thumbnail || vehicle.imageSet.hero;
  if (!image) {
    vehicleWarn(`Vehicle has no ${imageType} image: ${vehicle.id}`);
    return vehiclePlaceholder(vehicle.id, categoryFallbackLabel(vehicle));
  }
  return image;
}

function assertVehicleLinked(item, context) {
  if (!item.vehicleId) vehicleWarn(`${context} item is missing vehicleId`, item);
  if (item.image) vehicleWarn(`${context} item contains loose image; use vehicleId image resolution`, item);
  return getVehicle(item.vehicleId);
}

document.addEventListener("error", event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.dataset.vehicleId) return;
  vehicleWarn(`Image path failed for vehicleId: ${image.dataset.vehicleId}`, image.currentSrc || image.src);
  image.src = vehiclePlaceholder(image.dataset.vehicleId, categoryFallbackLabel(getVehicle(image.dataset.vehicleId)));
}, true);

window.veloceVehicleLibrary = vehicleLibrary;
window.getVehicle = getVehicle;
window.resolveVehicleImage = resolveVehicleImage;
window.assertVehicleLinked = assertVehicleLinked;
