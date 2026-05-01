const wikipediaImageBase = "https://en.wikipedia.org/api/rest_v1/page/summary/";

const digestItems = [
  {
    title: "Porsche reveals a manual 911 GT3 S/C Cabriolet",
    source: "Car and Driver",
    url: "https://www.caranddriver.com/news/a71006465/2027-porsche-911-gt3-sc-revealed/",
    date: "2026-04-14",
    type: "Manufacturer news",
    tags: ["Porsche", "New model"],
    summary: "A new open-top GT3 variant keeps the naturally aspirated 4.0-liter flat-six and six-speed manual theme alive."
  },
  {
    title: "Next GT3 may face a turbocharged future",
    source: "Car and Driver",
    url: "https://www.caranddriver.com/news/a71140894/next-gen-porsche-911-gt3-turbocharged-possible/",
    date: "2026-04-27",
    type: "Industry signal",
    tags: ["Porsche", "Regulation"],
    summary: "Emissions pressure may reshape one of the defining modern analog performance cars."
  },
  {
    title: "Classic.com market pages track collector-car listings and auctions",
    source: "CLASSIC.COM",
    url: "https://www.classic.com/markets/",
    date: "Live source",
    type: "Market source",
    tags: ["Market", "Auctions"],
    summary: "A public starting point for model-level comps, listings, auctions, and market benchmarks."
  },
  {
    title: "Hemmings collector marketplace",
    source: "Hemmings",
    url: "https://www.hemmings.com/classifieds/cars-for-sale/",
    date: "Live source",
    type: "Marketplace",
    tags: ["Listings", "Classics"],
    summary: "Long-running collector-car marketplace with auctions, classifieds, and dealer inventory."
  },
  {
    title: "Bring a Trailer auctions",
    source: "Bring a Trailer",
    url: "https://bringatrailer.com/auctions/",
    date: "Live source",
    type: "Auction source",
    tags: ["Auctions", "Community"],
    summary: "Active enthusiast auction platform useful for checking recent public sale discussions and results."
  },
  {
    title: "Porsche says its 911 Cup car is being updated for 2026 racing",
    source: "Car and Driver",
    url: "https://www.caranddriver.com/news/a65447560/porsche-911-cup-car-updates/",
    date: "2025-07-18",
    type: "Motorsport",
    tags: ["Porsche", "Track"],
    summary: "Factory racing updates help explain how road-car credibility flows back into enthusiast interest."
  }
];

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

