const ownedImages = Object.fromEntries(
  (window.veloceVehicleLibrary || []).map(vehicle => [
    vehicle.id,
    {
      src: window.resolveVehicleImage?.(vehicle, "thumbnail") || "",
      alt: vehicle.imageMeta?.alt || `${vehicle.displayName} vehicle photo.`,
      credit: vehicle.imageMeta?.credit || "Canonical Veloce vehicle image.",
      sourceUrl: vehicle.imageMeta?.sourceUrl || "",
      license: vehicle.imageMeta?.license || ""
    }
  ])
);

const digestItems = [];

const marketSources = [
  {
    name: "CLASSIC.COM",
    url: "https://www.classic.com/markets/",
    text: "Model markets, public listings, auction calendars, and benchmark values where available."
  },
  {
    name: "Hemmings",
    url: "https://www.hemmings.com/classifieds/cars-for-sale/",
    text: "Collector classifieds and auctions across classic, modern collectible, and specialty cars."
  },
  {
    name: "Bring a Trailer",
    url: "https://bringatrailer.com/auctions/",
    text: "Auction results and comment threads that help reveal buyer sentiment and condition sensitivity."
  },
  {
    name: "ClassicCars.com",
    url: "https://classiccars.com/listings",
    text: "Dealer and private listings useful for cross-checking asking prices and availability."
  }
];

const lanes = [
  {
    title: "Analog driver",
    text: "Manual gearboxes, hydraulic steering, naturally aspirated engines, and cars that reward attention over lap-time chasing."
  },
  {
    title: "Modern collectible",
    text: "Recent special cars with enthusiast credibility, limited supply, and a strong story around the end of an era."
  },
  {
    title: "Market watcher",
    text: "Cars where auction chatter, condition, mileage, originality, and provenance can change the buying conversation quickly."
  },
  {
    title: "Affordable icon",
    text: "Approachable cars with big communities, strong parts support, and enough personality to become a real hobby."
  },
  {
    title: "Blue-chip classic",
    text: "Historically important models where preservation, documentation, and authenticity sit close to the heart of ownership."
  },
  {
    title: "Event car",
    text: "Machines that make a cars-and-coffee arrival, rally weekend, or special occasion feel like the point of ownership."
  }
];

const learningModules = {
  analog: {
    title: "Driving feel: the vocabulary",
    lesson: "Start with weight, steering, engine response, shifter feel, visibility, and tire size. These explain why two cars with similar power can feel completely different.",
    next: "Compare the Miata, S2000, E46 M3, Elise, and Cayman to understand front-engine, lightweight, and mid-engine approaches."
  },
  market: {
    title: "Collector markets: why examples differ",
    lesson: "A model is not a single price. Transmission, mileage, originality, color, service records, production numbers, and public sale history shape the conversation.",
    next: "Open one saved car, then compare its Classic.com, BaT, and Hemmings links before trusting any single asking price."
  },
  risk: {
    title: "Ownership risk: buy-in is only the first number",
    lesson: "A cheaper exotic can be more expensive to own than a pricier sports car with parts support. Specialist access, service intervals, known issues, and storage all matter.",
    next: "Compare ownership notes for RX-7, F355, Gallardo, Viper, and 500E to see how complexity changes the plan."
  }
};

const cars = [
  car("Mazda", "MX-5 Miata NA/NB", "1989-2005", "Affordable icon", "Japan", "1980s-2000s", "$", "Roadster", "Analog driver", "Front-engine, rear-wheel-drive lightweight roadsters with huge parts support and one of the friendliest enthusiast communities.", "Mazda MX-5", "Mazda_MX-5", ["Classic.com Miata market", "https://www.classic.com/m/mazda/mx-5-miata/"], ["Wikipedia MX-5", "https://en.wikipedia.org/wiki/Mazda_MX-5"], "Use case: weekend backroads, autocross, first collector car."),
  car("Honda", "S2000", "1999-2009", "Affordable icon", "Japan", "1990s-2000s", "$$", "Roadster", "High-rev purist", "A naturally aspirated, rear-drive Honda roadster best known for its high-revving F20C/F22C engines and precise shift feel.", "Honda S2000", "Honda_S2000", ["Classic.com S2000 market", "https://www.classic.com/m/honda/s2000/"], ["Wikipedia S2000", "https://en.wikipedia.org/wiki/Honda_S2000"], "Use case: analog weekend car with rising collector attention."),
  car("BMW", "M3 E46", "2000-2006", "Affordable icon", "Germany", "2000s", "$$", "Coupe/Convertible", "Balanced driver", "The E46 M3 paired a high-revving S54 inline-six with a compact chassis and remains a benchmark modern-classic M car.", "BMW M3", "BMW_M3", ["Classic.com E46 M3 market", "https://www.classic.com/m/bmw/3-series/e46/m3/"], ["Wikipedia BMW M3", "https://en.wikipedia.org/wiki/BMW_M3"], "Ownership note: condition, subframe history, and maintenance records matter."),
  car("Porsche", "Boxster/Cayman 986/987", "1996-2012", "Affordable icon", "Germany", "1990s-2010s", "$$", "Roadster/Coupe", "Mid-engine learner", "Early Boxster and Cayman models offer mid-engine balance, strong Porsche community support, and relatively approachable entry points.", "Porsche Boxster and Cayman", "Porsche_Boxster/Cayman", ["Classic.com Boxster market", "https://www.classic.com/m/porsche/boxster/"], ["Wikipedia Boxster/Cayman", "https://en.wikipedia.org/wiki/Porsche_Boxster/Cayman"], "Use case: Porsche ownership with more driving value than status theater."),
  car("Nissan", "350Z", "2002-2009", "Affordable icon", "Japan", "2000s", "$", "Coupe/Roadster", "Tuner-friendly driver", "The Z33 revived Nissan's Z-car line with a VQ V6, rear-wheel drive, and broad aftermarket support.", "Nissan 350Z", "Nissan_350Z", ["Classic.com 350Z market", "https://www.classic.com/m/nissan/z-car/350z/"], ["Wikipedia 350Z", "https://en.wikipedia.org/wiki/Nissan_350Z"], "Ownership note: seek clean, unmodified examples if collectibility matters."),
  car("Toyota", "Supra Mk4", "1993-2002", "JDM hero", "Japan", "1990s", "$$$", "Coupe", "JDM collector", "The A80 Supra became a global icon thanks to the 2JZ engine family, tuning culture, and limited clean-car supply.", "Toyota Supra", "Toyota_Supra", ["Classic.com A80 Supra market", "https://www.classic.com/m/toyota/supra/4th-gen/"], ["Wikipedia Supra", "https://en.wikipedia.org/wiki/Toyota_Supra"], "Ownership note: originality, transmission, and modification quality drive the conversation."),
  car("Acura/Honda", "NSX NA1/NA2", "1990-2005", "JDM hero", "Japan", "1990s-2000s", "$$$", "Coupe/Targa", "Analog exotic", "Honda's aluminum mid-engine NSX brought everyday usability and motorsport-influenced engineering to the exotic-car class.", "Honda NSX", "Honda_NSX", ["Classic.com NSX market", "https://www.classic.com/m/acura/nsx/"], ["Wikipedia NSX", "https://en.wikipedia.org/wiki/Honda_NSX"], "Use case: exotic ownership for drivers who value precision and reliability mythology."),
  car("Mazda", "RX-7 FD", "1992-2002", "JDM hero", "Japan", "1990s", "$$$", "Coupe", "Specialist enthusiast", "The FD RX-7 is a light, beautiful rotary-powered sports car that rewards knowledgeable maintenance and sympathetic ownership.", "Mazda RX-7", "Mazda_RX-7", ["Classic.com FD RX-7 market", "https://www.classic.com/m/mazda/rx-7/fd/"], ["Wikipedia RX-7", "https://en.wikipedia.org/wiki/Mazda_RX-7"], "Ownership note: rotary health and specialist support are central to the ownership plan."),
  car("Nissan", "Skyline GT-R R32-R34", "1989-2002", "JDM hero", "Japan", "1980s-2000s", "$$$", "Coupe", "JDM collector", "RB26-powered Skyline GT-R generations became all-wheel-drive performance legends through touring-car success and tuning culture.", "Nissan Skyline GT-R", "Nissan_Skyline_GT-R", ["Classic.com Skyline GT-R market", "https://www.classic.com/m/nissan/skyline/gt-r/"], ["Wikipedia Skyline GT-R", "https://en.wikipedia.org/wiki/Nissan_Skyline_GT-R"], "Ownership note: import history, rust, and modifications need careful verification."),
  car("Mitsubishi", "Lancer Evolution VIII/IX", "2003-2007", "JDM hero", "Japan", "2000s", "$$", "Sedan", "Rally fan", "The US-market Evo VIII and IX brought turbocharged, all-wheel-drive rally character into a compact sedan package.", "Mitsubishi Lancer Evolution", "Mitsubishi_Lancer_Evolution", ["Classic.com Lancer Evolution market", "https://www.classic.com/m/mitsubishi/lancer/evolution/"], ["Wikipedia Lancer Evolution", "https://en.wikipedia.org/wiki/Mitsubishi_Lancer_Evolution"], "Use case: fast-road and backroad car with real maintenance expectations."),
  car("Porsche", "911 air-cooled", "1964-1998", "Porsche/core collector", "Germany", "1960s-1990s", "$$$", "Coupe/Targa/Cabriolet", "Blue-chip classic", "Air-cooled 911s define a massive collector universe, from early long-hood cars to the final 993 generation.", "Porsche 911", "Porsche_911", ["Classic.com 911 market", "https://www.classic.com/m/porsche/911/"], ["Wikipedia 911", "https://en.wikipedia.org/wiki/Porsche_911"], "Ownership note: generation, originality, rust, and documentation matter enormously."),
  car("Porsche", "911 997", "2004-2012", "Porsche/core collector", "Germany", "2000s-2010s", "$$$", "Coupe/Cabriolet", "Modern classic driver", "The 997 restored classic 911 proportions while offering a wide range from Carrera to GT and Turbo variants.", "Porsche 997", "Porsche_997", ["Classic.com 997 market", "https://www.classic.com/m/porsche/911/997/"], ["Wikipedia 997", "https://en.wikipedia.org/wiki/Porsche_997"], "Use case: modern usability with traditional 911 feel."),
  car("Porsche", "Cayman GT4", "2015-present", "Porsche/core collector", "Germany", "2010s-2020s", "$$$", "Coupe", "Track-minded purist", "The Cayman GT4 turned Porsche's mid-engine coupe into a focused GT product with manual appeal and track credibility.", "Porsche Cayman", "Porsche_Boxster/Cayman", ["Classic.com Cayman GT4 market", "https://www.classic.com/m/porsche/cayman/gt4/"], ["Wikipedia Cayman", "https://en.wikipedia.org/wiki/Porsche_Boxster/Cayman"], "Ownership note: a strong choice for the driver who actually wants to use the car hard."),
  car("Porsche", "930 Turbo", "1975-1989", "Porsche/core collector", "Germany", "1970s-1980s", "$$$", "Coupe/Cabriolet", "Event car", "The original 911 Turbo mixed widebody visual drama, turbocharged lag, and genuine poster-car status.", "Porsche 930", "Porsche_930", ["Classic.com 930 market", "https://www.classic.com/m/porsche/911/g-body/turbo/"], ["Wikipedia 930", "https://en.wikipedia.org/wiki/Porsche_930"], "Ownership note: buy for theatre and history, not casual commuting ease."),
  car("Chevrolet", "Corvette C5/C6 Z06", "2001-2013", "American performance", "United States", "2000s-2010s", "$$", "Coupe", "Track value hunter", "C5 and C6 Z06 Corvettes offer lightweight, front-engine V8 performance with serious track credibility.", "Chevrolet Corvette", "Chevrolet_Corvette", ["Classic.com Corvette Z06 market", "https://www.classic.com/m/chevrolet/corvette/"], ["Wikipedia Corvette", "https://en.wikipedia.org/wiki/Chevrolet_Corvette"], "Use case: maximum performance per dollar with a huge support network."),
  car("Cadillac", "CT5-V Blackwing", "2022-present", "American performance", "United States", "2020s", "$$$", "Sedan", "Modern manual loyalist", "A supercharged V8 sport sedan offered with a manual transmission, widely seen as an end-of-era American performance car.", "Cadillac CT5", "Cadillac_CT5", ["Cadillac CT5-V Blackwing", "https://www.cadillac.com/sedans/ct5-v-blackwing"], ["Wikipedia CT5", "https://en.wikipedia.org/wiki/Cadillac_CT5"], "Use case: family-capable modern collectible with absurd capability."),
  car("Ford", "Mustang Shelby GT350", "2015-2020", "American performance", "United States", "2010s", "$$", "Coupe", "High-rev muscle", "The S550 Shelby GT350 is defined by its flat-plane-crank Voodoo V8, manual gearbox, and road-course focus.", "Shelby Mustang", "Shelby_Mustang", ["Classic.com GT350 market", "https://www.classic.com/m/ford/mustang/6th-gen/shelby-gt350/"], ["Wikipedia Shelby Mustang", "https://en.wikipedia.org/wiki/Shelby_Mustang"], "Ownership note: engine history and usage pattern deserve careful review."),
  car("Dodge", "Viper", "1992-2017", "American performance", "United States", "1990s-2010s", "$$$", "Roadster/Coupe", "Raw event car", "The Viper built its identity around a huge V10, minimal filtering, and an old-school sense of danger and occasion.", "Dodge Viper", "Dodge_Viper", ["Classic.com Viper market", "https://www.classic.com/m/dodge/viper/"], ["Wikipedia Viper", "https://en.wikipedia.org/wiki/Dodge_Viper"], "Use case: emotional ownership for experienced drivers."),
  car("BMW", "M2 CS", "2020", "Modern collectible", "Germany", "2020s", "$$$", "Coupe", "Compact modern collector", "The M2 CS concentrated BMW M's compact coupe formula with more power, sharper hardware, and limited-production appeal.", "BMW M2", "BMW_M2", ["Classic.com M2 CS market", "https://www.classic.com/m/bmw/2-series/f87/m2-cs/"], ["Wikipedia M2", "https://en.wikipedia.org/wiki/BMW_M2"], "Use case: modern collectible that can still be driven hard."),
  car("Mercedes-Benz", "500E/E500 W124", "1990-1995", "Modern collectible", "Germany", "1990s", "$$", "Sedan", "Subtle connoisseur", "The Porsche-assembled W124 500E/E500 blended discreet styling with V8 performance and Mercedes build quality.", "Mercedes-Benz 500 E", "Mercedes-Benz_500_E", ["Classic.com 500E market", "https://www.classic.com/m/mercedes-benz/e/w124/sedan/500e/"], ["Wikipedia 500 E", "https://en.wikipedia.org/wiki/Mercedes-Benz_500_E"], "Use case: understated collector sedan for people who like depth over flash."),
  car("Audi", "R8 manual", "2006-2015", "Modern collectible", "Germany", "2000s-2010s", "$$$", "Coupe/Spyder", "Usable exotic", "Early R8s offered mid-engine exotic presence with gated manual availability and Audi usability.", "Audi R8", "Audi_R8", ["Classic.com R8 market", "https://www.classic.com/m/audi/r8/"], ["Wikipedia R8", "https://en.wikipedia.org/wiki/Audi_R8"], "Ownership note: manual V8 and V10 examples sit in different collector conversations."),
  car("Lotus", "Elise/Exige", "1996-2021", "Modern collectible", "United Kingdom", "1990s-2020s", "$$", "Roadster/Coupe", "Lightweight purist", "The Elise and Exige prioritize low mass, steering feel, and driver commitment over comfort or daily convenience.", "Lotus Elise", "Lotus_Elise", ["Classic.com Elise market", "https://www.classic.com/m/lotus/elise/"], ["Wikipedia Elise", "https://en.wikipedia.org/wiki/Lotus_Elise"], "Use case: a car for someone who values sensation more than amenities."),
  car("Ferrari", "F355", "1994-1999", "Exotics/special", "Italy", "1990s", "$$$", "Berlinetta/GTS/Spider", "Analog exotic", "The F355 paired Pininfarina beauty with a high-revving V8 and is a defining 1990s Ferrari experience.", "Ferrari F355", "Ferrari_F355", ["Classic.com F355 market", "https://www.classic.com/m/ferrari/f355/"], ["Wikipedia F355", "https://en.wikipedia.org/wiki/Ferrari_F355"], "Ownership note: budget around specialist maintenance, not just the purchase price."),
  car("Lamborghini", "Gallardo manual", "2003-2013", "Exotics/special", "Italy", "2000s-2010s", "$$$", "Coupe/Spyder", "Event exotic", "The Gallardo brought Audi-era usability to Lamborghini drama; gated manual cars remain especially enthusiast-facing.", "Lamborghini Gallardo", "Lamborghini_Gallardo", ["Classic.com Gallardo market", "https://www.classic.com/m/lamborghini/gallardo/"], ["Wikipedia Gallardo", "https://en.wikipedia.org/wiki/Lamborghini_Gallardo"], "Use case: exotic ownership with soundtrack and occasion first."),
  car("Aston Martin", "V8 Vantage manual", "2005-2017", "Exotics/special", "United Kingdom", "2000s-2010s", "$$", "Coupe/Roadster", "Grand touring romantic", "The VH-era V8 Vantage offers compact Aston styling, manual availability, and grand-touring character.", "Aston Martin Vantage (2005)", "Aston_Martin_Vantage_(2005)", ["Classic.com V8 Vantage market", "https://www.classic.com/m/aston-martin/v8-vantage/"], ["Wikipedia Vantage", "https://en.wikipedia.org/wiki/Aston_Martin_Vantage_(2005)"], "Use case: emotional GT ownership more than spec-sheet dominance.")
];

