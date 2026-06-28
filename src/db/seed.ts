import { db } from "./index";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database with new structure...");

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

  // 3. Proteins (Sub-types)
  const proteinsData = [
    // Beef
    { id: "p_brisket", categoryId: "cat_beef", name: "Brisket", slug: "brisket", icon: "🥩", description: "Whole packer brisket", sortOrder: 1 },
    { id: "p_steak_ribeye", categoryId: "cat_beef", name: "Ribeye Steak", slug: "ribeye-steak", icon: "🥩", description: "Richly marbled ribeye", sortOrder: 2 },
    { id: "p_steak_flank", categoryId: "cat_beef", name: "Flank Steak", slug: "flank-steak", icon: "🥩", description: "Lean and flavorful flank", sortOrder: 3 },
    { id: "p_burgers", categoryId: "cat_beef", name: "Ground Beef (Burgers)", slug: "burgers", icon: "🍔", description: "80/20 ground beef blend", sortOrder: 4 },
    { id: "p_beef_ribs", categoryId: "cat_beef", name: "Beef Ribs", slug: "beef-ribs", icon: "🍖", description: "Large, meaty dino ribs", sortOrder: 5 },
    // Pork
    { id: "p_pork_butt", categoryId: "cat_pork", name: "Pork Butt (Shoulder)", slug: "pork-butt", icon: "🐷", description: "Ideal for pulled pork", sortOrder: 1 },
    { id: "p_pork_baby_backs", categoryId: "cat_pork", name: "Baby Back Ribs", slug: "baby-back-ribs", icon: "🥓", description: "Tender, lean pork ribs", sortOrder: 2 },
    { id: "p_pork_spare_ribs", categoryId: "cat_pork", name: "Spare Ribs", slug: "spare-ribs", icon: "🥓", description: "Meaty, flavorful pork ribs", sortOrder: 3 },
    { id: "p_pork_chops", categoryId: "cat_pork", name: "Pork Chops", slug: "pork-chops", icon: "🥩", description: "Thick-cut bone-in chops", sortOrder: 4 },
    { id: "p_pork_belly", categoryId: "cat_pork", name: "Pork Belly", slug: "pork-belly", icon: "🥓", description: "Rich and fatty pork belly", sortOrder: 5 },
    // Poultry
    { id: "p_chicken_whole", categoryId: "cat_poultry", name: "Whole Chicken", slug: "whole-chicken", icon: "🍗", description: "Spatchcocked or whole", sortOrder: 1 },
    { id: "p_chicken_wings", categoryId: "cat_poultry", name: "Chicken Wings", slug: "chicken-wings", icon: "🍗", description: "Party-style wings", sortOrder: 2 },
    { id: "p_chicken_thighs", categoryId: "cat_poultry", name: "Chicken Thighs", slug: "chicken-thighs", icon: "🍗", description: "Juicy bone-in thighs", sortOrder: 3 },
    { id: "p_turkey_whole", categoryId: "cat_poultry", name: "Whole Turkey", slug: "whole-turkey", icon: "🦃", description: "The holiday favorite", sortOrder: 4 },
    { id: "p_turkey_breast", categoryId: "cat_poultry", name: "Turkey Breast", slug: "turkey-breast", icon: "🦃", description: "Lean turkey breast", sortOrder: 5 },
    // Seafood
    { id: "p_salmon", categoryId: "cat_seafood", name: "Salmon Fillet", slug: "salmon", icon: "🐟", description: "Fresh Atlantic salmon", sortOrder: 1 },
    { id: "p_shrimp", categoryId: "cat_seafood", name: "Shrimp", slug: "shrimp", icon: "🦐", description: "Jumbo tail-on shrimp", sortOrder: 2 },
    { id: "p_lobster", categoryId: "cat_seafood", name: "Lobster Tail", slug: "lobster-tail", icon: "🦞", description: "Decadent lobster tails", sortOrder: 3 },
    { id: "p_scallops", categoryId: "cat_seafood", name: "Scallops", slug: "scallops", icon: "🐚", description: "Large sea scallops", sortOrder: 4 },
    { id: "p_white_fish", categoryId: "cat_seafood", name: "White Fish", slug: "white-fish", icon: "🐟", description: "Cod, halibut, or tilapia", sortOrder: 5 },
    // Vegetables
    { id: "p_corn", categoryId: "cat_vegetables", name: "Corn on the Cob", slug: "corn", icon: "🌽", description: "Sweet summer corn", sortOrder: 1 },
    { id: "p_asparagus", categoryId: "cat_vegetables", name: "Asparagus", slug: "asparagus", icon: "🌿", description: "Fresh green spears", sortOrder: 2 },
    { id: "p_zucchini", categoryId: "cat_vegetables", name: "Zucchini", slug: "zucchini", icon: "🥒", description: "Sliced summer squash", sortOrder: 3 },
    { id: "p_mushrooms", categoryId: "cat_vegetables", name: "Portobello Mushrooms", slug: "mushrooms", icon: "🍄", description: "Meaty mushroom caps", sortOrder: 4 },
    { id: "p_veg_mixed", categoryId: "cat_vegetables", name: "Mixed Veggies", slug: "mixed-veggies", icon: "🥗", description: "Seasonal vegetable medley", sortOrder: 5 },
  ];

  for (const p of proteinsData) {
    await db.insert(schema.proteins).values(p).onConflictDoNothing();
  }
  console.log("✅ Proteins seeded");

  // 4. Cooking Methods (Stay the same mostly)
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

  // 5. Flavor Profiles (Simplified)
  const flavorsData = [
    { id: "f_sweet_smoky", name: "Sweet & Smoky", slug: "sweet-smoky", icon: "🍯", description: "Classic BBQ with brown sugar and hickory notes", sortOrder: 1 },
    { id: "f_spicy", name: "Spicy", slug: "spicy", icon: "🌶️", description: "Bold heat from cayenne, chipotle, and peppers", sortOrder: 2 },
    { id: "f_tangy", name: "Tangy", slug: "tangy", icon: "🍋", description: "Bright vinegar, citrus, or mustard-based flavors", sortOrder: 3 },
    { id: "f_garlic_herb", name: "Garlic & Herb", slug: "garlic-herb", icon: "🧄", description: "Savory blend of roasted garlic and fresh garden herbs", sortOrder: 4 },
    { id: "f_texas_style", name: "Texas Style", slug: "texas-style", icon: "🤠", description: "Pure salt and heavy black pepper, brisket style", sortOrder: 5 },
  ];

  for (const f of flavorsData) {
    await db.insert(schema.flavorProfiles).values(f).onConflictDoNothing();
  }
  console.log("✅ Flavor profiles seeded");

  // 6. Recipe Templates (Migrated and updated)
  const templates = [
    {
      id: crypto.randomUUID(),
      title: "Texas Style Smoked Brisket",
      proteinId: "p_brisket",
      cookingMethodId: "m_smoker",
      flavorProfileId: "f_texas_style",
      recipeType: "dry_rub" as const,
      ingredients: [
        "1 whole packer brisket (12-14 lbs)",
        "1/2 cup coarse black pepper (16 mesh)",
        "1/2 cup kosher salt",
        "1/4 cup granulated garlic (optional)",
        "Beef tallow or binder (mustard/water) as needed"
      ],
      instructions: [
        "Trim the brisket, leaving about 1/4 inch of fat cap.",
        "Mix salt and pepper (and garlic if using) in a shaker.",
        "Apply binder if desired, then coat the brisket liberally with the rub.",
        "Preheat smoker to 225°F-250°F using post oak wood.",
        "Place brisket on the smoker fat side up (or toward heat source).",
        "Smoke until the internal temperature reaches about 165°F and the bark is well-set.",
        "Wrap in peach butcher paper and continue cooking until tender (internal temp ~203°F).",
        "Rest in a cooler for at least 2-4 hours before slicing."
      ],
      prepTime: "45 min",
      cookTime: "12-14 hours",
      restingTime: "2-4 hours",
      targetTempF: 203,
      woodPairings: ["Post Oak", "Hickory"],
      sauceRecommendations: ["None (Texas tradition)", "Thin, peppery vinegar sauce on the side"],
      sideRecommendations: ["Pickles", "Onions", "White bread", "Potato salad", "Pinto beans"],
      cookingTips: ["The rest is just as important as the cook. Don't skip it!"]
    },
    {
      id: crypto.randomUUID(),
      title: "Sweet Honey Glazed Charcoal Chicken Wings",
      proteinId: "p_chicken_wings",
      cookingMethodId: "m_charcoal_grill",
      flavorProfileId: "f_sweet_smoky",
      recipeType: "marinade" as const,
      ingredients: [
        "2 lbs chicken wings",
        "1/2 cup honey",
        "1/4 cup brown sugar",
        "1/4 cup soy sauce",
        "2 tbsp apple cider vinegar",
        "1 tsp smoked paprika",
        "1/2 tsp garlic powder"
      ],
      instructions: [
        "Whisk together honey, brown sugar, soy sauce, vinegar, and spices.",
        "Place wings in a large bowl and pour marinade over. Marinate for 1 hour.",
        "Setup charcoal grill for two-zone cooking.",
        "Grill wings on indirect heat at 350°F for 20-25 minutes.",
        "Move to direct heat, glaze with remaining marinade, and char for 2 minutes per side until 165°F internal."
      ],
      prepTime: "1 hour",
      cookTime: "30 min",
      restingTime: "5 min",
      targetTempF: 165,
      woodPairings: ["Apple", "Cherry"],
      sauceRecommendations: ["Extra honey BBQ sauce"],
      sideRecommendations: ["Celery sticks", "Blue cheese dressing", "Coleslaw"],
      cookingTips: ["Pat wings dry before marinating for better skin texture."]
    },
    {
      id: crypto.randomUUID(),
      title: "Kansas City Style Pulled Pork",
      proteinId: "p_pork_butt",
      cookingMethodId: "m_pellet_grill",
      flavorProfileId: "f_sweet_smoky",
      recipeType: "dry_rub" as const,
      ingredients: [
        "8-10 lb Pork Butt (Pork Shoulder)",
        "1/2 cup brown sugar",
        "1/4 cup paprika",
        "1 tbsp black pepper",
        "1 tbsp salt",
        "1 tsp chili powder",
        "KC Style BBQ Sauce (thick and sweet)"
      ],
      instructions: [
        "Coat pork butt in the dry rub.",
        "Preheat pellet grill to 250°F.",
        "Smoke until internal temperature reaches 165°F.",
        "Wrap in foil with apple juice and cook until 203°F.",
        "Rest for 1 hour, then shred and mix with KC sauce."
      ],
      prepTime: "20 min",
      cookTime: "10-12 hours",
      restingTime: "1 hour",
      targetTempF: 203,
      woodPairings: ["Apple", "Hickory"],
      sauceRecommendations: ["Thick, sweet KC style sauce"],
      sideRecommendations: ["Mac and cheese", "Baked beans", "Cornbread"],
      cookingTips: ["Wait for the bone to wiggle freely before pulling."]
    },
    {
      id: crypto.randomUUID(),
      title: "Garlic Herb Grilled Salmon",
      proteinId: "p_salmon",
      cookingMethodId: "m_gas_grill",
      flavorProfileId: "f_garlic_herb",
      recipeType: "marinade" as const,
      ingredients: [
        "4 salmon fillets",
        "1/4 cup olive oil",
        "3 cloves garlic, minced",
        "1 tbsp fresh parsley",
        "1/2 lemon, juiced",
        "Salt and pepper"
      ],
      instructions: [
        "Marinate salmon in oil, garlic, herbs, and lemon for 30 minutes.",
        "Preheat gas grill to 400°F.",
        "Place salmon skin-side down.",
        "Cook for 6-8 minutes until it flakes easily."
      ],
      prepTime: "40 min",
      cookTime: "10 min",
      restingTime: "5 min",
      targetTempF: 145,
      woodPairings: ["Alder"],
      sauceRecommendations: ["Lemon butter sauce"],
      sideRecommendations: ["Asparagus", "Wild rice"],
      cookingTips: ["Don't flip the salmon; cook skin-side down the whole time."]
    },
    {
      id: crypto.randomUUID(),
      title: "Spicy Smoked Spare Ribs",
      proteinId: "p_pork_spare_ribs",
      cookingMethodId: "m_smoker",
      flavorProfileId: "f_spicy",
      recipeType: "dry_rub" as const,
      ingredients: [
        "2 racks of pork spare ribs",
        "1/4 cup brown sugar",
        "2 tbsp cayenne pepper",
        "2 tbsp chili powder",
        "1 tbsp salt"
      ],
      instructions: [
        "Remove membrane and apply rub.",
        "Smoke at 225°F for 3 hours.",
        "Wrap with apple juice and hot sauce for 2 hours.",
        "Unwrap and glaze with spicy BBQ sauce for 1 hour."
      ],
      prepTime: "30 min",
      cookTime: "6 hours",
      restingTime: "15 min",
      targetTempF: 195,
      woodPairings: ["Hickory"],
      sauceRecommendations: ["Habanero BBQ sauce"],
      sideRecommendations: ["Jalapeno poppers", "Spicy slaw"],
      cookingTips: ["Use the 'bend test' to check for doneness."]
    },
    {
      id: crypto.randomUUID(),
      title: "Texas-Style Ribeye Steak",
      proteinId: "p_steak_ribeye",
      cookingMethodId: "m_charcoal_grill",
      flavorProfileId: "f_texas_style",
      recipeType: "dry_rub" as const,
      ingredients: [
        "2 Ribeye steaks (1.5 inch thick)",
        "2 tbsp coarse black pepper",
        "1 tbsp kosher salt",
        "1 tsp granulated garlic"
      ],
      instructions: [
        "Season steaks liberally and let sit for 30 min.",
        "Prepare charcoal grill for high direct heat.",
        "Sear for 3-4 minutes per side until 130°F internal.",
        "Rest for 10 minutes."
      ],
      prepTime: "45 min",
      cookTime: "10 min",
      restingTime: "10 min",
      targetTempF: 130,
      woodPairings: ["Oak"],
      sauceRecommendations: ["Garlic butter"],
      sideRecommendations: ["Baked potato", "Creamed spinach"],
      cookingTips: ["Coarse pepper is key for the Texas crust."]
    },
    {
      id: crypto.randomUUID(),
      title: "Savory Garlic Herb Turkey Breast",
      proteinId: "p_turkey_breast",
      cookingMethodId: "m_pellet_grill",
      flavorProfileId: "f_garlic_herb",
      recipeType: "dry_rub" as const,
      ingredients: [
        "1 turkey breast",
        "2 tbsp olive oil",
        "1 tbsp garlic powder",
        "1 tsp dried rosemary",
        "1 tsp dried thyme",
        "Salt and pepper"
      ],
      instructions: [
        "Coat turkey in oil and apply herb rub.",
        "Preheat pellet grill to 325°F.",
        "Cook until 165°F internal temperature.",
        "Rest for 20 minutes."
      ],
      prepTime: "15 min",
      cookTime: "2 hours",
      restingTime: "20 min",
      targetTempF: 165,
      woodPairings: ["Apple", "Pecan"],
      sauceRecommendations: ["White Alabama sauce"],
      sideRecommendations: ["Mashed potatoes", "Green beans"],
      cookingTips: ["High heat helps prevent rubbery skin."]
    },
    {
      id: crypto.randomUUID(),
      title: "Tangy Balsamic Grilled Zucchini",
      proteinId: "p_zucchini",
      cookingMethodId: "m_gas_grill",
      flavorProfileId: "f_tangy",
      recipeType: "marinade" as const,
      ingredients: [
        "3 large zucchinis, sliced long",
        "1/4 cup balsamic vinegar",
        "2 tbsp olive oil",
        "1 tsp dried oregano",
        "1 clove garlic, minced"
      ],
      instructions: [
        "Marinate zucchini for 20 minutes.",
        "Grill over medium-high heat for 3-4 minutes per side.",
        "Serve warm."
      ],
      prepTime: "20 min",
      cookTime: "8 min",
      restingTime: "0 min",
      targetTempF: 160,
      woodPairings: [],
      sauceRecommendations: ["Extra balsamic glaze"],
      sideRecommendations: ["Grilled polenta", "Feta cheese"],
      cookingTips: ["Slice zucchini into thick planks so they don't fall through grates."]
    },
    {
      id: crypto.randomUUID(),
      title: "Garlic Herb Grilled Asparagus",
      proteinId: "p_asparagus",
      cookingMethodId: "m_gas_grill",
      flavorProfileId: "f_garlic_herb",
      recipeType: "dry_rub" as const,
      ingredients: [
        "1 lb asparagus",
        "1 tbsp olive oil",
        "1 tsp garlic salt",
        "1/2 tsp black pepper",
        "Lemon wedges"
      ],
      instructions: [
        "Toss asparagus with oil and garlic salt.",
        "Grill over high heat for 3-5 minutes until tender-crisp.",
        "Squeeze fresh lemon over before serving."
      ],
      prepTime: "5 min",
      cookTime: "5 min",
      restingTime: "0 min",
      targetTempF: 160,
      woodPairings: [],
      sauceRecommendations: ["Lemon juice"],
      sideRecommendations: ["Grilled chicken", "Roasted salmon"],
      cookingTips: ["Grill perpendicular to the grates so they don't fall through."]
    },
    {
      id: crypto.randomUUID(),
      title: "Sweet & Smoky Pork Belly Burnt Ends",
      proteinId: "p_pork_belly",
      cookingMethodId: "m_smoker",
      flavorProfileId: "f_sweet_smoky",
      recipeType: "dry_rub" as const,
      ingredients: [
        "5 lbs pork belly, cubed into 1-inch pieces",
        "1/2 cup sweet BBQ rub",
        "1 cup sweet BBQ sauce",
        "1/4 cup honey",
        "1/2 stick butter"
      ],
      instructions: [
        "Season cubes with rub and smoke at 250°F for 3 hours.",
        "Place cubes in a pan with sauce, honey, and butter.",
        "Cover with foil and smoke for 1.5 more hours.",
        "Uncover and smoke for 30 min to tack up the sauce."
      ],
      prepTime: "30 min",
      cookTime: "5 hours",
      restingTime: "15 min",
      targetTempF: 205,
      woodPairings: ["Cherry", "Apple"],
      sauceRecommendations: ["Extra sweet BBQ glaze"],
      sideRecommendations: ["Pickles", "Slaw"],
      cookingTips: ["The fat should be completely rendered and like candy."]
    },
    {
      id: crypto.randomUUID(),
      title: "Texas Style Beef Dino Ribs",
      proteinId: "p_beef_ribs",
      cookingMethodId: "m_smoker",
      flavorProfileId: "f_texas_style",
      recipeType: "dry_rub" as const,
      ingredients: [
        "1 rack beef plate ribs",
        "1/4 cup coarse black pepper",
        "2 tbsp kosher salt"
      ],
      instructions: [
        "Trim excess fat from the top.",
        "Apply S&P rub liberally.",
        "Smoke at 275°F until probe tender (approx 203°F internal).",
        "Rest for 1 hour."
      ],
      prepTime: "15 min",
      cookTime: "8 hours",
      restingTime: "1 hour",
      targetTempF: 203,
      woodPairings: ["Oak", "Hickory"],
      sauceRecommendations: ["None"],
      sideRecommendations: ["Jalapeno cornbread", "Potato salad"],
      cookingTips: ["These are like brisket on a stick. Be patient!"]
    },
    {
      id: crypto.randomUUID(),
      title: "Spicy Buffalo Chicken Wings",
      proteinId: "p_chicken_wings",
      cookingMethodId: "m_charcoal_grill",
      flavorProfileId: "f_spicy",
      recipeType: "dry_rub" as const,
      ingredients: [
        "2 lbs wings",
        "2 tbsp baking powder (for crispy skin)",
        "1 tbsp salt",
        "1/2 cup buffalo hot sauce",
        "1/4 cup melted butter"
      ],
      instructions: [
        "Toss wings in baking powder and salt.",
        "Grill indirect at 400°F until crispy (45 min).",
        "Toss in buffalo sauce and butter mixture.",
        "Serve with ranch or blue cheese."
      ],
      prepTime: "10 min",
      cookTime: "45 min",
      restingTime: "0 min",
      targetTempF: 175,
      woodPairings: ["Hickory"],
      sauceRecommendations: ["Buffalo sauce"],
      sideRecommendations: ["Celery", "Carrots"],
      cookingTips: ["Baking powder is the secret to crispy grilled wings."]
    },
    {
      id: crypto.randomUUID(),
      title: "Garlic Herb Grilled Scallops",
      proteinId: "p_scallops",
      cookingMethodId: "m_gas_grill",
      flavorProfileId: "f_garlic_herb",
      recipeType: "marinade" as const,
      ingredients: [
        "1 lb sea scallops",
        "2 tbsp melted butter",
        "2 cloves garlic, minced",
        "1 tbsp fresh chives",
        "Lemon zest"
      ],
      instructions: [
        "Pat scallops very dry.",
        "Toss in butter, garlic, and chives.",
        "Grill on very high heat for 2 minutes per side.",
        "Finish with lemon zest."
      ],
      prepTime: "10 min",
      cookTime: "4 min",
      restingTime: "0 min",
      targetTempF: 125,
      woodPairings: [],
      sauceRecommendations: ["Lemon butter"],
      sideRecommendations: ["Risotto", "Sautéed spinach"],
      cookingTips: ["Dry scallops are essential for a good sear."]
    },
    {
      id: crypto.randomUUID(),
      title: "Spicy Grilled Corn (Elote Style)",
      proteinId: "p_corn",
      cookingMethodId: "m_charcoal_grill",
      flavorProfileId: "f_spicy",
      recipeType: "dry_rub" as const,
      ingredients: [
        "4 ears of corn, shucked",
        "2 tbsp mayo",
        "1 tsp chili powder",
        "1/2 tsp cayenne",
        "1/4 cup cotija cheese",
        "Lime wedges"
      ],
      instructions: [
        "Grill corn over direct heat until charred.",
        "Brush with mayo.",
        "Sprinkle with chili powder, cayenne, and cotija.",
        "Serve with lime."
      ],
      prepTime: "10 min",
      cookTime: "10 min",
      restingTime: "0 min",
      targetTempF: 165,
      woodPairings: [],
      sauceRecommendations: ["Crema"],
      sideRecommendations: ["Grilled steak", "Tacos"],
      cookingTips: ["Don't be afraid of the char; it adds great flavor."]
    }
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