function car(make, model, years, category, region, era, budget, bodyStyle, vibe, summary, wikiTitle, wikiSlug, citationA, citationB, note) {
  const marketQuery = encodeURIComponent(`${make} ${model}`);
  return {
    id: `${make}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
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
    image: "",
    imageCredit: "Image: Wikimedia/Wikipedia page image, loaded from a real source when available.",
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

const state = {
  search: "",
  filters: {
    category: "All",
    region: "All",
    era: "All",
    budget: "All",
    bodyStyle: "All"
  }
};

const fallbackImage = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720">
  <rect width="1200" height="720" fill="#d8cabb"/>
  <path d="M210 460h780l-85-120H344z" fill="#201d1a"/>
  <circle cx="390" cy="492" r="54" fill="#f7f2ea"/>
  <circle cx="810" cy="492" r="54" fill="#f7f2ea"/>
  <text x="600" y="250" text-anchor="middle" font-family="Georgia, serif" font-size="70" fill="#b7332c">Veloce</text>
  <text x="600" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#675f58">Real source link available</text>
</svg>`);

function renderDigest() {
  document.querySelector("#digestGrid").innerHTML = digestItems.map(item => `
    <article class="digest-card">
      <div class="tag-row">
        <span class="tag">${item.type}</span>
        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
      </div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <p class="meta">${item.source} · ${item.date}</p>
      <a class="source-link" href="${item.url}" target="_blank" rel="noopener">Open source</a>
    </article>
  `).join("");
}

function renderMarket() {
  document.querySelector("#marketGrid").innerHTML = marketSources.map(source => `
    <article class="market-card">
      <h3>${source.name}</h3>
      <p>${source.text}</p>
      <a class="source-link" href="${source.url}" target="_blank" rel="noopener">Visit source</a>
    </article>
  `).join("");
}

function renderLanes() {
  document.querySelector("#laneGrid").innerHTML = lanes.map(lane => `
    <article class="lane">
      <h3>${lane.title}</h3>
      <p>${lane.text}</p>
    </article>
  `).join("");
}

function renderFilters() {
  const filterEl = document.querySelector("#filters");
  const fields = [
    ["category", "Category"],
    ["region", "Region"],
    ["era", "Era"],
    ["budget", "Budget"],
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

  document.querySelector("#searchInput").addEventListener("input", event => {
    state.search = event.target.value.toLowerCase();
    renderCars();
  });
}

function filteredCars() {
  return cars.filter(car => {
    const haystack = [
      car.make,
      car.model,
      car.years,
      car.category,
      car.region,
      car.era,
      car.budget,
      car.bodyStyle,
      car.vibe,
      car.summary,
      car.note
    ].join(" ").toLowerCase();
    const matchesSearch = haystack.includes(state.search);
    const matchesFilters = Object.entries(state.filters).every(([key, value]) => value === "All" || car[key] === value);
    return matchesSearch && matchesFilters;
  });
}

function renderCars() {
  const visible = filteredCars();
  document.querySelector("#resultCount").textContent = `${visible.length} model${visible.length === 1 ? "" : "s"} shown`;
  document.querySelector("#carGrid").innerHTML = visible.map(car => `
    <article class="car-card">
      <img src="${car.image || fallbackImage}" alt="${car.make} ${car.model}" loading="lazy" />
      <div class="car-body">
        <p class="meta">${car.category} · ${car.region} · ${car.budget}</p>
        <h3>${car.make} ${car.model}</h3>
        <p>${car.summary}</p>
        <p class="image-credit">${car.imageCredit}</p>
        <button class="card-button" data-car="${car.id}">Open profile</button>
      </div>
    </article>
  `).join("");
}

function renderProfile(car) {
  document.querySelector("#profileContent").innerHTML = `
    <div class="profile-hero">
      <figure>
        <img src="${car.image || fallbackImage}" alt="${car.make} ${car.model}" />
      </figure>
      <div class="profile-intro">
        <p class="eyebrow">${car.category}</p>
        <h2 id="dialogTitle">${car.make} ${car.model}</h2>
        <p>${car.summary}</p>
        <p class="image-credit">${car.imageCredit}</p>
      </div>
    </div>
    <div class="profile-content">
      <section class="profile-box">
        <h3>Verified profile facts</h3>
        <dl class="fact-list">
          <div><dt>Years</dt><dd>${car.years}</dd></div>
          <div><dt>Region</dt><dd>${car.region}</dd></div>
          <div><dt>Era</dt><dd>${car.era}</dd></div>
          <div><dt>Body</dt><dd>${car.bodyStyle}</dd></div>
          <div><dt>Drivetrain</dt><dd>${car.specs.drivetrain}</dd></div>
          <div><dt>Market</dt><dd>${car.specs.market}</dd></div>
        </dl>
      </section>
      <section class="profile-box">
        <h3>Ownership guidance</h3>
        <p><strong>Owner fit:</strong> ${car.vibe}</p>
        <p>${car.note}</p>
        <p>This is editorial guidance for model-level discovery, not a mechanical inspection or valuation.</p>
      </section>
      <section class="profile-box">
        <h3>Sources</h3>
        <ul class="source-list">
          ${car.citations.map(citation => `<li><a href="${citation.url}" target="_blank" rel="noopener">${citation.label}</a></li>`).join("")}
        </ul>
      </section>
      <section class="profile-box">
        <h3>Data boundary</h3>
        <p>No chassis numbers, no invented auction records, no generated vehicle images. Use the linked sources to verify live listings and recent sales.</p>
      </section>
    </div>
  `;
  document.querySelector("#profileDialog").showModal();
}

async function hydrateImages() {
  await Promise.all(cars.map(async car => {
    try {
      const response = await fetch(`${wikipediaImageBase}${encodeURIComponent(car.wikiSlug)}`);
      if (!response.ok) return;
      const data = await response.json();
      if (data.thumbnail?.source) {
        car.image = data.thumbnail.source.replace(/\/\d+px-/, "/800px-");
        car.imageCredit = `Image: ${car.wikiTitle} page image via Wikipedia/Wikimedia Commons.`;
      }
    } catch {
      car.image = "";
    }
  }));
  renderCars();
}

function wireDialog() {
  document.querySelector("#carGrid").addEventListener("click", event => {
    const id = event.target.dataset.car;
    if (!id) return;
    const selected = cars.find(car => car.id === id);
    if (selected) renderProfile(selected);
  });

  document.querySelector("#closeDialog").addEventListener("click", () => {
    document.querySelector("#profileDialog").close();
  });
}

function init() {
  renderDigest();
  renderMarket();
  renderLanes();
  renderFilters();
  renderCars();
  wireDialog();
  hydrateImages();
}

init();