function vehicleCategoryLabel(vehicle) {
  const category = vehicle.categories?.[0] || "collector-car";
  const labels = {
    "analog-supercar": "Analog Supercar",
    "blue-chip": "Blue-Chip Classic",
    "vintage-classic": "Blue-Chip Classic",
    "modern-collectible": "Modern Collectible",
    "modern-classic": "Modern Collectible",
    "modern-supercar": "Modern Collectible",
    "jdm-icon": "JDM Icon",
    homologation: "Homologation",
    "porsche-german": "Porsche/German",
    "american-collector": "American Collector",
    "american-performance": "American Collector",
    "grand-tourer": "Grand Tourer",
    "sports-car": "Sports Car",
    "affordable-icon": "Affordable Icon"
  };
  return labels[category] || category.split("-").map(word => word[0].toUpperCase() + word.slice(1)).join(" ");
}

function bodyStyleFromTags(vehicle) {
  const tags = vehicle.tags || [];
  if (tags.includes("roadster")) return "Roadster";
  if (tags.includes("wagon")) return "Wagon";
  if (tags.includes("sedan")) return "Sedan";
  if (tags.includes("race-car")) return "Race car";
  if (tags.includes("rally") || vehicle.categories?.includes("homologation")) return "Homologation";
  if (vehicle.categories?.includes("grand-tourer")) return "Grand tourer";
  return "Coupe";
}

function budgetFromMarketTier(marketTier) {
  if (marketTier === "Under $100k") return "$";
  if (marketTier === "$100k-$500k") return "$$$";
  if (marketTier === "$500k-$1M") return "$$$$";
  if (marketTier === "$1M+") return "$$$$$";
  return "Market varies";
}

function marketSearchUrl(vehicle) {
  return `https://www.classic.com/search/?q=${encodeURIComponent(vehicle.displayName)}`;
}

function carFromVehicle(vehicle, index) {
  const marketQuery = encodeURIComponent(vehicle.displayName);
  return {
    id: vehicle.id,
    vehicleId: vehicle.id,
    make: vehicle.make,
    model: vehicle.model,
    years: vehicle.yearRange,
    yearStart: vehicle.yearStart,
    yearEnd: vehicle.yearEnd,
    category: vehicleCategoryLabel(vehicle),
    region: vehicle.country,
    era: vehicle.era,
    budget: budgetFromMarketTier(vehicle.marketTier),
    marketTier: vehicle.marketTier,
    bodyStyle: bodyStyleFromTags(vehicle),
    vibe: vehicle.categories?.includes("blue-chip") ? "Research-led collector" : vehicle.categories?.includes("analog-supercar") ? "Analog event car" : "Collector watchlist",
    summary: vehicle.shortDescription,
    wikiTitle: vehicle.displayName,
    wikiSlug: vehicle.displayName.replace(/\s+/g, "_"),
    imageAlt: vehicle.imageMeta?.alt || vehicle.displayName,
    imageCredit: vehicle.imageMeta?.credit || "Canonical Veloce vehicle image.",
    imageSourceUrl: vehicle.imageMeta?.sourceUrl || "",
    imageLicense: vehicle.imageMeta?.license || "",
    tags: vehicle.tags || [],
    categories: vehicle.categories || [],
    addedIndex: index,
    specs: {
      layout: vehicle.tags?.includes("mid-engine") ? "Mid-engine" : "Model-level layout varies; verify by generation.",
      drivetrain: vehicle.tags?.includes("awd") ? "AWD" : "Mostly RWD or model-specific",
      market: vehicle.marketTier || "Market varies; verify with linked sources."
    },
    note: "Lightweight Veloce seed profile. Use source links and live listings to verify condition, specification, and market context.",
    citations: [
      { label: "CLASSIC.COM search", url: marketSearchUrl(vehicle) },
      { label: "Hemmings search", url: `https://www.hemmings.com/classifieds/?q=${marketQuery}` },
      { label: "Bring a Trailer search", url: `https://bringatrailer.com/search/?s=${marketQuery}` }
    ]
  };
}

const existingCarIds = new Set(cars.map(car => car.id));
(window.veloceVehicleLibrary || []).forEach((vehicle, index) => {
  if (!existingCarIds.has(vehicle.id)) cars.push(carFromVehicle(vehicle, index));
});

