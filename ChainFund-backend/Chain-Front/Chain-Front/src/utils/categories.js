// Category mappings for sustainability focus areas
export const SUSTAINABILITY_CATEGORIES = {
  "solar-renewable-energy": "Solar & Renewable Energy",
  "ocean-cleanup-marine": "Ocean Cleanup & Marine",
  "regenerative-agriculture": "Regenerative Agriculture",
  "carbon-capture-climate": "Carbon Capture & Climate",
  "biodiversity-wildlife": "Biodiversity & Wildlife",
  "sustainable-transportation": "Sustainable Transportation",
  "circular-economy-waste": "Circular Economy & Waste",
  "green-building-infrastructure": "Green Building & Infrastructure",
};

export const getCategoryDisplayName = (category) => {
  return SUSTAINABILITY_CATEGORIES[category] || category;
};

export const getAllCategories = () => {
  return Object.keys(SUSTAINABILITY_CATEGORIES);
};

export const getCategoryOptions = () => {
  return Object.entries(SUSTAINABILITY_CATEGORIES).map(([value, label]) => ({
    value,
    label,
  }));
};