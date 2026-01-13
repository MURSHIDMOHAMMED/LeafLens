// Placeholder care tips data for different plant types
// This would eventually be replaced with a real API or database

export interface PlantCareData {
  plantType: string;
  sunlight: string;
  water: string;
  soil: string;
  problems: string[];
  tips: string[];
}

// Mock function to get care data based on plant name
// In a real app, this would query a database or API
export const getPlantCareData = (plantName: string, scientificName?: string): PlantCareData => {
  // Simple mock data - in reality, this would be more sophisticated
  const normalizedName = (plantName || '').toLowerCase();
  const normalizedScientific = (scientificName || '').toLowerCase();

  // Check for common plant categories
  if (normalizedName.includes('rose') || normalizedName.includes('tulip') || normalizedName.includes('lily')) {
    return {
      plantType: "Ornamental",
      sunlight: "Full Sun",
      water: "Moderate",
      soil: "Well-drained",
      problems: ["Aphid infestations", "Black spot disease", "Powdery mildew"],
      tips: ["Water at the base to avoid wet leaves", "Prune dead blooms regularly", "Apply mulch to retain moisture"]
    };
  }

  if (normalizedName.includes('mint') || normalizedName.includes('basil') || normalizedName.includes('oregano')) {
    return {
      plantType: "Edible",
      sunlight: "Partial Sun",
      water: "Regular",
      soil: "Moist, well-drained",
      problems: ["Root rot", "Leaf spot", "Aphids"],
      tips: ["Pinch back flowers to encourage leaf growth", "Harvest leaves regularly", "Keep soil consistently moist"]
    };
  }

  if (normalizedName.includes('aloe') || normalizedName.includes('snake plant') || normalizedName.includes('cactus')) {
    return {
      plantType: "Medicinal",
      sunlight: "Bright Indirect",
      water: "Low",
      soil: "Sandy, well-drained",
      problems: ["Root rot from overwatering", "Leaf burn", "Pests in humid conditions"],
      tips: ["Water only when soil is completely dry", "Use well-draining pots", "Avoid direct afternoon sun"]
    };
  }

  if (normalizedName.includes('ivy') || normalizedName.includes('pothos') || normalizedName.includes('philodendron')) {
    return {
      plantType: "Ornamental",
      sunlight: "Low to Bright Indirect",
      water: "Moderate",
      soil: "Well-drained potting mix",
      problems: ["Yellowing leaves", "Brown tips", "Root rot"],
      tips: ["Allow top inch of soil to dry between waterings", "Wipe leaves to remove dust", "Provide support for climbing varieties"]
    };
  }

  if (normalizedName.includes('fern') || normalizedScientific.includes('pteridophyta')) {
    return {
      plantType: "Ornamental",
      sunlight: "Low Light",
      water: "High",
      soil: "Moist, acidic",
      problems: ["Brown fronds", "Fungal diseases", "Pests"],
      tips: ["Keep soil consistently moist", "Mist regularly for humidity", "Avoid direct sunlight"]
    };
  }

  // Default fallback data
  return {
    plantType: "Ornamental",
    sunlight: "Partial Sun",
    water: "Moderate",
    soil: "Well-drained",
    problems: ["Yellowing leaves", "Brown spots"],
    tips: ["Water twice a week", "Avoid direct afternoon sun"]
  };
};