cars.forEach((car, index) => {
  car.addedIndex = Number.isFinite(car.addedIndex) ? car.addedIndex : index;
  car.yearStart = car.yearStart || Number(String(car.years).slice(0, 4)) || 0;
  car.yearEnd = car.yearEnd || car.yearStart;
  car.marketTier = car.marketTier || window.getVehicle?.(car.id)?.marketTier || "Market varies";
  car.tags = car.tags || window.getVehicle?.(car.id)?.tags || [];
  car.categories = car.categories || window.getVehicle?.(car.id)?.categories || [];
});

window.veloceCars = cars;

function car(make, model, years, category, region, era, budget, bodyStyle, vibe, summary, wikiTitle, wikiSlug, citationA, citationB, note) {
  const marketQuery = encodeURIComponent(`${make} ${model}`);
  const id = `${make}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const ownedImage = ownedImages[id];
  return {
    id,
    vehicleId: id,
    make,
    model,
    years,
    category,
    region,
    era,
    budget,
    bodyStyle,
    vibe,
    summary,
    wikiTitle,
    wikiSlug,
    imageAlt: ownedImage?.alt || `${make} ${model}`,
    imageCredit: ownedImage?.credit || "Image: Wikimedia/Wikipedia page image, loaded from a published source when available.",
    imageSourceUrl: ownedImage?.sourceUrl || "",
    imageLicense: ownedImage?.license || "",
    specs: {
      layout: summary.includes("mid-engine") || summary.includes("Mid-engine") ? "Mid-engine" : "Front/rear layout varies by model",
      drivetrain: summary.includes("all-wheel") ? "AWD" : "Mostly RWD",
      market: "Market varies; verify with linked sources."
    },
    note,
    citations: [
      { label: citationA[0], url: citationA[1] },
      { label: citationB[0], url: citationB[1] },
      { label: "Hemmings search", url: `https://www.hemmings.com/classifieds/?q=${marketQuery}` },
      { label: "Bring a Trailer search", url: `https://bringatrailer.com/search/?s=${marketQuery}` }
    ]
  };
}

function readStoredJson(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.warn(`Veloce ignored invalid stored data for ${key}.`, error);
    localStorage.removeItem(key);
    return fallback;
  }
}

function readStoredArray(key) {
  const value = readStoredJson(key, []);
  return Array.isArray(value) ? value : [];
}

const state = {
  search: "",
  mode: localStorage.getItem("veloceMode") || "",
  garage: readStoredArray("veloceGarage"),
  favorites: readStoredArray("veloceFavorites"),
  filters: {
    exploreTab: "All",
    sort: "editorial",
    category: "All",
    region: "All",
    era: "All",
    budget: "All",
    bodyStyle: "All"
  }
};

const profileInputs = {
  goal: "drive",
  budget: "$",
  topic: "analog",
  risk: "low"
};

const defaultUserProfile = {
  experienceLevel: "",
  goals: [],
  categories: [],
  favoriteMakes: [],
  customMake: "",
  eras: [],
  budgetBand: "",
  collectorIntent: "",
  contentPreferences: [],
  notificationPreference: "",
  seedGarageIds: []
};

const userProfile = {
  ...defaultUserProfile,
  ...readStoredJson("veloceUserProfile", {})
};

let onboardingIndex = Number(localStorage.getItem("veloceOnboardingStep") || "0");
if (!Number.isFinite(onboardingIndex)) onboardingIndex = 0;
let pendingGarageRemovalId = "";
let digestGarageCarouselTimer = null;

const starterGarageCars = [
  { vehicleId: "ferrari-f40", description: "The analog Ferrari benchmark." },
  { vehicleId: "porsche-carrera-gt", description: "Manual V10 supercar reference point." },
  { vehicleId: "mclaren-f1", description: "The central-seat legend every market watches." },
  { vehicleId: "ferrari-250-gto", description: "Vintage racing royalty and blue-chip icon." },
  { vehicleId: "lamborghini-miura", description: "The origin story for exotic road cars." },
  { vehicleId: "mercedes-300sl", description: "Engineering, scarcity, and design mythology." },
  { vehicleId: "lexus-lfa", description: "Japanese V10 halo-car precision." },
  { vehicleId: "ford-gt", description: "Le Mans story with modern collectible heat." },
  { vehicleId: "porsche-997-gt3-rs", description: "Track-bred Porsche collector signal." },
  { vehicleId: "ferrari-enzo", description: "Carbon-era Ferrari halo car." }
];

const onboardingSteps = [
  {
    type: "welcome",
    title: "Let’s tailor Veloce to you",
    copy: "Whether you’re just discovering collector cars or already know what you love, we’ll build your market view in a few quick steps."
  },
  {
    key: "experienceLevel",
    title: "How would you describe your collector car knowledge?",
    copy: "This changes how much guidance Veloce gives you across research, auctions, and market notes.",
    multi: false,
    options: [
      ["Just getting started", "Plain-language explanations and guided recommendations."],
      ["Curious enthusiast", "A balanced mix of learning and market context."],
      ["Active shopper", "More emphasis on listings, comps, and timing."],
      ["Experienced collector", "Faster access to signals and comparable movement."],
      ["Industry professional", "Dense market notes and fewer beginner explanations."]
    ]
  },
  {
    key: "goals",
    title: "What are you most interested in?",
    copy: "Choose every reason that fits. Veloce uses this to weight the app experience.",
    multi: true,
    options: [
      ["Learning the market", "Understand categories, terms, and valuation logic."],
      ["Tracking values", "Prioritize market movement and comparable sales."],
      ["Following auctions", "Surface auction radar and ending-soon opportunities."],
      ["Finding cars to buy", "Bring listings and risk notes forward."],
      ["Discovering new models", "Show adjacent cars and unexpected alternatives."],
      ["Building a future collection", "Emphasize garage strategy and long-term fit."],
      ["Following collector news", "Keep the digest prominent."],
      ["Comparing models", "Push alternatives and category tradeoffs."]
    ]
  },
  {
    key: "categories",
    title: "Which categories catch your eye?",
    copy: "This is the strongest signal for recommendations.",
    multi: true,
    visual: true,
    options: [
      ["Analog supercars", "Manual, naturally aspirated, high-drama icons."],
      ["Modern supercars", "Recent halo cars and limited production specials."],
      ["Vintage classics", "Design, preservation, and provenance."],
      ["Race cars", "Motorsport history and competition hardware."],
      ["GT cars", "Fast, elegant, long-distance machines."],
      ["Sports cars", "Driver feel, balance, and usability."],
      ["JDM icons", "Japanese hero cars and import-era legends."],
      ["Luxury grand tourers", "Comfort, occasion, and long-haul style."],
      ["Homologation specials", "Road cars with racing purpose."],
      ["Youngtimers", "Emerging modern classics from the 80s-00s."],
      ["Off-road / utility classics", "Capability, nostalgia, and lifestyle value."],
      ["Open to anything interesting", "Let Veloce surprise you."]
    ]
  },
  {
    key: "favoriteMakes",
    title: "Which brands do you want to follow?",
    copy: "These marques become persistent signals for Digest and Auctions.",
    multi: true,
    marque: true,
    options: ["Ferrari", "Porsche", "Lamborghini", "McLaren", "Mercedes-Benz", "Aston Martin", "Jaguar", "BMW", "Alfa Romeo", "Lexus", "Ford", "Other / Custom input"].map(v => [v, ""])
  },
  {
    key: "eras",
    title: "Which eras speak to you?",
    copy: "Era preference helps Veloce separate vintage provenance from modern collectibility.",
    multi: true,
    options: [
      ["Pre-war", "Early engineering and historical significance."],
      ["1950s–60s", "Coachbuilt classics, racing mythology, and design icons."],
      ["1970s–80s", "Poster cars, homologation, and early turbo drama."],
      ["1990s–2000s", "Analog modern classics and JDM/exotic momentum."],
      ["2010s–today", "End-of-era manuals, halo cars, and limited runs."],
      ["No preference", "Keep every era in play."]
    ]
  },
  {
    key: "budgetBand",
    title: "What part of the market do you want to explore?",
    copy: "This is about comfort zone, not commitment.",
    multi: false,
    options: [
      ["Under $50k", "Approachable icons and driver-quality cars."],
      ["$50k–$150k", "Serious enthusiast cars and modern collectibles."],
      ["$150k–$500k", "Special specs, exotics, and blue-chip entry points."],
      ["$500k–$1M", "Halo cars and rare collector-grade examples."],
      ["$1M+", "Top-tier collectibles and major auction signals."],
      ["I’m just browsing", "Keep the learning broad and exploratory."]
    ]
  },
  {
    key: "collectorIntent",
    title: "What kind of collector are you right now?",
    copy: "Veloce adjusts the balance between learning, watching, and buying.",
    multi: false,
    options: [
      ["Dreaming and learning", "Explain the world before pushing listings."],
      ["Watching the market", "Prioritize movement, signals, and comps."],
      ["Ready to buy soon", "Bring pricing, risk, and opportunity forward."],
      ["Already collecting", "Treat your garage as a portfolio."],
      ["Looking to diversify a collection", "Surface adjacent categories and hedges."]
    ]
  },
  {
    key: "contentPreferences",
    title: "What do you want to see more of?",
    copy: "This tunes the future app surfaces.",
    multi: true,
    options: [
      ["Auctions", "Radar, deadlines, and listing intelligence."],
      ["News and digest", "Briefings and editorial context."],
      ["Comparable sales", "Recent results and valuation references."],
      ["Market signals", "Simplified collector momentum."],
      ["Featured cars", "Curated models worth learning."],
      ["Similar models", "Alternatives connected to your taste."],
      ["My Garage recommendations", "Personal next-step suggestions."],
      ["Investment-style analysis", "Risk, scarcity, and trend framing."]
    ]
  },
  {
    key: "notificationPreference",
    title: "How often should we update you?",
    copy: "This sets the tone for future alerts.",
    multi: false,
    options: [
      ["Live / as things happen", "For active shoppers and auction watchers."],
      ["Daily briefing", "A focused collector market read."],
      ["Weekly digest", "Less noise, bigger signals."],
      ["Only major updates", "Records, rare listings, and major movement only."]
    ]
  },
  {
    key: "seedGarageIds",
    title: "Pick a few cars to start your Garage",
    copy: "Choose the cars you want Veloce to use as your first taste signal.",
    multi: true,
    starterGarage: true,
    options: starterGarageCars.map(car => [car.vehicleId, car.description])
  },
  {
    type: "summary",
    title: "Your Veloce experience is ready",
    copy: "We’ll use this profile to shape the Model Library, Auctions, Digest, My Garage, and future alerts."
  }
];

function saveMode(mode) {
  state.mode = mode;
  localStorage.setItem("veloceMode", mode);
}

function pageName() {
  return document.body.dataset.page || "";
}

function wirePathStart() {
  document.querySelectorAll("[data-start-mode]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      saveMode(link.dataset.startMode);
      window.location.href = link.getAttribute("href");
    });
  });
}

