import { db } from "./index";
import * as schema from "./schema";
import { eq } from "drizzle-orm";
import { extraTemplates } from "./extra-templates";

async function seed() {
  console.log("🌱 Seeding database with OWNER-APPROVED structure...");

  // 1. Clear existing data
  console.log("🧹 Clearing old data...");
  await db.delete(schema.recipeTemplates).execute();
  await db.delete(schema.flavorProfiles).execute();
  await db.delete(schema.cookingMethods).execute();
  await db.delete(schema.proteins).execute();
  await db.delete(schema.categories).execute();

  // 2. Categories
  const categoriesData = [
    { id: "cat_beef", name: "Beef", slug: "beef", icon: "🥩", description: "Prime cuts of beef and ground brisket", sortOrder: 1 },
    { id: "cat_pork", name: "Pork", slug: "pork", icon: "🐷", description: "Succulent pork shoulder, ribs, and chops", sortOrder: 2 },
    { id: "cat_poultry", name: "Poultry", slug: "poultry", icon: "🍗", description: "Whole birds and popular chicken cuts", sortOrder: 3 },
    { id: "cat_seafood", name: "Seafood", slug: "seafood", icon: "🐟", description: "Fresh fish and shellfish for the grill", sortOrder: 4 },
    { id: "cat_vegetables", name: "Vegetables", slug: "vegetables", icon: "🥦", description: "Hearty vegetables and meat alternatives", sortOrder: 5 },
  ];

  for (const c of categoriesData) {
    await db.insert(schema.categories).values(c).onConflictDoNothing();
  }
  console.log("✅ Categories seeded");

  // 3. Proteins (Owner-Approved List)
  const proteinsData = [
    // Beef
    { id: "p_brisket", categoryId: "cat_beef", name: "Brisket", slug: "brisket", icon: "🥩", description: "Whole packer brisket", sortOrder: 1 },
    { id: "p_steak", categoryId: "cat_beef", name: "Steak", slug: "steak", icon: "🥩", description: "Beef steak cuts", sortOrder: 2 },
    { id: "p_burgers", categoryId: "cat_beef", name: "Burgers", slug: "burgers", icon: "🍔", description: "Beef or turkey patties", sortOrder: 3 },
    // Pork
    { id: "p_pork_butt", categoryId: "cat_pork", name: "Pork Butt", slug: "pork-butt", icon: "🐷", description: "Ideal for pulled pork", sortOrder: 1 },
    { id: "p_ribs", categoryId: "cat_pork", name: "Ribs", slug: "ribs", icon: "🥓", description: "Pork spare ribs or baby backs", sortOrder: 2 },
    // Poultry
    { id: "p_chicken", categoryId: "cat_poultry", name: "Chicken", slug: "chicken", icon: "🍗", description: "Whole chicken or parts", sortOrder: 1 },
    { id: "p_turkey", categoryId: "cat_poultry", name: "Turkey", slug: "turkey", icon: "🦃", description: "Whole turkey or breast", sortOrder: 2 },
    // Seafood
    { id: "p_salmon", categoryId: "cat_seafood", name: "Salmon", slug: "salmon", icon: "🐟", description: "Fresh Atlantic salmon", sortOrder: 1 },
    { id: "p_shrimp", categoryId: "cat_seafood", name: "Shrimp", slug: "shrimp", icon: "🦐", description: "Jumbo shrimp or prawns", sortOrder: 2 },
    // Vegetables
    { id: "p_veg_mixed", categoryId: "cat_vegetables", name: "Mixed Veggies", slug: "mixed-veggies", icon: "🥗", description: "Seasonal vegetable medley", sortOrder: 1 },
  ];

  for (const p of proteinsData) {
    await db.insert(schema.proteins).values(p).onConflictDoNothing();
  }
  console.log("✅ Proteins seeded");

  // 4. Cooking Methods
  const methodsData = [
    { id: "m_smoker", name: "Smoker", slug: "smoker", icon: "🔥", description: "Offset, vertical, or drum smoker", defaultTempF: 225, sortOrder: 1 },
    { id: "m_pellet_grill", name: "Pellet Grill", slug: "pellet-grill", icon: "🔥", description: "Wood pellet grill/smoker", defaultTempF: 250, sortOrder: 2 },
    { id: "m_charcoal_grill", name: "Charcoal Grill", slug: "charcoal-grill", icon: "🔥", description: "Kettle or kamado charcoal grill", defaultTempF: 350, sortOrder: 3 },
    { id: "m_gas_grill", name: "Gas Grill", slug: "gas-grill", icon: "🔥", description: "Propane or natural gas grill", defaultTempF: 400, sortOrder: 4 },
    { id: "m_oven", name: "Oven", slug: "oven", icon: "🔥", description: "Standard kitchen oven", defaultTempF: 350, sortOrder: 5 },
  ];

  for (const m of methodsData) {
    await db.insert(schema.cookingMethods).values(m).onConflictDoNothing();
  }
  console.log("✅ Cooking methods seeded");

  // 5. Flavor Profiles (Owner-Approved List)
  const flavorsData = [
    { id: "f_sweet_smoky", name: "Sweet & Smoky", slug: "sweet-smoky", icon: "🍯", description: "Classic BBQ with brown sugar and hickory notes", sortOrder: 1 },
    { id: "f_spicy", name: "Spicy", slug: "spicy", icon: "🌶️", description: "Bold heat from cayenne, chipotle, and peppers", sortOrder: 2 },
    { id: "f_tangy", name: "Tangy", slug: "tangy", icon: "🍋", description: "Bright vinegar, citrus, or mustard-based flavors", sortOrder: 3 },
    { id: "f_savory_herb", name: "Savory Herb", slug: "savory-herb", icon: "🌿", description: "Savory blend of roasted garlic and fresh garden herbs", sortOrder: 4 },
    { id: "f_texas_classic", name: "Texas Classic", slug: "texas-classic", icon: "🤠", description: "Pure salt and heavy black pepper, brisket style", sortOrder: 5 },
  ];

  for (const f of flavorsData) {
    await db.insert(schema.flavorProfiles).values(f).onConflictDoNothing();
  }
  console.log("✅ Flavor profiles seeded");

  // 6. Recipe Templates (At least one rub, marinade, and brine per category/protein)
  const templates = [
    // Beef - Brisket
    {
      id: crypto.randomUUID(),
      title: "Texas Classic Smoked Brisket",
      proteinId: "p_brisket",
      cookingMethodId: "m_smoker",
      flavorProfileId: "f_texas_classic",
      recipeType: "dry_rub" as const,
      ingredients: [
        "1 whole packer brisket (12-14 lbs)",
        "1/2 cup coarse black pepper (16 mesh)",
        "1/2 cup kosher salt",
        "1/4 cup granulated garlic",
        "Beef tallow for wrapping"
      ],
      instructions: [
        "Trim brisket fat cap to 1/4 inch.",
        "Mix salt, pepper, and garlic; coat brisket liberally.",
        "Smoke at 225°F with post oak until internal temp is 165°F.",
        "Wrap in butcher paper with beef tallow.",
        "Continue smoking until 203°F internal and probe tender.",
        "Rest in a cooler for at least 3 hours."
      ],
      prepTime: "45 min",
      cookTime: "12 hours",
      restingTime: "3 hours",
      targetTempF: 203,
      woodPairings: ["Post Oak", "Hickory"],
      sauceRecommendations: ["None"],
      sideRecommendations: ["Pickles", "Onions", "White bread"],
      cookingTips: ["Patience is key. The rest is non-negotiable."]
    },
    // Beef - Steak
    {
      id: crypto.randomUUID(),
      title: "Savory Herb Marinated Ribeye",
      proteinId: "p_steak",
      cookingMethodId: "m_charcoal_grill",
      flavorProfileId: "f_savory_herb",
      recipeType: "marinade" as const,
      ingredients: [
        "2 large ribeye steaks",
        "1/4 cup olive oil",
        "3 cloves garlic, minced",
        "1 tbsp fresh rosemary, chopped",
        "1 tbsp fresh thyme, chopped",
        "2 tbsp Worcestershire sauce",
        "Salt and pepper"
      ],
      instructions: [
        "Mix oil, garlic, herbs, and Worcestershire.",
        "Marinate steaks for 2-4 hours in the fridge.",
        "Preheat grill to high heat.",
        "Sear steaks for 4-5 minutes per side for medium-rare.",
        "Rest for 10 minutes before slicing."
      ],
      prepTime: "2 hours",
      cookTime: "10 min",
      restingTime: "10 min",
      targetTempF: 135,
      woodPairings: ["Oak"],
      sauceRecommendations: ["Garlic butter"],
      sideRecommendations: ["Baked potato", "Asparagus"],
      cookingTips: ["Take steaks out of the fridge 30 mins before grilling."]
    },
    // Beef - Burgers
    {
      id: crypto.randomUUID(),
      title: "Sweet & Smoky Grilled Burgers",
      proteinId: "p_burgers",
      cookingMethodId: "m_gas_grill",
      flavorProfileId: "f_sweet_smoky",
      recipeType: "dry_rub" as const,
      ingredients: [
        "2 lbs 80/20 ground beef",
        "2 tbsp brown sugar",
        "1 tbsp smoked paprika",
        "1 tsp onion powder",
        "1 tsp garlic powder",
        "1 tsp salt",
        "1/2 tsp black pepper"
      ],
      instructions: [
        "Gently form beef into 4-6 patties.",
        "Mix rub ingredients and sprinkle on both sides of patties.",
        "Grill over medium-high heat for 5 minutes per side.",
        "Toast buns and serve with your favorite toppings."
      ],
      prepTime: "15 min",
      cookTime: "10 min",
      restingTime: "2 min",
      targetTempF: 160,
      woodPairings: [],
      sauceRecommendations: ["Honey BBQ sauce"],
      sideRecommendations: ["French fries", "Coleslaw"],
      cookingTips: ["Don't press down on the patties while grilling!"]
    },
    // Pork - Pork Butt
    {
      id: crypto.randomUUID(),
      title: "Tangy Carolina Brined Pork Butt",
      proteinId: "p_pork_butt",
      cookingMethodId: "m_pellet_grill",
      flavorProfileId: "f_tangy",
      recipeType: "brine" as const,
      ingredients: [
        "8 lb pork butt",
        "1 gallon water",
        "1/2 cup salt",
        "1/2 cup apple cider vinegar",
        "1/4 cup brown sugar",
        "1 tbsp red pepper flakes"
      ],
      instructions: [
        "Dissolve salt and sugar in water; add vinegar and pepper flakes.",
        "Brine pork butt for 12 hours.",
        "Remove from brine, pat dry, and apply a light rub.",
        "Smoke at 250°F until internal temp reaches 203°F.",
        "Rest for 1 hour, then shred."
      ],
      prepTime: "12 hours",
      cookTime: "10 hours",
      restingTime: "1 hour",
      targetTempF: 203,
      woodPairings: ["Hickory", "Apple"],
      sauceRecommendations: ["Vinegar-based Carolina sauce"],
      sideRecommendations: ["Hush puppies", "Collard greens"],
      cookingTips: ["The brine helps keep the pork moist during the long cook."]
    },
    // Pork - Ribs
    {
      id: crypto.randomUUID(),
      title: "Sweet & Smoky Memphis Ribs",
      proteinId: "p_ribs",
      cookingMethodId: "m_smoker",
      flavorProfileId: "f_sweet_smoky",
      recipeType: "dry_rub" as const,
      ingredients: [
        "2 racks baby back ribs",
        "1/2 cup brown sugar",
        "2 tbsp paprika",
        "1 tbsp salt",
        "1 tbsp onion powder",
        "1 tsp cayenne pepper"
      ],
      instructions: [
        "Remove membrane from back of ribs.",
        "Apply rub liberally on both sides.",
        "Smoke at 225°F for 3 hours.",
        "Spritz with apple juice every hour.",
        "Cook until ribs pass the bend test (approx 5-6 hours total).",
        "Rest 15 minutes before cutting."
      ],
      prepTime: "20 min",
      cookTime: "6 hours",
      restingTime: "15 min",
      targetTempF: 195,
      woodPairings: ["Cherry", "Hickory"],
      sauceRecommendations: ["Sweet BBQ sauce on the side"],
      sideRecommendations: ["Baked beans", "Cornbread"],
      cookingTips: ["Spritzing adds moisture and helps build a better bark."]
    },
    // Poultry - Chicken
    {
      id: crypto.randomUUID(),
      title: "Spicy Grilled Spatchcock Chicken",
      proteinId: "p_chicken",
      cookingMethodId: "m_charcoal_grill",
      flavorProfileId: "f_spicy",
      recipeType: "marinade" as const,
      ingredients: [
        "1 whole chicken",
        "1/2 cup olive oil",
        "1/4 cup hot sauce",
        "2 tbsp lime juice",
        "1 tbsp chili powder",
        "3 cloves garlic, minced"
      ],
      instructions: [
        "Spatchcock the chicken by removing the backbone.",
        "Mix marinade ingredients and coat chicken. Marinate for 4 hours.",
        "Grill indirect at 375°F for 45 minutes.",
        "Move to direct heat for 5 minutes to crisp skin.",
        "Rest 15 minutes before carving."
      ],
      prepTime: "4 hours",
      cookTime: "50 min",
      restingTime: "15 min",
      targetTempF: 165,
      woodPairings: ["Apple"],
      sauceRecommendations: ["Spicy garlic aioli"],
      sideRecommendations: ["Grilled corn", "Potato salad"],
      cookingTips: ["Removing the backbone helps the chicken cook flat and evenly."]
    },
    // Poultry - Turkey
    {
      id: crypto.randomUUID(),
      title: "Savory Herb Smoked Turkey Breast",
      proteinId: "p_turkey",
      cookingMethodId: "m_smoker",
      flavorProfileId: "f_savory_herb",
      recipeType: "dry_rub" as const,
      ingredients: [
        "1 turkey breast (bone-in)",
        "2 tbsp softened butter",
        "1 tbsp dried thyme",
        "1 tbsp dried rosemary",
        "1 tsp garlic powder",
        "1 tsp salt",
        "1/2 tsp black pepper"
      ],
      instructions: [
        "Rub butter under and over the skin.",
        "Mix herbs and spices; apply to the turkey.",
        "Smoke at 275°F until internal temp reaches 165°F.",
        "Rest for 20 minutes before slicing."
      ],
      prepTime: "15 min",
      cookTime: "2.5 hours",
      restingTime: "20 min",
      targetTempF: 165,
      woodPairings: ["Pecan", "Cherry"],
      sauceRecommendations: ["White Alabama BBQ sauce"],
      sideRecommendations: ["Mashed sweet potatoes", "Green beans"],
      cookingTips: ["Butter helps keep the lean turkey breast moist."]
    },
    // Seafood - Salmon
    {
      id: crypto.randomUUID(),
      title: "Tangy Citrus Grilled Salmon",
      proteinId: "p_salmon",
      cookingMethodId: "m_gas_grill",
      flavorProfileId: "f_tangy",
      recipeType: "marinade" as const,
      ingredients: [
        "4 salmon fillets",
        "1/4 cup orange juice",
        "2 tbsp lemon juice",
        "2 tbsp soy sauce",
        "1 tbsp honey",
        "1 tsp grated ginger"
      ],
      instructions: [
        "Mix marinade ingredients and pour over salmon.",
        "Marinate for 30 minutes in the fridge.",
        "Grill skin-side down for 6-8 minutes over medium-high heat.",
        "Glaze with remaining marinade (boiled) in last 2 minutes."
      ],
      prepTime: "30 min",
      cookTime: "8 min",
      restingTime: "5 min",
      targetTempF: 145,
      woodPairings: ["Alder"],
      sauceRecommendations: ["Citrus reduction"],
      sideRecommendations: ["Rice pilaf", "Steamed broccoli"],
      cookingTips: ["Salmon is done when it flakes easily with a fork."]
    },
    // Seafood - Shrimp
    {
      id: crypto.randomUUID(),
      title: "Spicy Garlic Grilled Shrimp",
      proteinId: "p_shrimp",
      cookingMethodId: "m_charcoal_grill",
      flavorProfileId: "f_spicy",
      recipeType: "dry_rub" as const,
      ingredients: [
        "1 lb jumbo shrimp",
        "1 tbsp chili powder",
        "1 tsp cayenne pepper",
        "1 tsp garlic powder",
        "1/2 tsp salt",
        "2 tbsp melted butter"
      ],
      instructions: [
        "Toss shrimp in melted butter.",
        "Mix spices and coat shrimp evenly.",
        "Thread onto skewers and grill over high heat for 2 minutes per side.",
        "Serve with lime wedges."
      ],
      prepTime: "10 min",
      cookTime: "4 min",
      restingTime: "0 min",
      targetTempF: 145,
      woodPairings: [],
      sauceRecommendations: ["Chipotle crema"],
      sideRecommendations: ["Cilantro lime rice"],
      cookingTips: ["If using wooden skewers, soak them in water for 30 mins first."]
    },
    // Vegetables - Mixed Veggies
    {
      id: crypto.randomUUID(),
      title: "Savory Herb Grilled Vegetables",
      proteinId: "p_veg_mixed",
      cookingMethodId: "m_gas_grill",
      flavorProfileId: "f_savory_herb",
      recipeType: "marinade" as const,
      ingredients: [
        "2 lbs assorted veggies (zucchini, bell peppers, asparagus)",
        "1/4 cup balsamic vinegar",
        "1/2 cup olive oil",
        "2 cloves garlic, minced",
        "1 tsp dried oregano",
        "1 tsp dried basil",
        "Salt and pepper"
      ],
      instructions: [
        "Cut veggies into uniform pieces.",
        "Whisk marinade ingredients and toss with veggies.",
        "Marinate for 1 hour.",
        "Grill in a grill basket for 10-12 minutes, tossing occasionally."
      ],
      prepTime: "1 hour",
      cookTime: "12 min",
      restingTime: "0 min",
      targetTempF: 160,
      woodPairings: [],
      sauceRecommendations: ["Extra balsamic glaze"],
      sideRecommendations: ["Grilled bread"],
      cookingTips: ["Don't over-marinate or the veggies will get mushy."]
    },
    ...extraTemplates
  ];

  for (const t of templates) {
    await db.insert(schema.recipeTemplates).values(t).onConflictDoNothing();
  }
  console.log(`✅ ${templates.length} Recipe templates seeded`);

  console.log("🎉 Seeding complete!");
}

seed()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
