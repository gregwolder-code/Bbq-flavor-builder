import { db } from "./index";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // Proteins
  const proteinsData = [
    { name: "Brisket", slug: "brisket", icon: "🥩", description: "Beef brisket - the king of BBQ", sortOrder: 1 },
    { name: "Pork Butt", slug: "pork-butt", icon: "🐷", description: "Pork shoulder pulled pork", sortOrder: 2 },
    { name: "Ribs", slug: "ribs", icon: "🥓", description: "Pork spare ribs or baby backs", sortOrder: 3 },
    { name: "Chicken", slug: "chicken", icon: "🍗", description: "Whole chicken or bone-in pieces", sortOrder: 4 },
    { name: "Turkey", slug: "turkey", icon: "🦃", description: "Whole turkey or breast", sortOrder: 5 },
    { name: "Steak", slug: "steak", icon: "🥩", description: "Beef steak cuts", sortOrder: 6 },
    { name: "Burgers", slug: "burgers", icon: "🌭", description: "Beef or turkey patties", sortOrder: 7 },
    { name: "Salmon", slug: "salmon", icon: "🐟", description: "Fresh salmon fillets", sortOrder: 8 },
    { name: "Shrimp", slug: "shrimp", icon: "🦐", description: "Jumbo shrimp or prawns", sortOrder: 9 },
    { name: "Vegetables", slug: "vegetables", icon: "🥦", description: "Grill-friendly veggies", sortOrder: 10 },
  ];
  
  for (const p of proteinsData) {
    await db.insert(schema.proteins).values({ id: crypto.randomUUID(), ...p }).onConflictDoNothing();
  }
  console.log(`✅ Proteins seeded`);

  // Cooking Methods
  const methodsData = [
    { name: "Smoker", slug: "smoker", icon: "🔥", description: "Offset, vertical, or drum smoker", defaultTempF: 225, sortOrder: 1 },
    { name: "Pellet Grill", slug: "pellet-grill", icon: "🔥", description: "Wood pellet grill/smoker", defaultTempF: 250, sortOrder: 2 },
    { name: "Charcoal Grill", slug: "charcoal-grill", icon: "🔥", description: "Kettle or kamado charcoal grill", defaultTempF: 350, sortOrder: 3 },
    { name: "Gas Grill", slug: "gas-grill", icon: "🔥", description: "Propane or natural gas grill", defaultTempF: 400, sortOrder: 4 },
    { name: "Oven", slug: "oven", icon: "🔥", description: "Standard kitchen oven", defaultTempF: 350, sortOrder: 5 },
    { name: "Rotisserie", slug: "rotisserie", icon: "🔥", description: "Rotisserie spit attachment", defaultTempF: 325, sortOrder: 6 },
  ];
  
  for (const m of methodsData) {
    await db.insert(schema.cookingMethods).values({ id: crypto.randomUUID(), ...m }).onConflictDoNothing();
  }
  console.log(`✅ Cooking methods seeded`);

  // Flavor Profiles
  const flavorsData = [
    { name: "Sweet", slug: "sweet", icon: "🍯", description: "Honey, brown sugar, fruit-based sweetness", sortOrder: 1 },
    { name: "Smoky", slug: "smoky", icon: "💨", description: "Deep smoke flavor with wood-forward notes", sortOrder: 2 },
    { name: "Spicy", slug: "spicy", icon: "🌶️", description: "Cayenne, chili powder, black pepper heat", sortOrder: 3 },
    { name: "Tangy", slug: "tangy", icon: "🍋", description: "Vinegar, citrus, mustard-based brightness", sortOrder: 4 },
    { name: "Savory", slug: "savory", icon: "🧂", description: "Umami-rich with garlic, onion, and herbs", sortOrder: 5 },
    { name: "Garlic Herb", slug: "garlic-herb", icon: "🧄", description: "Fresh herbs and garlic-forward blend", sortOrder: 6 },
    { name: "Texas Style", slug: "texas-style", icon: "🤠", description: "Salt, pepper, beef-forward simplicity", sortOrder: 7 },
    { name: "Carolina Style", slug: "carolina-style", icon: "🐖", description: "Vinegar and pepper-based, whole hog tradition", sortOrder: 8 },
    { name: "Kansas City Style", slug: "kansas-city-style", icon: "🏙️", description: "Thick, sweet, tomato-based sauce", sortOrder: 9 },
    { name: "Memphis Style", slug: "memphis-style", icon: "🎸", description: "Dry rub with sweet tangy sauce on the side", sortOrder: 10 },
  ];
  
  for (const f of flavorsData) {
    await db.insert(schema.flavorProfiles).values({ id: crypto.randomUUID(), ...f }).onConflictDoNothing();
  }
  console.log(`✅ Flavor profiles seeded`);

  // Fetch IDs for templates
  const allProteins = await db.select().from(schema.proteins);
  const allMethods = await db.select().from(schema.cookingMethods);
  const allFlavors = await db.select().from(schema.flavorProfiles);

  const getP = (slug: string) => allProteins.find(p => p.slug === slug)?.id!;
  const getM = (slug: string) => allMethods.find(m => m.slug === slug)?.id!;
  const getF = (slug: string) => allFlavors.find(f => f.slug === slug)?.id!;

  const templates = [
    {
      id: crypto.randomUUID(),
      title: "Texas Style Smoked Brisket",
      proteinId: getP("brisket"),
      cookingMethodId: getM("smoker"),
      flavorProfileId: getF("texas-style"),
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
      sauceRecommendations: ["None (Texas tradition)", "thin, peppery vinegar sauce on the side"],
      sideRecommendations: ["Pickles", "onions", "white bread", "potato salad", "pinto beans"],
      cookingTips: ["The rest is just as important as the cook. Don't skip it!"]
    },
    {
      id: crypto.randomUUID(),
      title: "Sweet Honey Glazed Charcoal Chicken",
      proteinId: getP("chicken"),
      cookingMethodId: getM("charcoal-grill"),
      flavorProfileId: getF("sweet"),
      recipeType: "marinade" as const,
      ingredients: [
        "1 whole chicken, spatchcocked or parts",
        "1/2 cup honey",
        "1/4 cup brown sugar",
        "1/4 cup soy sauce",
        "2 tbsp apple cider vinegar",
        "1 tsp smoked paprika",
        "1/2 tsp garlic powder"
      ],
      instructions: [
        "Whisk together honey, brown sugar, soy sauce, vinegar, and spices.",
        "Place chicken in a large bowl or bag and pour marinade over. Marinate for at least 2 hours.",
        "Setup charcoal grill for two-zone cooking (direct and indirect heat).",
        "Place chicken skin-side up on the indirect side of the grill at 350°F.",
        "Cook until internal temperature reaches 150°F.",
        "Move to the direct heat side and glaze liberally with remaining marinade (boiled first if used on raw meat).",
        "Char for 2-3 minutes per side until skin is caramelized and internal temp is 165°F."
      ],
      prepTime: "2 hours (marinating)",
      cookTime: "60 min",
      restingTime: "10 min",
      targetTempF: 165,
      woodPairings: ["Apple", "Cherry"],
      sauceRecommendations: ["Extra honey BBQ sauce"],
      sideRecommendations: ["Corn on the cob", "coleslaw", "grilled pineapple"],
      cookingTips: ["Spatchcocking the chicken ensures even cooking and more surface area for the glaze."]
    },
    {
      id: crypto.randomUUID(),
      title: "Kansas City Style Pulled Pork",
      proteinId: getP("pork-butt"),
      cookingMethodId: getM("pellet-grill"),
      flavorProfileId: getF("kansas-city-style"),
      recipeType: "dry_rub" as const,
      ingredients: [
        "8-10 lb Pork Butt (Pork Shoulder)",
        "1/2 cup brown sugar",
        "1/4 cup paprika",
        "1 tbsp black pepper",
        "1 tbsp salt",
        "1 tsp chili powder",
        "1 tsp garlic powder",
        "KC Style BBQ Sauce (thick and sweet)"
      ],
      instructions: [
        "Coat pork butt in the dry rub, pressing it into the meat.",
        "Preheat pellet grill to 250°F using fruitwood or competition blend pellets.",
        "Place pork on the grill and smoke until internal temperature reaches 165°F.",
        "Place pork in a foil pan, add 1/2 cup apple juice, and cover tightly with foil.",
        "Continue cooking until internal temp reaches 203°F and the bone pulls out easily.",
        "Rest for 1 hour, then shred the meat, discarding excess fat.",
        "Mix in your favorite KC style thick sauce before serving."
      ],
      prepTime: "20 min",
      cookTime: "10-12 hours",
      restingTime: "1 hour",
      targetTempF: 203,
      woodPairings: ["Apple", "Hickory", "Competition Blend"],
      sauceRecommendations: ["Thick, sweet, tomato-based KC style sauce"],
      sideRecommendations: ["Mac and cheese", "baked beans", "cornbread"],
      cookingTips: ["Don't be afraid of the 'stall' around 160°F. Just be patient or wrap it!"]
    },
    {
      id: crypto.randomUUID(),
      title: "Garlic Herb Grilled Salmon",
      proteinId: getP("salmon"),
      cookingMethodId: getM("gas-grill"),
      flavorProfileId: getF("garlic-herb"),
      recipeType: "marinade" as const,
      ingredients: [
        "4 salmon fillets (6oz each)",
        "1/4 cup olive oil",
        "3 cloves garlic, minced",
        "1 tbsp fresh parsley, chopped",
        "1 tsp fresh dill, chopped",
        "1/2 lemon, juiced",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Mix olive oil, garlic, herbs, and lemon juice in a shallow dish.",
        "Add salmon fillets and coat well. Marinate in the fridge for 30 minutes.",
        "Preheat gas grill to medium-high heat (400°F). Clean and oil the grates well.",
        "Place salmon skin-side down on the grill.",
        "Close the lid and cook for 6-8 minutes per inch of thickness.",
        "Flip carefully only if you want grill marks on both sides, otherwise cook through skin-side down.",
        "Remove when salmon flakes easily with a fork."
      ],
      prepTime: "40 min",
      cookTime: "10 min",
      restingTime: "5 min",
      targetTempF: 145,
      woodPairings: ["Alder", "Cedar Plank (optional)"],
      sauceRecommendations: ["Lemon butter sauce", "light dill crema"],
      sideRecommendations: ["Asparagus", "wild rice", "garden salad"],
      cookingTips: ["Grilling on a cedar plank adds a great layer of flavor and prevents sticking."]
    },
    {
      id: crypto.randomUUID(),
      title: "Spicy Smoked Ribs",
      proteinId: getP("ribs"),
      cookingMethodId: getM("smoker"),
      flavorProfileId: getF("spicy"),
      recipeType: "dry_rub" as const,
      ingredients: [
        "2 racks of St. Louis style ribs",
        "1/4 cup brown sugar",
        "2 tbsp cayenne pepper",
        "2 tbsp chili powder",
        "1 tbsp black pepper",
        "1 tbsp salt",
        "1 tsp cumin"
      ],
      instructions: [
        "Remove the membrane from the back of the ribs.",
        "Apply the spicy dry rub liberally to both sides.",
        "Preheat smoker to 225°F using hickory or oak wood.",
        "Place ribs in the smoker and cook for 3 hours (3-2-1 method recommended).",
        "Wrap in foil with a splash of apple juice and hot sauce for 2 hours.",
        "Unwrap and cook for a final 1 hour, applying a spicy BBQ glaze in the last 30 minutes.",
        "Ribs are done when they pass the 'bend test'."
      ],
      prepTime: "30 min",
      cookTime: "6 hours",
      restingTime: "15 min",
      targetTempF: 195,
      woodPairings: ["Hickory", "Mesquite"],
      sauceRecommendations: ["Habanero or Jalapeno infused BBQ sauce"],
      sideRecommendations: ["Jalapeno poppers", "spicy slaw", "corn pudding"],
      cookingTips: ["Adjust the cayenne pepper to your preferred heat level!"]
    },
    {
      id: crypto.randomUUID(),
      title: "Tangy Brined Roast Chicken",
      proteinId: getP("chicken"),
      cookingMethodId: getM("oven"),
      flavorProfileId: getF("tangy"),
      recipeType: "brine" as const,
      ingredients: [
        "1 whole roasting chicken (4-5 lbs)",
        "1/2 gallon water",
        "1/2 cup kosher salt",
        "1/2 cup apple cider vinegar",
        "1/4 cup lemon juice",
        "2 tbsp yellow mustard",
        "1 tbsp black peppercorns",
        "2 bay leaves"
      ],
      instructions: [
        "Dissolve salt in 1 cup of hot water, then mix with remaining cold water and other brine ingredients.",
        "Submerge the chicken in the brine and refrigerate for 4-8 hours.",
        "Remove chicken, pat extremely dry with paper towels.",
        "Preheat oven to 425°F.",
        "Place chicken on a roasting rack in a pan.",
        "Roast until the thickest part of the thigh reaches 165°F (about 1 to 1.5 hours).",
        "Let rest for 15 minutes before carving."
      ],
      prepTime: "5-9 hours (including brining)",
      cookTime: "75 min",
      restingTime: "15 min",
      targetTempF: 165,
      woodPairings: [],
      sauceRecommendations: ["Alabama White Sauce (tangy mayo-based)"],
      sideRecommendations: ["Roasted root vegetables", "mashed potatoes", "green beans"],
      cookingTips: ["Patting the skin dry is crucial for getting it crispy in the oven."]
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
