/**
 * EcoScan AI - Tip Generator Utility
 * 
 * Generates personalized, actionable eco-tips based on waste classification categories.
 * Supports four categories: Recyclable, Compostable, Trash, and Unknown.
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

// Tip templates for each waste category
const tipTemplates = {
  Recyclable: [
    "Recycle this plastic bottle to save energy—repurpose it as a vase or storage container!",
    "Great find! Recycling this aluminum can saves 95% of the energy needed to make a new one.",
    "This cardboard can be recycled up to 7 times—flatten it first to save space in your recycling bin.",
    "Paper recycling tip: Remove any plastic tape or staples before putting this in your recycling bin.",
    "Glass containers like this can be recycled endlessly without losing quality—rinse it clean first!",
    "Plastic containers are perfect for organizing small items after you recycle the original contents.",
    "Metal items like this are highly valuable to recyclers—clean it and put it in your metal recycling bin."
  ],
  
  Compostable: [
    "Add this organic waste to your compost bin—it'll become nutrient-rich soil in 3-6 months!",
    "Food scraps like this create methane in landfills, but composting them helps reduce greenhouse gases.",
    "Perfect for composting! Mix with brown materials like dry leaves for the best decomposition.",
    "This organic material will feed beneficial microorganisms in your compost pile—nature's recycling!",
    "Composting this item returns valuable nutrients to the soil instead of wasting them in a landfill.",
    "Great compost material! Chop it into smaller pieces to speed up the decomposition process.",
    "This biodegradable item belongs in your green waste bin or home compost—it'll break down naturally!"
  ],
  
  Trash: [
    "This item goes to trash, but consider buying less packaging next time to reduce waste.",
    "Non-recyclable waste like this reminds us to choose reusable alternatives when possible.",
    "While this goes in the trash, look for similar products with less packaging in the future.",
    "This belongs in your general waste bin—try to minimize items like this by choosing sustainable alternatives.",
    "Trash disposal tip: Wrap this securely to prevent litter and consider eco-friendly alternatives next time.",
    "This item can't be recycled, but you can reduce future waste by choosing products with minimal packaging."
  ],
  
  Unknown: [
    "I'm not sure about this item—check your local recycling guidelines or ask your waste management provider.",
    "When in doubt, research this item online or contact your local environmental services for proper disposal.",
    "This item needs manual inspection—look for recycling symbols or check with your local waste facility."
  ]
};

/**
 * Generates a randomized, personalized eco-tip based on the waste classification category.
 * 
 * @param {string} category - The waste category: 'Recyclable', 'Compostable', 'Trash', or 'Unknown'
 * @returns {string} A personalized eco-tip with actionable advice
 * 
 * Requirements:
 * - 5.1: Generate tips that include category name and specific action
 * - 5.2: Recyclable tips focus on recycling benefits and reuse ideas
 * - 5.3: Compostable tips focus on composting benefits and organic waste handling
 * - 5.4: Trash tips focus on minimizing waste and disposal best practices
 * - 5.5: Unknown tips suggest manual inspection or research
 */
export const generateTip = (category) => {
  // Validate input category
  if (!category || typeof category !== 'string') {
    return tipTemplates.Unknown[0]; // Default fallback tip
  }
  
  // Normalize category name (handle case variations)
  const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  
  // Get tips for the category, fallback to Unknown if category not found
  const categoryTips = tipTemplates[normalizedCategory] || tipTemplates.Unknown;
  
  // Return a random tip from the category
  const randomIndex = Math.floor(Math.random() * categoryTips.length);
  return categoryTips[randomIndex];
};

/**
 * Gets all available tip categories.
 * 
 * @returns {string[]} Array of available categories
 */
export const getAvailableCategories = () => {
  return Object.keys(tipTemplates);
};

/**
 * Gets the number of tips available for a specific category.
 * 
 * @param {string} category - The waste category
 * @returns {number} Number of tips available for the category
 */
export const getTipCount = (category) => {
  const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  return tipTemplates[normalizedCategory]?.length || 0;
};

// Default export for convenience
export default {
  generateTip,
  getAvailableCategories,
  getTipCount
};