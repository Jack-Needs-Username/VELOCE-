window.VeloceMatcher = (() => {
  function normalize(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
  }

  function vehicleAliases(vehicle) {
    const aliases = new Set([
      vehicle.id,
      vehicle.make,
      vehicle.model,
      vehicle.displayName,
      `${vehicle.yearStart} ${vehicle.displayName}`,
      `${vehicle.yearEnd} ${vehicle.displayName}`,
      ...(vehicle.aliases || []),
      ...(vehicle.tags || []),
      ...(vehicle.categories || [])
    ]);

    if (vehicle.model.includes("Carrera GT")) aliases.add("CGT");
    if (vehicle.model.includes("GT-R")) aliases.add("GTR");
    if (vehicle.model.includes("911")) aliases.add("Porsche 911");
    if (vehicle.model.includes("F40")) aliases.add("F40");
    if (vehicle.model.includes("F50")) aliases.add("F50");
    if (vehicle.model.includes("NSX")) aliases.add("NSX");
    if (vehicle.model.includes("LFA")) aliases.add("LFA");

    return [...aliases].map(normalize).filter(alias => alias.length > 1);
  }

  function matchVehicles(text, options = {}) {
    const haystack = normalize(text);
    if (!haystack) return [];
    return (window.veloceVehicleLibrary || [])
      .map(vehicle => {
        let score = 0;
        const aliases = vehicleAliases(vehicle);
        aliases.forEach(alias => {
          if (!alias) return;
          if (haystack.includes(alias)) score += alias === normalize(vehicle.displayName) ? 12 : 4;
        });
        if (haystack.includes(normalize(vehicle.make)) && haystack.includes(normalize(vehicle.model))) score += 14;
        if (options.includeRelated) {
          vehicle.relatedVehicleIds?.forEach(id => {
            const related = window.getVehicle?.(id);
            if (related && haystack.includes(normalize(related.displayName))) score += 3;
          });
        }
        return { vehicle, score };
      })
      .filter(match => match.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  function annotateItem(item, titleKey = "headline") {
    const text = [
      item[titleKey],
      item.title,
      item.excerpt,
      item.summary,
      item.rawText,
      ...(item.tags || [])
    ].join(" ");
    const matches = matchVehicles(text);
    const primary = matches[0]?.vehicle;
    return {
      ...item,
      vehicleId: item.vehicleId || primary?.id,
      relatedVehicleIds: [...new Set([...(item.relatedVehicleIds || []), ...matches.slice(1, 6).map(match => match.vehicle.id)])],
      detectedMakes: [...new Set(matches.map(match => match.vehicle.make))],
      detectedModels: [...new Set(matches.map(match => match.vehicle.model))],
      matchScore: matches[0]?.score || 0
    };
  }

  function garageVehicles() {
    return JSON.parse(localStorage.getItem("veloceGarage") || "[]")
      .map(id => window.getVehicle?.(id))
      .filter(Boolean);
  }

  function userProfile() {
    try {
      return JSON.parse(localStorage.getItem("veloceUserProfile") || "{}");
    } catch {
      return {};
    }
  }

  function rankForUser(item) {
    const garage = garageVehicles();
    const profile = userProfile();
    let score = item.matchScore || 0;
    const ids = [item.vehicleId, ...(item.relatedVehicleIds || [])].filter(Boolean);
    garage.forEach(vehicle => {
      if (ids.includes(vehicle.id)) score += item.vehicleId === vehicle.id ? 35 : 18;
      if (item.detectedMakes?.includes(vehicle.make)) score += 6;
      vehicle.categories?.forEach(category => {
        if ((item.tags || []).map(normalize).includes(normalize(category))) score += 4;
      });
    });
    profile.favoriteMakes?.forEach(make => {
      if (item.detectedMakes?.some(found => normalize(found) === normalize(make))) score += 8;
    });
    profile.categories?.forEach(category => {
      if ([...(item.tags || []), item.rawText || "", item.excerpt || ""].join(" ").toLowerCase().includes(normalize(category))) score += 3;
    });
    return score;
  }

  function reasonForItem(item) {
    const garage = garageVehicles();
    const ids = [item.vehicleId, ...(item.relatedVehicleIds || [])].filter(Boolean);
    const exact = garage.find(vehicle => ids.includes(vehicle.id));
    if (exact) return `Because you saved ${exact.displayName}`;
    if (item.vehicleId) return `Matched to ${window.getVehicle?.(item.vehicleId)?.displayName || item.vehicleId}`;
    if (item.detectedMakes?.length) return `Detected ${item.detectedMakes.slice(0, 2).join(", ")} in the source`;
    return "No garage match detected";
  }

  function sort(items) {
    return [...items].sort((a, b) => rankForUser(b) - rankForUser(a));
  }

  return { normalize, vehicleAliases, matchVehicles, annotateItem, garageVehicles, userProfile, rankForUser, reasonForItem, sort };
})();