function enforcePathEntry() {
  const page = pageName();
  if (page === "start") return true;
  if (document.body.dataset.requiresPath && !state.mode) {
    window.location.href = "index.html";
    return false;
  }
  if (page === "novice" && state.mode !== "novice") {
    saveMode("novice");
  }
  return true;
}

function renderPathStatus() {
  return;
}

function normalizePrimaryNavigation() {
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) return;
  navLinks.innerHTML = `
    <a href="garage.html">My Garage</a>
    <a href="explore.html">Model Library</a>
    <a href="digest.html">Digest</a>
  `;
}

function markActiveNavigation() {
  const page = pageName();
  document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href") || "";
    const active =
      (page === "garage" && href.includes("garage.html")) ||
      (page === "digest" && href.includes("digest.html")) ||
      (page === "explore" && href.includes("explore.html"));
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function saveUserProfile() {
  localStorage.setItem("veloceUserProfile", JSON.stringify(userProfile));
}

function clampOnboardingIndex() {
  onboardingIndex = Math.max(0, Math.min(onboardingSteps.length - 1, onboardingIndex));
  localStorage.setItem("veloceOnboardingStep", String(onboardingIndex));
}

function optionValue(option) {
  return Array.isArray(option) ? option[0] : option;
}

function optionDescription(option) {
  return Array.isArray(option) ? option[1] : "";
}

function isSelected(step, value) {
  const current = userProfile[step.key];
  return step.multi ? current.includes(value) : current === value;
}

function toggleProfileValue(step, value) {
  if (!step.key) return;
  if (step.multi) {
    const current = userProfile[step.key] || [];
    userProfile[step.key] = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
  } else {
    userProfile[step.key] = value;
  }
  saveUserProfile();
  renderOnboarding();
}

function seedGarageFromProfile() {
  const garageIds = userProfile.seedGarageIds
    .map(id => starterGarageCars.find(car => car.vehicleId === id)?.vehicleId)
    .filter(Boolean);
  const merged = new Set([...state.garage, ...garageIds]);
  state.garage = [...merged];
  localStorage.setItem("veloceGarage", JSON.stringify(state.garage));
}

function selectedLabels(values) {
  if (!values || !values.length) return "None selected yet";
  return Array.isArray(values) ? values.join(", ") : values;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function articleRecommendationScore(item) {
  const text = `${item.headline || ""} ${item.excerpt || ""} ${item.rawText || ""} ${(item.tags || []).join(" ")}`.toLowerCase();
  let score = 0;
  userProfile.favoriteMakes?.forEach(make => {
    if (make && make !== "Other / Custom input" && text.includes(make.toLowerCase())) score += 10;
  });
  userProfile.categories?.forEach(category => {
    const normalized = category.toLowerCase().replace(/\s*\/\s*/g, " ").replace(/\s+/g, " ");
    if (text.includes(normalized) || normalized.split(" ").some(word => word.length > 4 && text.includes(word))) score += 4;
  });
  userProfile.seedGarageIds?.forEach(id => {
    const vehicle = window.getVehicle?.(id);
    if (!vehicle) return;
    if (text.includes(vehicle.make.toLowerCase())) score += 6;
    if (text.includes(vehicle.model.toLowerCase())) score += 12;
    vehicle.tags?.forEach(tag => {
      if (text.includes(tag.toLowerCase())) score += 2;
    });
  });
  userProfile.goals?.forEach(goal => {
    if (/news|market|auction|value|tracking/i.test(goal) && /(market|auction|price|sale|record|collector)/i.test(text)) score += 3;
  });
  return score;
}

async function renderOnboardingArticleRecommendations() {
  const target = document.querySelector("#onboardingArticleRecommendations");
  if (!target) return;
  try {
    const response = await fetch("data/digest-cache.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Digest cache unavailable");
    const cache = await response.json();
    const articles = (cache.items || [])
      .filter(item => item.sourceUrl && item.headline)
      .map(item => ({ ...item, score: articleRecommendationScore(item) }))
      .sort((a, b) => b.score - a.score || Date.parse(b.publishedAt || 0) - Date.parse(a.publishedAt || 0))
      .slice(0, 2);
    if (!articles.length) throw new Error("No real articles available");
    target.innerHTML = `
      <div class="onboarding-briefing">
        <p class="eyebrow">Starter briefing</p>
        <h2>Two real articles to start with</h2>
        <div class="onboarding-article-grid">
          ${articles.map(article => `
            <article class="onboarding-article-card">
              <span>${escapeHtml(article.source)} · ${article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Date unavailable"}</span>
              <h3>${escapeHtml(article.headline)}</h3>
              <p>${escapeHtml(article.excerpt || "No source excerpt available.")}</p>
              <a class="source-link" href="${escapeHtml(article.sourceUrl)}" target="_blank" rel="noopener">Read source</a>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  } catch {
    target.innerHTML = `
      <div class="onboarding-briefing">
        <p class="eyebrow">Starter briefing</p>
        <h2>Digest source unavailable</h2>
        <p>Veloce could not load real article recommendations right now. Open Digest later to refresh approved sources.</p>
      </div>
    `;
  }
}

function renderOnboardingSummary() {
  const selectedStarters = userProfile.seedGarageIds
    .map(id => window.getVehicle?.(id)?.displayName)
    .filter(Boolean);
  return `
    <div class="onboarding-summary">
      <div class="summary-row"><span>Experience</span><strong>${userProfile.experienceLevel || "Not set"}</strong></div>
      <div class="summary-row"><span>Main interests</span><strong>${selectedLabels(userProfile.goals)}</strong></div>
      <div class="summary-row"><span>Categories</span><strong>${selectedLabels(userProfile.categories)}</strong></div>
      <div class="summary-row"><span>Marques</span><strong>${selectedLabels(userProfile.favoriteMakes)}</strong></div>
      <div class="summary-row"><span>Era</span><strong>${selectedLabels(userProfile.eras)}</strong></div>
      <div class="summary-row"><span>Budget</span><strong>${userProfile.budgetBand || "Not set"}</strong></div>
      <div class="summary-row"><span>Starter garage</span><strong>${selectedStarters.length ? selectedStarters.join(", ") : "Not set"}</strong></div>
    </div>
    ${renderProfileResponse(selectedStarters)}
    <div id="onboardingArticleRecommendations" class="onboarding-article-shell">
      <div class="onboarding-briefing">
        <p class="eyebrow">Starter briefing</p>
        <h2>Loading real article recommendations.</h2>
      </div>
    </div>
    <div class="onboarding-recommendations">
      <p class="eyebrow">Recommended next</p>
      <h2>Models Veloce thinks you should study</h2>
      <div class="onboarding-recommendation-grid">
        ${profileRecommendations().map(renderRecommendationCard).join("")}
      </div>
    </div>
    <div class="onboarding-route-actions">
      <a class="button primary" href="digest.html" data-finish-onboarding="digest">Explore Digest</a>
      <a class="button secondary" href="explore.html" data-finish-onboarding="library">Open Model Library</a>
    </div>
  `;
}

function renderProfileResponse(selectedStarters = []) {
  const primaryCategories = (userProfile.categories || []).filter(category => category !== "Open to anything interesting").slice(0, 3);
  const makes = (userProfile.favoriteMakes || []).filter(make => make && make !== "Other / Custom input").slice(0, 3);
  const intent = userProfile.collectorIntent || userProfile.goals?.[0] || "Learning the market";
  const content = (userProfile.contentPreferences || userProfile.goals || []).slice(0, 3);
  const tasteLine = [
    makes.length ? makes.join(", ") : "",
    primaryCategories.length ? primaryCategories.join(", ") : "",
    userProfile.eras?.length ? userProfile.eras.slice(0, 2).join(", ") : ""
  ].filter(Boolean).join(" / ");
  const briefingLine = content.length
    ? `Veloce will weight ${content.join(", ").toLowerCase()} higher as you move through Digest, Auctions, and the Model Library.`
    : "Veloce will start broad, then refine as you save cars and read profiles.";
  const garageLine = selectedStarters.length
    ? `Your first Garage signals are ${selectedStarters.slice(0, 3).join(", ")}${selectedStarters.length > 3 ? ", and more" : ""}.`
    : "Add a few starter cars to make recommendations sharper.";

  return `
    <div class="onboarding-profile-response">
      <p class="eyebrow">What Veloce learned</p>
      <div>
        <article>
          <span>Collector lens</span>
          <strong>${escapeHtml(userProfile.experienceLevel || "New Veloce profile")}</strong>
          <p>${escapeHtml(intent)} is the current operating mode, so the app will balance learning with practical next steps.</p>
        </article>
        <article>
          <span>Taste signal</span>
          <strong>${escapeHtml(tasteLine || "Wide-open collector curiosity")}</strong>
          <p>${escapeHtml(garageLine)}</p>
        </article>
        <article>
          <span>Recommendation logic</span>
          <strong>Articles, models, and garage matches</strong>
          <p>${escapeHtml(briefingLine)}</p>
        </article>
      </div>
    </div>
  `;
}

function profileRecommendations(limit = 4) {
  const selected = new Set(userProfile.seedGarageIds || []);
  const scored = cars
    .filter(car => !selected.has(car.id) && !isInGarage(car.id))
    .map(car => ({ car, score: profileRelevanceScore(car) }))
    .sort((a, b) => b.score - a.score || a.car.addedIndex - b.car.addedIndex);
  const top = scored.filter(item => item.score > 0).slice(0, limit);
  return (top.length ? top : scored.slice(0, limit)).map(item => item.car);
}

function recommendationReason(car) {
  if (userProfile.favoriteMakes?.some(make => make && make !== "Other / Custom input" && car.make.toLowerCase().includes(make.toLowerCase()))) {
    return `Matches your interest in ${car.make}.`;
  }
  if (userProfile.categories?.some(category => `${car.category} ${(car.categories || []).join(" ")}`.toLowerCase().includes(category.toLowerCase().split(" ")[0]))) {
    return `Fits the category signals you selected.`;
  }
  if (userProfile.budgetBand && car.marketTier === userProfile.budgetBand) {
    return `Sits in your selected market range.`;
  }
  return `A strong adjacent model for your first Veloce profile.`;
}

function renderRecommendationCard(car) {
  const vehicle = vehicleForCar(car);
  return `
    <article class="onboarding-recommendation-card">
      <img src="${displayImageForVehicle(car.id, "thumbnail")}" alt="${vehicle?.imageMeta?.alt || vehicle?.displayName || car.model}" loading="lazy" data-vehicle-id="${car.id}" />
      <div>
        <span>${car.category} / ${car.marketTier || car.budget}</span>
        <h3>${vehicle?.displayName || `${car.make} ${car.model}`}</h3>
        <p>${recommendationReason(car)}</p>
        <button class="save-button ${isInGarage(car.id) ? "saved" : ""}" data-onboarding-save="${car.id}" type="button">${isInGarage(car.id) ? "Saved" : "Add to Garage"}</button>
      </div>
    </article>
  `;
}

function renderOptionCard(step, option) {
  const value = optionValue(option);
  const description = optionDescription(option);
  const starter = step.starterGarage ? starterGarageCars.find(car => car.vehicleId === value) : null;
  const starterVehicle = starter ? window.getVehicle?.(starter.vehicleId) : null;
  const starterImage = starterVehicle ? window.resolveVehicleImage?.(starterVehicle, "thumbnail") : "";
  const starterTitle = starterVehicle?.displayName || value;
  const selected = isSelected(step, value);
  return `
    <button class="onboarding-option ${selected ? "selected" : ""} ${step.visual ? "visual" : ""} ${step.marque ? "marque" : ""} ${starter ? "starter" : ""}" type="button" data-onboarding-value="${value}">
      ${starter ? `<img src="${starterImage}" alt="${starterTitle}" loading="lazy" data-vehicle-id="${starter.vehicleId}" />` : ""}
      <span>${starter ? starterTitle : value}</span>
      ${description ? `<small>${description}</small>` : ""}
    </button>
  `;
}

function renderOnboarding() {
  const target = document.querySelector("#onboardingStep");
  if (!target) return;
  clampOnboardingIndex();
  const step = onboardingSteps[onboardingIndex];
  const progress = document.querySelector("#onboardingProgressBar");
  const label = document.querySelector("#onboardingStepLabel");
  const back = document.querySelector("#onboardingBack");
  const skip = document.querySelector("#onboardingSkip");
  const next = document.querySelector("#onboardingNext");
  const percent = ((onboardingIndex + 1) / onboardingSteps.length) * 100;
  if (progress) progress.style.width = `${percent}%`;
  if (label) label.textContent = `Step ${onboardingIndex + 1} of ${onboardingSteps.length}`;
  if (back) back.disabled = onboardingIndex === 0;
  if (skip) skip.style.visibility = step.type === "welcome" || step.type === "summary" ? "hidden" : "visible";
  if (next) {
    next.textContent = onboardingIndex === onboardingSteps.length - 1 ? "Open Model Library" : step.type === "welcome" ? "Start" : "Next";
    next.disabled = !canAdvanceOnboarding();
  }

  const options = step.options?.map(option => renderOptionCard(step, option)).join("") || "";
  const customMakeInput = step.key === "favoriteMakes" && userProfile.favoriteMakes.includes("Other / Custom input")
    ? `<label class="custom-make-field"><span>Custom marque</span><input id="customMakeInput" type="text" value="${userProfile.customMake}" placeholder="Type a marque to follow" /></label>`
    : "";
  target.innerHTML = `
    <article class="onboarding-card ${step.type || ""}">
      <p class="eyebrow">${step.type === "summary" ? "Profile ready" : "Guided setup"}</p>
      <h1>${step.title}</h1>
      <p>${step.copy}</p>
      ${step.type === "summary" ? renderOnboardingSummary() : ""}
      ${options ? `<div class="onboarding-options ${step.starterGarage ? "starter-grid" : ""}">${options}</div>` : ""}
      ${customMakeInput}
    </article>
  `;
  if (step.type === "summary") renderOnboardingArticleRecommendations();
}

function canAdvanceOnboarding() {
  const step = onboardingSteps[onboardingIndex];
  if (!step.key || step.type === "welcome" || step.type === "summary") return true;
  const current = userProfile[step.key];
  return step.multi ? current.length > 0 : Boolean(current);
}

function moveOnboarding(delta) {
  onboardingIndex = Math.max(0, Math.min(onboardingSteps.length - 1, onboardingIndex + delta));
  localStorage.setItem("veloceOnboardingStep", String(onboardingIndex));
  renderOnboarding();
}

function finishOnboarding() {
  seedGarageFromProfile();
  localStorage.setItem("veloceOnboardingComplete", "true");
  window.location.href = "explore.html";
}

function wireOnboarding() {
  const target = document.querySelector("#onboardingStep");
  if (!target) return;
  target.addEventListener("click", event => {
    const card = event.target.closest("[data-onboarding-value]");
    if (!card) return;
    const step = onboardingSteps[onboardingIndex];
    toggleProfileValue(step, card.dataset.onboardingValue);
  });
  target.addEventListener("click", event => {
    const finishLink = event.target.closest("[data-finish-onboarding]");
    if (!finishLink) return;
    seedGarageFromProfile();
    localStorage.setItem("veloceOnboardingComplete", "true");
  });
  target.addEventListener("click", event => {
    const saveButton = event.target.closest("[data-onboarding-save]");
    if (!saveButton) return;
    const id = saveButton.dataset.onboardingSave;
    if (!isInGarage(id)) {
      state.garage = [...state.garage, id];
      saveGarage();
    }
    saveButton.classList.add("saved");
    saveButton.textContent = "Saved";
  });
  target.addEventListener("input", event => {
    if (event.target.id !== "customMakeInput") return;
    userProfile.customMake = event.target.value;
    saveUserProfile();
  });
  document.querySelector("#onboardingBack")?.addEventListener("click", () => moveOnboarding(-1));
  document.querySelector("#onboardingSkip")?.addEventListener("click", () => moveOnboarding(1));
  document.querySelector("#onboardingNext")?.addEventListener("click", () => {
    if (onboardingIndex === onboardingSteps.length - 1) {
      finishOnboarding();
      return;
    }
    if (!canAdvanceOnboarding()) return;
    moveOnboarding(1);
  });
  renderOnboarding();
}

const fallbackImage = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720">
  <rect width="1200" height="720" fill="#d8cabb"/>
  <path d="M210 460h780l-85-120H344z" fill="#201d1a"/>
  <circle cx="390" cy="492" r="54" fill="#f7f2ea"/>
  <circle cx="810" cy="492" r="54" fill="#f7f2ea"/>
  <text x="600" y="250" text-anchor="middle" font-family="Georgia, serif" font-size="70" fill="#b7332c">Veloce</text>
  <text x="600" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#675f58">Reference visual</text>
</svg>`);

function imageCreditMarkup(car) {
  const vehicle = window.getVehicle?.(car.id);
  const meta = vehicle?.imageMeta || {};
  const credit = meta.credit || car.imageCredit || "Canonical Veloce vehicle image.";
  const license = meta.license || car.imageLicense ? ` · ${meta.license || car.imageLicense}` : "";
  const url = meta.sourceUrl || car.imageSourceUrl;
  if (!url) return `${credit}${license}`;
  return `<a href="${url}" target="_blank" rel="noopener">${credit}${license}</a>`;
}

function vehicleForCar(car) {
  return window.getVehicle?.(car.id) || null;
}

function displayImageForVehicle(vehicleId, imageType = "thumbnail") {
  const vehicle = window.getVehicle?.(vehicleId);
  return window.resolveVehicleImage?.(vehicle || vehicleId, imageType) || fallbackImage;
}

function vehicleVideos(vehicleId) {
  return window.veloceVehicleVideos?.[vehicleId] || [];
}

function hasVehicleVideo(vehicleId) {
  return vehicleVideos(vehicleId).length > 0;
}

function renderVehicleVideoModule(vehicleId) {
  const videos = vehicleVideos(vehicleId);
  if (!videos.length) return "";
  const video = videos[0];
  const embedUrl = `https://www.youtube.com/embed/${encodeURIComponent(video.id)}?rel=0&playsinline=1`;
  return `
    <section class="profile-section video-box">
      <div class="profile-section-header">
        <div>
          <p class="eyebrow">Watch</p>
          <h3>Selected videos and reviews</h3>
        </div>
      </div>
      <div class="video-frame">
        <iframe
          src="${embedUrl}"
          title="${escapeHtml(video.title)}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
      </div>
      <p><strong>${escapeHtml(video.type || "video")}</strong> / ${escapeHtml(video.source || "YouTube")}</p>
      <a class="source-link" href="${escapeHtml(video.url)}" target="_blank" rel="noopener">Open on YouTube</a>
    </section>
  `;
}

function garageDisplayItems() {
  return state.garage
    .map(id => {
      const car = cars.find(item => item.id === id);
      const vehicle = window.getVehicle?.(id);
      return { id, car, vehicle };
    })
    .filter(item => item.car || item.vehicle);
}

function renderDigestGarageCarousel() {
  const target = document.querySelector("#digestGarageCarousel");
  if (!target) return;
  const items = garageDisplayItems();
  if (digestGarageCarouselTimer) {
    clearInterval(digestGarageCarouselTimer);
    digestGarageCarouselTimer = null;
  }
  if (!items.length) {
    target.innerHTML = `
      <div class="digest-garage-empty">
        <p class="eyebrow">Garage signal</p>
        <h2>No saved cars yet</h2>
        <p>Add cars in Model Library to personalize this briefing.</p>
        <a class="source-link" href="explore.html">Open Model Library</a>
      </div>
    `;
    return;
  }

  let index = 0;
  const renderSlide = () => {
    const item = items[index % items.length];
    const vehicle = item.vehicle || window.getVehicle?.(item.id);
    const car = item.car || cars.find(candidate => candidate.id === item.id);
    const image = displayImageForVehicle(item.id, "thumbnail");
    target.innerHTML = `
      <a class="digest-garage-slide" href="garage.html" aria-label="Open My Garage">
        <img src="${image}" alt="${escapeHtml(vehicle?.imageMeta?.alt || vehicle?.displayName || car?.model || "Saved car")}" loading="lazy" data-vehicle-id="${item.id}" />
        <div>
          <p class="eyebrow">My Garage ${items.length > 1 ? `${(index % items.length) + 1}/${items.length}` : ""}</p>
          <h2>${escapeHtml(vehicle?.displayName || `${car?.make || ""} ${car?.model || ""}`.trim())}</h2>
          <p>${escapeHtml(car?.marketTier || vehicle?.marketTier || "Market varies")} · ${escapeHtml(car?.category || vehicle?.categories?.[0] || "Collector profile")}</p>
        </div>
      </a>
    `;
  };

  renderSlide();
  if (items.length > 1) {
    digestGarageCarouselTimer = setInterval(() => {
      index += 1;
      renderSlide();
    }, 4200);
  }
}

function renderDigest() {
  const digestGrid = document.querySelector("#digestGrid");
  if (!digestGrid) return;
  digestGrid.innerHTML = digestItems.map(item => `
    <article class="digest-card ${item.lead ? "lead-card" : ""}">
      <div class="tag-row">
        <span class="tag">${item.type}</span>
        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
      </div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <p class="meta">${item.source} · ${item.date}</p>
      <a class="source-link" href="${item.url}" ${item.url.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${item.url.startsWith("http") ? "Open source" : "Open Veloce brief"}</a>
    </article>
  `).join("");
}

function renderMarket() {
  const marketGrid = document.querySelector("#marketGrid");
  if (!marketGrid) return;
  marketGrid.innerHTML = marketSources.map(source => `
    <article class="market-card">
      <h3>${source.name}</h3>
      <p>${source.text}</p>
      <a class="source-link" href="${source.url}" target="_blank" rel="noopener">Visit source</a>
    </article>
  `).join("");
}

function renderLanes() {
  const laneGrid = document.querySelector("#laneGrid");
  if (!laneGrid) return;
  laneGrid.innerHTML = lanes.map(lane => `
    <article class="lane">
      <h3>${lane.title}</h3>
      <p>${lane.text}</p>
    </article>
  `).join("");
}

function carScoreForProfile(car) {
  let score = 0;
  if (car.budget === profileInputs.budget) score += 4;
  if (profileInputs.goal === "drive" && ["Analog driver", "High-rev purist", "Balanced driver", "Mid-engine learner", "Lightweight purist", "Track value hunter"].includes(car.vibe)) score += 4;
  if (profileInputs.goal === "collect" && ["Blue-chip classic", "JDM collector", "Modern classic driver", "Compact modern collector", "Subtle connoisseur"].includes(car.vibe)) score += 4;
  if (profileInputs.goal === "event" && ["Event car", "Analog exotic", "Usable exotic", "Grand touring romantic", "Raw event car"].includes(car.vibe)) score += 4;
  if (profileInputs.risk === "low" && ["Affordable icon", "American performance"].includes(car.category)) score += 3;
  if (profileInputs.risk === "medium" && ["Modern collectible", "Porsche/core collector", "JDM hero"].includes(car.category)) score += 3;
  if (profileInputs.risk === "high" && ["Exotics/special", "Porsche/core collector"].includes(car.category)) score += 3;
  if (profileInputs.topic === "analog" && /manual|naturally|light|steering|rear-wheel|mid-engine/i.test(`${car.summary} ${car.note}`)) score += 2;
  if (profileInputs.topic === "market" && /collector|originality|documentation|market|limited|blue-chip/i.test(`${car.summary} ${car.note}`)) score += 2;
  if (profileInputs.topic === "risk" && /maintenance|specialist|records|service|rotary|history/i.test(`${car.summary} ${car.note}`)) score += 2;
  return score;
}

function ownerLabel() {
  if (profileInputs.goal === "collect") return "Research-led collector";
  if (profileInputs.goal === "event") return "Occasion-focused enthusiast";
  return "Driver-first learner";
}

function renderProfileBuilder() {
  const profileResult = document.querySelector("#profileResult");
  if (!profileResult) return;
  const module = learningModules[profileInputs.topic];
  const recommended = [...cars]
    .sort((a, b) => carScoreForProfile(b) - carScoreForProfile(a))
    .slice(0, 4);

  profileResult.innerHTML = `
    <p class="eyebrow">Your current Veloce profile</p>
    <h3>${ownerLabel()}</h3>
    <p><strong>Budget lens:</strong> ${profileInputs.budget} · <strong>Complexity:</strong> ${profileInputs.risk}</p>
    <div class="lesson-card">
      <h4>${module.title}</h4>
      <p>${module.lesson}</p>
      <p>${module.next}</p>
    </div>
    <h4>Start with these models</h4>
    <div class="mini-car-list">
      ${recommended.map(car => `
        <button type="button" data-car="${car.id}">
          <span>${car.make} ${car.model}</span>
          <small>${car.vibe}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function wireProfileBuilder() {
  const builder = document.querySelector("#profileBuilder");
  const profileResult = document.querySelector("#profileResult");
  if (!builder || !profileResult) return;
  builder.addEventListener("change", event => {
    if (!event.target.name) return;
    profileInputs[event.target.name] = event.target.value;
    renderProfileBuilder();
    renderFavoritePicker();
  });

  profileResult.addEventListener("click", event => {
    const button = event.target.closest("[data-car]");
    if (!button) return;
    const selected = cars.find(car => car.id === button.dataset.car);
    if (selected) renderProfile(selected);
  });

  renderProfileBuilder();
}

function saveFavorites() {
  localStorage.setItem("veloceFavorites", JSON.stringify(state.favorites));
}

function isFavorite(id) {
  return state.favorites.includes(id);
}

function toggleFavorite(id) {
  state.favorites = isFavorite(id)
    ? state.favorites.filter(savedId => savedId !== id)
    : [...state.favorites, id];
  saveFavorites();
  renderFavoritePicker();
  renderNoviceContinue();
}

function addFavoritesToGarage() {
  const merged = new Set([...state.garage, ...state.favorites]);
  state.garage = [...merged];
  saveGarage();
  renderGarage();
  renderCars();
}

function renderNoviceContinue() {
  const continueLink = document.querySelector("#noviceContinue");
  if (!continueLink) return;
  const remaining = Math.max(0, 3 - state.favorites.length);
  if (remaining > 0) {
    continueLink.classList.add("disabled-link");
    continueLink.setAttribute("aria-disabled", "true");
    continueLink.textContent = `Choose ${remaining} more favorite${remaining === 1 ? "" : "s"} to continue`;
    return;
  }
  continueLink.classList.remove("disabled-link");
  continueLink.removeAttribute("aria-disabled");
  continueLink.textContent = "Add favorites to My Garage";
}

function renderFavoriteSummary() {
  const favoriteSummary = document.querySelector("#favoriteSummary");
  if (!favoriteSummary) return;
  const favorites = state.favorites.map(id => cars.find(car => car.id === id)).filter(Boolean);
  const categoryCounts = favorites.reduce((acc, car) => {
    acc[car.category] = (acc[car.category] || 0) + 1;
    return acc;
  }, {});
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category)
    .slice(0, 3);

  favoriteSummary.innerHTML = `
    <p class="eyebrow">Taste profile</p>
    <h3>${favorites.length ? `${favorites.length} favorite${favorites.length === 1 ? "" : "s"} selected` : "No favorites yet"}</h3>
    <p>${favorites.length ? "Your first pattern is forming from the models you chose." : "Choose a few cars that catch your eye. You can refine this later."}</p>
    <div class="lesson-card">
      <h4>What Veloce sees</h4>
      <p>${topCategories.length ? `You are leaning toward ${topCategories.join(", ")}.` : "Your category lean will appear here once you pick favorites."}</p>
      <p>${favorites.length >= 3 ? "You have enough signal to continue into My Garage." : "Pick at least three favorites before moving to My Garage."}</p>
    </div>
    <div class="mini-car-list">
      ${favorites.map(car => `
        <button type="button" data-car="${car.id}">
          <span>${car.make} ${car.model}</span>
          <small>${car.category} · ${car.vibe}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function renderFavoritePicker() {
  const favoriteGrid = document.querySelector("#favoriteGrid");
  if (!favoriteGrid) return;
  const ranked = [...cars].sort((a, b) => carScoreForProfile(b) - carScoreForProfile(a));
  favoriteGrid.innerHTML = ranked.map(car => {
    const vehicle = vehicleForCar(car);
    const image = displayImageForVehicle(car.id, "thumbnail");
    return `
      <article class="car-card favorite-card">
        <img src="${image}" alt="${vehicle?.imageMeta?.alt || vehicle?.displayName || car.imageAlt}" loading="lazy" data-vehicle-id="${car.id}" />
        <div class="car-body">
          <p class="meta">${car.category} · ${car.region} · ${car.budget}</p>
          <h3>${vehicle?.displayName || `${car.make} ${car.model}`}</h3>
          <p>${car.vibe}</p>
          <div class="car-actions">
            <button class="save-button ${isFavorite(car.id) ? "saved" : ""}" data-favorite="${car.id}" type="button">${isFavorite(car.id) ? "Favorited" : "Favorite"}</button>
            <button class="card-button" data-car="${car.id}" type="button">Learn why</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
  renderFavoriteSummary();
  renderNoviceContinue();
}

function wireFavoritePicker() {
  const favoriteGrid = document.querySelector("#favoriteGrid");
  const favoriteSummary = document.querySelector("#favoriteSummary");
  if (!favoriteGrid) return;
  favoriteGrid.addEventListener("click", event => {
    const favoriteButton = event.target.closest("[data-favorite]");
    const profileButton = event.target.closest("[data-car]");
    if (favoriteButton) {
      toggleFavorite(favoriteButton.dataset.favorite);
      return;
    }
    if (profileButton) {
      const selected = cars.find(car => car.id === profileButton.dataset.car);
      if (selected) renderProfile(selected);
    }
  });

  favoriteSummary?.addEventListener("click", event => {
    const button = event.target.closest("[data-car]");
    if (!button) return;
    const selected = cars.find(car => car.id === button.dataset.car);
    if (selected) renderProfile(selected);
  });

  renderFavoritePicker();
}

function wireNoviceContinue() {
  const continueLink = document.querySelector("#noviceContinue");
  if (!continueLink) return;
  continueLink.addEventListener("click", event => {
    if (state.favorites.length < 3) {
      event.preventDefault();
      return;
    }
    addFavoritesToGarage();
  });
  renderNoviceContinue();
}

function saveGarage() {
  localStorage.setItem("veloceGarage", JSON.stringify(state.garage));
}

function isInGarage(id) {
  return state.garage.includes(id);
}

function toggleGarage(id) {
  state.garage = isInGarage(id)
    ? state.garage.filter(savedId => savedId !== id)
    : [...state.garage, id];
  saveGarage();
  renderGarage();
  renderCars();
  renderFavoritePicker();
  renderDigestGarageCarousel();
}

function garageItemTitle(id) {
  const car = cars.find(item => item.id === id);
  const vehicle = window.getVehicle?.(id);
  return vehicle?.displayName || (car ? `${car.make} ${car.model}` : "this car");
}

function removeGarageItem(id) {
  state.garage = state.garage.filter(savedId => savedId !== id);
  saveGarage();
  if (pageName() === "garage") document.querySelector("#profileDialog")?.close();
  renderGarage();
  renderCars();
  renderFavoritePicker();
  renderDigestGarageCarousel();
}

function requestGarageRemoval(id) {
  pendingGarageRemovalId = id;
  const dialog = document.querySelector("#removeGarageDialog");
  const copy = document.querySelector("#removeGarageCopy");
  if (!dialog) {
    removeGarageItem(id);
    return;
  }
  if (copy) {
    copy.textContent = `Remove ${garageItemTitle(id)} from My Garage? You can add it again from Model Library later.`;
  }
  if (!dialog.open) dialog.showModal();
}

function wireGarageRemovalDialog() {
  const dialog = document.querySelector("#removeGarageDialog");
  if (!dialog) return;
  document.querySelector("#cancelGarageRemove")?.addEventListener("click", () => {
    pendingGarageRemovalId = "";
    dialog.close();
  });
  document.querySelector("#confirmGarageRemove")?.addEventListener("click", () => {
    if (pendingGarageRemovalId) removeGarageItem(pendingGarageRemovalId);
    pendingGarageRemovalId = "";
    dialog.close();
  });
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    pendingGarageRemovalId = "";
    dialog.close();
  });
}

function renderGarage() {
  const savedCars = garageDisplayItems();
  const garageGrid = document.querySelector("#garageGrid");
  if (!garageGrid) return;
  if (!savedCars.length) {
    garageGrid.innerHTML = `
      <article class="empty-garage">
        <h3>Your garage is empty.</h3>
        <p>Use the save buttons in the Model Library to build a personal watchlist of cars you want to learn, compare, or follow.</p>
      </article>
    `;
    return;
  }

  garageGrid.innerHTML = savedCars.map(({ id, car, vehicle }) => {
    const image = displayImageForVehicle(id, "thumbnail");
    const title = vehicle?.displayName || `${car.make} ${car.model}`;
    const meta = car ? `${car.category} · ${car.budget}` : `${vehicle.categories?.[0] || "Collector car"} · ${vehicle.marketTier}`;
    const summary = car?.vibe || vehicle?.shortDescription || "Saved collector interest.";
    return `
      <article class="garage-card">
        <img src="${image}" alt="${vehicle?.imageMeta?.alt || title}" loading="lazy" data-vehicle-id="${id}" />
        <div>
          <p class="meta">${meta}</p>
          <h3>${title}</h3>
          <p>${summary}</p>
          <div class="garage-card-actions">
            ${car ? `<button class="card-button" data-car="${id}">Open profile</button>` : `<a class="card-button" href="digest.html">View digest</a>`}
            <button class="save-button saved" data-save="${id}" type="button">Saved</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function wireGarage() {
  const garageGrid = document.querySelector("#garageGrid");
  const clearGarage = document.querySelector("#clearGarage");
  if (!garageGrid) return;
  garageGrid.addEventListener("click", event => {
    const profileButton = event.target.closest("[data-car]");
    const saveButton = event.target.closest("[data-save]");
    if (saveButton) {
      requestGarageRemoval(saveButton.dataset.save);
      return;
    }
    if (profileButton) {
      const selected = cars.find(car => car.id === profileButton.dataset.car);
      if (selected) renderProfile(selected);
    }
  });

  clearGarage?.addEventListener("click", () => {
    state.garage = [];
    saveGarage();
    renderGarage();
    renderCars();
    renderDigestGarageCarousel();
  });

  renderGarage();
}

function renderFilters() {
  const filterEl = document.querySelector("#filters");
  const searchInput = document.querySelector("#searchInput");
  const tabEl = document.querySelector("#exploreTabs");
  const sortSelect = document.querySelector("#sortSelect");
  if (!filterEl || !searchInput) return;
  const tabs = [
    "All",
    "Analog Supercars",
    "Blue-Chip Classics",
    "Modern Collectibles",
    "JDM Icons",
    "Homologation",
    "Porsche/German",
    "American",
    "Grand Tourers",
    "Under $100k",
    "$100k-$500k",
    "$500k-$1M",
    "$1M+",
    "Video Profiles"
  ];
  if (tabEl) {
    tabEl.innerHTML = tabs.map(tab => `<button class="${state.filters.exploreTab === tab ? "active" : ""}" type="button" data-explore-tab="${tab}">${tab}</button>`).join("");
    if (!tabEl.dataset.wired) {
      tabEl.dataset.wired = "true";
      tabEl.addEventListener("click", event => {
        const button = event.target.closest("[data-explore-tab]");
        if (!button) return;
        state.filters.exploreTab = button.dataset.exploreTab;
        renderFilters();
        renderCars();
      });
    }
  }
  if (sortSelect) {
    sortSelect.value = state.filters.sort;
    if (!sortSelect.dataset.wired) {
      sortSelect.dataset.wired = "true";
      sortSelect.addEventListener("change", event => {
        state.filters.sort = event.target.value;
        renderCars();
      });
    }
  }
  const fields = [
    ["region", "Region"],
    ["era", "Era"],
    ["bodyStyle", "Body"]
  ];
  filterEl.innerHTML = fields.map(([key, label]) => {
    const options = ["All", ...new Set(cars.map(car => car[key]))].sort((a, b) => a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b));
    return `
      <label class="search-label">
        <span>${label}</span>
        <select data-filter="${key}">
          ${options.map(option => `<option value="${option}">${option}</option>`).join("")}
        </select>
      </label>
    `;
  }).join("");

  filterEl.addEventListener("change", event => {
    const key = event.target.dataset.filter;
    if (!key) return;
    state.filters[key] = event.target.value;
    renderCars();
  });

  searchInput.addEventListener("input", event => {
    state.search = event.target.value.toLowerCase();
    renderCars();
  });
}

function filteredCars() {
  const tab = state.filters.exploreTab;
  const tabMatches = car => {
    const categories = car.categories || [];
    if (tab === "All") return true;
    if (tab === "Video Profiles") return hasVehicleVideo(car.id);
    if (["Under $100k", "$100k-$500k", "$500k-$1M", "$1M+"].includes(tab)) return car.marketTier === tab;
    const map = {
      "Analog Supercars": "analog-supercar",
      "Blue-Chip Classics": "blue-chip",
      "Modern Collectibles": "modern-collectible",
      "JDM Icons": "jdm-icon",
      Homologation: "homologation",
      "Porsche/German": "porsche-german",
      American: "american-collector",
      "Grand Tourers": "grand-tourer"
    };
    const slug = map[tab];
    if (slug === "modern-collectible") return categories.includes("modern-collectible") || categories.includes("modern-classic") || categories.includes("modern-supercar");
    if (slug === "porsche-german") return categories.includes("porsche-german") || ["Porsche", "BMW", "Mercedes-Benz", "Mercedes-AMG", "Audi"].includes(car.make);
    if (slug === "american-collector") return categories.includes("american-collector") || categories.includes("american-performance") || car.region === "United States";
    if (slug === "blue-chip") return categories.includes("blue-chip") || categories.includes("vintage-classic");
    return categories.includes(slug);
  };
  return cars.filter(car => {
    const haystack = [
      car.make,
      car.model,
      car.years,
      car.category,
      car.region,
      car.era,
      car.budget,
      car.marketTier,
      car.bodyStyle,
      car.vibe,
      car.summary,
      car.note,
      ...(car.categories || []),
      ...(car.tags || [])
    ].join(" ").toLowerCase();
    const matchesSearch = haystack.includes(state.search);
    const matchesFilters = Object.entries(state.filters).every(([key, value]) => {
      if (["exploreTab", "sort", "category", "budget"].includes(key)) return true;
      return value === "All" || car[key] === value;
    });
    return tabMatches(car) && matchesSearch && matchesFilters;
  });
}

function profileRelevanceScore(car) {
  let score = 0;
  const make = car.make.toLowerCase();
  const categories = `${car.category} ${(car.categories || []).join(" ")}`.toLowerCase();
  const tags = `${(car.tags || []).join(" ")} ${car.vibe} ${car.summary}`.toLowerCase();
  userProfile.favoriteMakes?.forEach(favorite => {
    if (favorite && favorite !== "Other / Custom input" && make.includes(favorite.toLowerCase())) score += 10;
  });
  const categoryAliases = {
    "analog-supercars": "analog-supercar",
    "modern-supercars": "modern-supercar",
    "vintage-classics": "vintage-classic",
    "race-cars": "motorsport",
    "gt-cars": "grand-tourer",
    "sports-cars": "sports-car",
    "jdm-icons": "jdm-icon",
    "luxury-grand-tourers": "grand-tourer",
    "homologation-specials": "homologation",
    youngtimers: "youngtimer"
  };
  userProfile.categories?.forEach(category => {
    const normalized = category.toLowerCase().replace(/\s*\/\s*/g, " ").replace(/\s+/g, "-");
    const alias = categoryAliases[normalized] || normalized;
    if (categories.includes(alias) || categories.includes(normalized) || categories.includes(category.toLowerCase())) score += 7;
    if (tags.includes(category.toLowerCase())) score += 3;
  });
  userProfile.eras?.forEach(era => {
    if (car.era.toLowerCase().includes(era.toLowerCase().replace("–", "-"))) score += 5;
  });
  if (userProfile.budgetBand && car.marketTier === userProfile.budgetBand) score += 8;
  userProfile.contentPreferences?.forEach(pref => {
    if (/market|auction|analysis|comparable/i.test(pref) && /blue-chip|modern-collectible|analog-supercar/i.test(categories)) score += 2;
  });
  return score;
}

function sortCarsForExplore(items) {
  const marketOrder = {
    "Under $100k": 1,
    "$100k-$500k": 2,
    "$500k-$1M": 3,
    "$1M+": 4,
    "Market varies": 5
  };
  const compare = (a, b) => {
    if (state.filters.sort === "az") return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`);
    if (state.filters.sort === "market") return (marketOrder[a.marketTier] || 9) - (marketOrder[b.marketTier] || 9) || `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`);
    if (state.filters.sort === "era") return (a.yearStart || Number(a.years.slice(0, 4)) || 9999) - (b.yearStart || Number(b.years.slice(0, 4)) || 9999);
    if (state.filters.sort === "relevance") return profileRelevanceScore(b) - profileRelevanceScore(a) || a.addedIndex - b.addedIndex;
    if (state.filters.sort === "recent") return b.addedIndex - a.addedIndex;
    return a.addedIndex - b.addedIndex;
  };
  return [...items].sort((a, b) => {
    const garageRank = Number(isInGarage(b.id)) - Number(isInGarage(a.id));
    return garageRank || compare(a, b);
  });
}

function renderCars() {
  const carGrid = document.querySelector("#carGrid");
  const resultCount = document.querySelector("#resultCount");
  if (!carGrid) return;
  const visible = sortCarsForExplore(filteredCars());
  if (resultCount) resultCount.textContent = `${visible.length} model${visible.length === 1 ? "" : "s"} shown`;
  carGrid.innerHTML = visible.map(car => {
    const vehicle = vehicleForCar(car);
    const image = displayImageForVehicle(car.id, "thumbnail");
    return `
      <article class="car-card ${isInGarage(car.id) ? "garage-highlight" : ""}">
        <img src="${image}" alt="${vehicle?.imageMeta?.alt || vehicle?.displayName || car.imageAlt}" loading="lazy" data-vehicle-id="${car.id}" />
        <div class="car-body">
        <p class="meta">${car.category} · ${car.region} · ${car.marketTier || car.budget}</p>
          <h3>${vehicle?.displayName || `${car.make} ${car.model}`}</h3>
          ${isInGarage(car.id) ? `<p class="garage-sheen-label">In My Garage</p>` : ""}
          ${hasVehicleVideo(car.id) ? `<p class="video-available-label">Video profile available</p>` : ""}
          <p>${car.summary}</p>
          <p class="image-credit">${imageCreditMarkup(car)}</p>
          <div class="car-actions">
            <button class="card-button" data-car="${car.id}">Open profile</button>
            <button class="save-button ${isInGarage(car.id) ? "saved" : ""}" data-save="${car.id}" type="button">${isInGarage(car.id) ? "Saved" : "Save"}</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function labelize(value) {
  return String(value || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

function compactList(values = [], limit = 6) {
  return values.filter(Boolean).slice(0, limit);
}

function marketSourcesForVehicle(vehicle) {
  const marketData = vehicle?.marketData || {};
  return [
    marketData.classicComMarketUrl ? {
      label: "CLASSIC.COM market page",
      source: "CLASSIC.COM",
      url: marketData.classicComMarketUrl,
      description: "Open the model market/search page for available real listings, sales references, and source context."
    } : null,
    marketData.hagertyValuationUrl ? {
      label: "Hagerty Valuation Tools",
      source: "Hagerty",
      url: marketData.hagertyValuationUrl,
      description: "Use Hagerty's valuation tool as an external reference when this model is supported."
    } : null,
    ...(marketData.otherMarketUrls || []).map(item => ({
      label: item.label,
      source: item.label,
      url: item.url,
      description: "External market source search. Verify listing details, dates, and sale status at the source."
    }))
  ].filter(item => item?.url);
}

function renderSourceChips(sources = []) {
  if (!sources.length) return "";
  return `
    <div class="market-source-chips">
      ${sources.map(source => `<span>${escapeHtml(source.source || source.label)}</span>`).join("")}
    </div>
  `;
}

function renderMarketIntelligencePanel(vehicle, car) {
  const marketData = vehicle?.marketData || {};
  const sources = marketSourcesForVehicle(vehicle);
  const fullMarketUrl = marketData.classicComMarketUrl || sources[0]?.url || "https://www.classic.com/";

  if (marketData.classicComEmbedUrl) {
    return `
      <section class="profile-section market-intelligence-panel">
        <div class="profile-section-header">
          <div>
            <p class="eyebrow">Real sourced data only</p>
            <h3>Market Intelligence</h3>
          </div>
          ${renderSourceChips(sources)}
        </div>
        <p class="market-note">Market chart from CLASSIC.COM. Veloce embeds the source module directly and does not create its own valuation graph.</p>
        <div class="market-chart-frame">
          <iframe src="${escapeHtml(marketData.classicComEmbedUrl)}" title="${escapeHtml(vehicle?.displayName || car.model)} market chart from CLASSIC.COM" loading="lazy"></iframe>
        </div>
        <a class="source-link market-cta" href="${escapeHtml(fullMarketUrl)}" target="_blank" rel="noopener">View full market page</a>
      </section>
    `;
  }

  if (sources.length) {
    return `
      <section class="profile-section market-intelligence-panel">
        <div class="profile-section-header">
          <div>
            <p class="eyebrow">Real sourced data only</p>
            <h3>Market Intelligence</h3>
          </div>
          ${renderSourceChips(sources)}
        </div>
        <p class="market-note">Market data source available. Veloce is not showing prices or a graph because no verified embeddable feed is connected for this model yet.</p>
        <div class="market-source-grid">
          ${sources.map(source => `
            <article class="market-source-card">
              <span>${escapeHtml(source.source || "Market source")}</span>
              <h4>${escapeHtml(source.label)}</h4>
              <p>${escapeHtml(source.description)}</p>
              <a class="source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noopener">Open Market Source</a>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  return `
    <section class="profile-section market-intelligence-panel">
      <div class="profile-section-header">
        <div>
          <p class="eyebrow">Real sourced data only</p>
          <h3>Market Intelligence</h3>
        </div>
      </div>
      <div class="market-empty-state">
        <h4>No verified market data source connected for this model yet.</h4>
        <p>Veloce leaves this section blank rather than inventing pricing, sales history, or market movement.</p>
        <a class="source-link" href="https://www.classic.com/" target="_blank" rel="noopener">Explore related market data</a>
      </div>
    </section>
  `;
}

function renderIdentityGrid(vehicle, car) {
  const facts = [
    ["Make", vehicle?.make || car.make],
    ["Model", vehicle?.model || car.model],
    ["Years", vehicle?.yearRange || car.years],
    ["Country", vehicle?.country || car.region],
    ["Era", vehicle?.era || car.era],
    ["Body", car.bodyStyle],
    ["Drivetrain", car.specs?.drivetrain],
    ["Market tier", vehicle?.marketTier || car.marketTier]
  ].filter(([, value]) => value && value !== "Not listed");

  return `
    <section class="profile-section">
      <div class="profile-section-header">
        <div>
          <p class="eyebrow">Identity</p>
          <h3>Specification Snapshot</h3>
        </div>
      </div>
      <dl class="identity-grid">
        ${facts.map(([label, value]) => `
          <div class="identity-card">
            <dt>${escapeHtml(label)}</dt>
            <dd>${escapeHtml(value)}</dd>
          </div>
        `).join("")}
      </dl>
    </section>
  `;
}

function renderAttributeTags(vehicle, car) {
  const attributes = compactList([...(vehicle?.categories || []), ...(vehicle?.tags || []), car.vibe], 10);
  if (!attributes.length) return "";
  return `
    <div class="attribute-list">
      ${attributes.map(attribute => `<span>${escapeHtml(labelize(attribute))}</span>`).join("")}
    </div>
  `;
}

function renderRelatedVehicles(vehicle) {
  const related = (vehicle?.relatedVehicleIds || [])
    .map(id => window.getVehicle?.(id))
    .filter(Boolean)
    .slice(0, 4);
  if (!related.length) return "";
  return `
    <section class="profile-section related-profile-section">
      <div class="profile-section-header">
        <div>
          <p class="eyebrow">Adjacent studies</p>
          <h3>Related Cars</h3>
        </div>
      </div>
      <div class="related-vehicle-grid">
        ${related.map(item => `
          <article class="related-vehicle-card" data-related-car="${escapeHtml(item.id)}">
            <img src="${displayImageForVehicle(item.id, "thumbnail")}" alt="${escapeHtml(item.imageMeta?.alt || item.displayName)}" loading="lazy" data-vehicle-id="${escapeHtml(item.id)}" />
            <div>
              <span>${escapeHtml(item.yearRange)} / ${escapeHtml(item.country)}</span>
              <h4>${escapeHtml(item.displayName)}</h4>
              <p>${escapeHtml(item.marketTier || "Market varies")}</p>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderProfile(car) {
  const profileContent = document.querySelector("#profileContent");
  const dialog = document.querySelector("#profileDialog");
  if (!profileContent || !dialog) return;
  const vehicle = vehicleForCar(car);
  const image = displayImageForVehicle(car.id, "hero");
  const displayName = vehicle?.displayName || `${car.make} ${car.model}`;
  const quickFacts = [
    ["Years", vehicle?.yearRange || car.years],
    ["Country", vehicle?.country || car.region],
    ["Era", vehicle?.era || car.era],
    ["Tier", vehicle?.marketTier || car.marketTier]
  ];
  profileContent.innerHTML = `
    <article class="profile-dossier">
      <section class="profile-dossier-hero">
        <figure>
          <img src="${image}" alt="${vehicle?.imageMeta?.alt || vehicle?.displayName || car.imageAlt}" data-vehicle-id="${car.id}" />
        </figure>
        <div class="profile-dossier-overlay">
          <p class="eyebrow">${escapeHtml(car.category)}</p>
          <div class="profile-title-row">
            <h2 id="dialogTitle">${escapeHtml(displayName)}</h2>
            <button class="save-button profile-save ${isInGarage(car.id) ? "saved" : ""}" data-save="${car.id}" type="button">${isInGarage(car.id) ? "Saved in My Garage" : "Save to My Garage"}</button>
          </div>
          <p>${escapeHtml(vehicle?.shortDescription || car.summary)}</p>
          ${renderAttributeTags(vehicle, car)}
          <div class="profile-quick-facts">
            ${quickFacts.map(([label, value]) => `
              <div>
                <span>${escapeHtml(label)}</span>
                <strong>${escapeHtml(value)}</strong>
              </div>
            `).join("")}
          </div>
          <p class="image-credit">${imageCreditMarkup(car)}</p>
        </div>
      </section>
      <div class="profile-dossier-content">
        <section class="profile-section profile-overview-section">
          <div class="profile-section-header">
            <div>
              <p class="eyebrow">Collector dossier</p>
              <h3>Overview</h3>
            </div>
          </div>
          <div class="profile-overview-grid">
            <div>
              <h4>Why it matters</h4>
              <p>${escapeHtml(car.summary)}</p>
            </div>
            <div>
              <h4>Ownership lens</h4>
              <p><strong>${escapeHtml(car.vibe)}</strong></p>
              <p>${escapeHtml(car.note)}</p>
            </div>
          </div>
        </section>
        ${renderIdentityGrid(vehicle, car)}
        ${renderMarketIntelligencePanel(vehicle, car)}
        ${renderRelatedVehicles(vehicle)}
        ${renderVehicleVideoModule(car.id)}
        <section class="profile-section">
          <div class="profile-section-header">
            <div>
              <p class="eyebrow">References</p>
              <h3>Sources</h3>
            </div>
          </div>
          <ul class="source-list">
            ${car.citations.map(citation => `<li><a href="${escapeHtml(citation.url)}" target="_blank" rel="noopener">${escapeHtml(citation.label)}</a></li>`).join("")}
          </ul>
        </section>
        <section class="profile-section profile-scope-note">
          <p>Profiles stay at the model and generation level. Veloce does not invent pricing, auction records, production details, or vehicle-specific claims; use source links to verify live market information.</p>
        </section>
      </div>
    </article>
  `;
  if (!dialog.open) dialog.showModal();
}

async function hydrateImages() {
  cars.forEach(car => displayImageForVehicle(car.id, "thumbnail"));
  renderCars();
  renderGarage();
  renderFavoritePicker();
}

function wireDialog() {
  const carGrid = document.querySelector("#carGrid");
  const closeDialog = document.querySelector("#closeDialog");
  const profileDialog = document.querySelector("#profileDialog");
  carGrid?.addEventListener("click", event => {
    const saveButton = event.target.closest("[data-save]");
    const profileButton = event.target.closest("[data-car]");
    if (saveButton) {
      const id = saveButton.dataset.save;
      if (pageName() === "garage" && isInGarage(id)) {
        requestGarageRemoval(id);
        return;
      }
      toggleGarage(id);
      return;
    }
    if (!profileButton) return;
    const id = profileButton.dataset.car;
    const selected = cars.find(car => car.id === id);
    if (selected) renderProfile(selected);
  });

  closeDialog?.addEventListener("click", () => {
    profileDialog?.close();
  });

  profileDialog?.addEventListener("click", event => {
    const relatedCard = event.target.closest("[data-related-car]");
    if (relatedCard) {
      const selected = cars.find(car => car.id === relatedCard.dataset.relatedCar);
      if (selected) renderProfile(selected);
      return;
    }
    const saveButton = event.target.closest("[data-save]");
    if (!saveButton) return;
    const id = saveButton.dataset.save;
    if (pageName() === "garage" && isInGarage(id)) {
      requestGarageRemoval(id);
      return;
    }
    toggleGarage(id);
    const selected = cars.find(car => car.id === saveButton.dataset.save);
    if (selected) renderProfile(selected);
  });
}

function init() {
  normalizePrimaryNavigation();
  markActiveNavigation();
  wirePathStart();
  if (!enforcePathEntry()) return;
  renderPathStatus();
  if (pageName() === "start") return;
  renderDigest();
  renderMarket();
  renderLanes();
  wireOnboarding();
  wireProfileBuilder();
  wireFavoritePicker();
  wireNoviceContinue();
  wireGarage();
  wireGarageRemovalDialog();
  renderDigestGarageCarousel();
  renderFilters();
  renderCars();
  wireDialog();
  if (document.querySelector("#carGrid, #garageGrid, #favoriteGrid, #profileDialog")) hydrateImages();
}

init();
