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
    },
    {
      id: crypto.randomUUID(),
      title: "Smoky Grilled Veggie Rub",
      proteinId: getP("vegetables"),
      cookingMethodId: getM("smoker"),
      flavorProfileId: getF("smoky"),
      recipeType: "dry_rub" as const,
      ingredients: [
        "2 lbs mixed vegetables (bell peppers, zucchini, onions, mushrooms)",
        "2 tbsp olive oil",
        "1 tbsp smoked paprika",
        "1 tsp garlic powder",
        "1 tsp onion powder",
        "1/2 tsp cumin",
        "1 tsp kosher salt",
        "1/2 tsp black pepper"
      ],
      instructions: [
        "Toss vegetables in olive oil in a large bowl.",
        "Mix all spices in a small bowl and sprinkle over the vegetables, tossing to coat evenly.",
        "Preheat smoker to 225°F using cherry or apple wood.",
        "Place vegetables on a perforated grill pan or in a cast iron skillet.",
        "Smoke for 45-60 minutes until vegetables are tender and have a deep smoky color."
      ],
      prepTime: "15 min",
      cookTime: "60 min",
      restingTime: "0 min",
      targetTempF: 165,
      woodPairings: ["Cherry", "Apple"],
      sauceRecommendations: ["Balsamic glaze drizzle", "Greek yogurt dip"],
      sideRecommendations: ["Quinoa", "grilled halloumi", "crusty bread"],
      cookingTips: ["Cut vegetables into uniform sizes to ensure even cooking."]
    },
    {
      id: crypto.randomUUID(),
      title: "Tangy Vegetable Marinade",
      proteinId: getP("vegetables"),
      cookingMethodId: getM("gas-grill"),
      flavorProfileId: getF("tangy"),
      recipeType: "marinade" as const,
      ingredients: [
        "1 lb asparagus or sliced zucchini",
        "1/4 cup balsamic vinegar",
        "2 tbsp dijon mustard",
        "1/4 cup olive oil",
        "1 clove garlic, minced",
        "1 tsp dried oregano",
        "1/2 tsp salt",
        "1/4 tsp black pepper"
      ],
      instructions: [
        "Whisk together balsamic vinegar, mustard, olive oil, garlic, and herbs.",
        "Place vegetables in a shallow dish or gallon bag and pour marinade over. Marinate for 30 minutes at room temperature.",
        "Preheat gas grill to medium-high heat (400°F).",
        "Grill vegetables for 3-5 minutes per side until charred and tender.",
        "Drizzle with any remaining marinade (boiled first) if desired."
      ],
      prepTime: "30 min",
      cookTime: "10 min",
      restingTime: "0 min",
      targetTempF: 160,
      woodPairings: [],
      sauceRecommendations: ["Extra marinade", "lemon wedge"],
      sideRecommendations: ["Grilled polenta", "couscous", "feta cheese"],
      cookingTips: ["Don't over-marinate vegetables or they can become mushy."]
    },
    {
      id: crypto.randomUUID(),
      title: "Garlic Herb Veggie Brine",
      proteinId: getP("vegetables"),
      cookingMethodId: getM("oven"),
      flavorProfileId: getF("garlic-herb"),
      recipeType: "brine" as const,
      ingredients: [
        "1 head cauliflower or 1 lb Brussels sprouts",
        "4 cups water",
        "1/4 cup kosher salt",
        "4 cloves garlic, smashed",
        "3 sprigs fresh rosemary",
        "1 tbsp whole peppercorns",
        "2 tbsp olive oil (for roasting)"
      ],
      instructions: [
        "Dissolve salt in water, then add smashed garlic, rosemary sprigs, and peppercorns.",
        "Submerge vegetables in the brine for 1 hour (no longer or they will be too salty).",
        "Drain vegetables and pat thoroughly dry with paper towels.",
        "Toss with olive oil and place on a baking sheet.",
        "Roast in oven at 400°F for 25-30 minutes until browned and tender."
      ],
      prepTime: "1 hour 15 min",
      cookTime: "30 min",
      restingTime: "5 min",
      targetTempF: 165,
      woodPairings: [],
      sauceRecommendations: ["Garlic aioli", "parmesan cheese"],
      sideRecommendations: ["Roasted chicken", "steamed rice", "pasta"],
      cookingTips: ["Brining vegetables helps them stay moist and seasons them all the way through."]
    },
    {
      id: crypto.randomUUID(),
      title: "Texas-Style Steak Rub",
      proteinId: getP("steak"),
      cookingMethodId: getM("charcoal-grill"),
      flavorProfileId: getF("texas-style"),
      recipeType: "dry_rub" as const,
      ingredients: [
        "2 Ribeye or New York Strip steaks (1.5 inch thick)",
        "2 tbsp coarse black pepper (16 mesh)",
        "1 tbsp kosher salt",
        "1 tsp granulated garlic",
        "1/2 tsp onion powder"
      ],
      instructions: [
        "Season steaks liberally on all sides with the rub, pressing it in gently.",
        "Let steaks sit at room temperature for 30-45 minutes before grilling.",
        "Prepare charcoal grill for high direct heat (450°F+).",
        "Sear steaks for 3-4 minutes per side to develop a crust.",
        "Move to indirect heat if needed until internal temperature reaches 130°F for medium-rare.",
        "Rest for at least 10 minutes before slicing."
      ],
      prepTime: "45 min",
      cookTime: "10 min",
      restingTime: "10 min",
      targetTempF: 130,
      woodPairings: ["Oak", "Hickory"],
      sauceRecommendations: ["Garlic butter compound", "Chimichurri"],
      sideRecommendations: ["Baked potato", "creamed spinach", "wedge salad"],
      cookingTips: ["Use coarse pepper for that authentic Texas 'crunch'."]
    },
    {
      id: crypto.randomUUID(),
      title: "Savory Steak Marinade",
      proteinId: getP("steak"),
      cookingMethodId: getM("gas-grill"),
      flavorProfileId: getF("savory"),
      recipeType: "marinade" as const,
      ingredients: [
        "2 Skirt or Flank steaks",
        "1/2 cup soy sauce",
        "1/4 cup olive oil",
        "2 tbsp Worcestershire sauce",
        "2 cloves garlic, minced",
        "1 tsp black pepper",
        "1 tsp dried thyme"
      ],
      instructions: [
        "Combine all ingredients in a bowl or bag.",
        "Add steaks and marinate in the refrigerator for at least 4 hours (overnight is better).",
        "Preheat gas grill to high heat (450°F).",
        "Grill for 4-5 minutes per side depending on thickness.",
        "Rest for 5-7 minutes, then slice thinly against the grain."
      ],
      prepTime: "4 hours",
      cookTime: "10 min",
      restingTime: "7 min",
      targetTempF: 135,
      woodPairings: [],
      sauceRecommendations: ["Reduced marinade (boiled)", "steak sauce"],
      sideRecommendations: ["Grilled onions", "fluffy rice", "roasted peppers"],
      cookingTips: ["Slicing against the grain is essential for tough cuts like flank or skirt steak."]
    },
    {
      id: crypto.randomUUID(),
      title: "Savory Burger Dry Rub",
      proteinId: getP("burgers"),
      cookingMethodId: getM("charcoal-grill"),
      flavorProfileId: getF("savory"),
      recipeType: "dry_rub" as const,
      ingredients: [
        "2 lbs ground beef (80/20 blend)",
        "1 tbsp kosher salt",
        "1 tbsp black pepper",
        "1 tsp garlic powder",
        "1 tsp onion powder",
        "1/2 tsp smoked paprika"
      ],
      instructions: [
        "Mix all spices together in a small bowl.",
        "Incorporate the spice blend gently into the ground beef—do not overwork the meat.",
        "Form into four 1/2 lb patties, making a small indentation in the center with your thumb.",
        "Grill over direct charcoal heat for 5-6 minutes per side for medium doneness.",
        "Add cheese in the last minute of cooking."
      ],
      prepTime: "15 min",
      cookTime: "12 min",
      restingTime: "3 min",
      targetTempF: 160,
      woodPairings: ["Hickory"],
      sauceRecommendations: ["Classic burger sauce", "truffle mayo"],
      sideRecommendations: ["French fries", "onion rings", "dill pickles"],
      cookingTips: ["Don't press down on the patties with a spatula while grilling; it squeezes out the juices!"]
    },
    {
      id: crypto.randomUUID(),
      title: "Sweet Burger Glaze",
      proteinId: getP("burgers"),
      cookingMethodId: getM("gas-grill"),
      flavorProfileId: getF("sweet"),
      recipeType: "marinade" as const,
      ingredients: [
        "4 burger patties",
        "1/2 cup sweet BBQ sauce",
        "2 tbsp honey",
        "1 tbsp apple cider vinegar",
        "1 tsp sriracha (optional)"
      ],
      instructions: [
        "Whisk sauce, honey, vinegar, and sriracha together.",
        "Preheat grill to medium-high.",
        "Grill burgers until internal temp reaches 145°F.",
        "Brush glaze liberally on the burgers and cook for 1 more minute per side until caramelized.",
        "Serve on a toasted brioche bun."
      ],
      prepTime: "5 min",
      cookTime: "10 min",
      restingTime: "2 min",
      targetTempF: 160,
      woodPairings: [],
      sauceRecommendations: ["Extra glaze", "honey mustard"],
      sideRecommendations: ["Sweet potato fries", "fruit salad", "coleslaw"],
      cookingTips: ["Wait until the end to apply the glaze so the sugars don't burn."]
    },
    {
      id: crypto.randomUUID(),
      title: "Spicy Shrimp Marinade",
      proteinId: getP("shrimp"),
      cookingMethodId: getM("gas-grill"),
      flavorProfileId: getF("spicy"),
      recipeType: "marinade" as const,
      ingredients: [
        "1 lb jumbo shrimp, peeled and deveined",
        "1/4 cup olive oil",
        "2 tbsp sriracha or preferred hot sauce",
        "1 tbsp lime juice",
        "2 cloves garlic, minced",
        "1/2 tsp red pepper flakes"
      ],
      instructions: [
        "Whisk oil, hot sauce, lime juice, garlic, and pepper flakes.",
        "Marinate shrimp for 20-30 minutes in the fridge.",
        "Thread shrimp onto skewers (if using wooden, soak them first).",
        "Grill over high heat (450°F) for 2-3 minutes per side until opaque and slightly charred."
      ],
      prepTime: "30 min",
      cookTime: "6 min",
      restingTime: "0 min",
      targetTempF: 145,
      woodPairings: [],
      sauceRecommendations: ["Spicy mayo", "fresh lime wedges"],
      sideRecommendations: ["Cilantro lime rice", "mango salsa", "corn tortillas"],
      cookingTips: ["Shrimp cook very fast; stay at the grill so they don't overcook and become rubbery."]
    },
    {
      id: crypto.randomUUID(),
      title: "Garlic Herb Shrimp",
      proteinId: getP("shrimp"),
      cookingMethodId: getM("charcoal-grill"),
      flavorProfileId: getF("garlic-herb"),
      recipeType: "dry_rub" as const,
      ingredients: [
        "1 lb jumbo shrimp",
        "2 tbsp melted butter",
        "1 tbsp garlic powder",
        "1 tsp dried parsley",
        "1/2 tsp dried basil",
        "1/2 tsp salt"
      ],
      instructions: [
        "Toss shrimp in melted butter and then the garlic herb seasoning.",
        "Prepare charcoal grill for medium-high direct heat.",
        "Place shrimp on the grill or in a grill basket.",
        "Grill for 2 minutes per side until pink and firm."
      ],
      prepTime: "10 min",
      cookTime: "5 min",
      restingTime: "0 min",
      targetTempF: 145,
      woodPairings: ["Fruitwood pellet"],
      sauceRecommendations: ["Lemon butter", "cocktail sauce"],
      sideRecommendations: ["Caesar salad", "garlic bread", "roasted broccoli"],
      cookingTips: ["A grill basket is great for shrimp to prevent them from falling through the grates."]
    },
    {
      id: crypto.randomUUID(),
      title: "Savory Turkey Brine",
      proteinId: getP("turkey"),
      cookingMethodId: getM("smoker"),
      flavorProfileId: getF("savory"),
      recipeType: "brine" as const,
      ingredients: [
        "1 whole turkey (12-14 lbs)",
        "2 gallons water",
        "1 cup kosher salt",
        "1/2 cup brown sugar",
        "4 sprigs fresh rosemary",
        "4 sprigs fresh sage",
        "1 head garlic, cut in half",
        "2 tbsp whole peppercorns"
      ],
      instructions: [
        "Combine brine ingredients in a large pot. Heat to dissolve salt/sugar, then cool completely.",
        "Submerge turkey in brine and refrigerate for 12-24 hours.",
        "Remove turkey, rinse with cold water, and pat extremely dry.",
        "Preheat smoker to 275°F using apple or cherry wood.",
        "Smoke until the internal temperature of the breast reaches 165°F.",
        "Rest for at least 30-45 minutes before carving."
      ],
      prepTime: "12-24 hours",
      cookTime: "3-4 hours",
      restingTime: "45 min",
      targetTempF: 165,
      woodPairings: ["Apple", "Cherry", "Pecan"],
      sauceRecommendations: ["Gravy", "cranberry sauce"],
      sideRecommendations: ["Stuffing", "mashed potatoes", "green bean casserole"],
      cookingTips: ["Make sure the turkey is completely submerged in the brine; use a weighted plate if needed."]
    },
    {
      id: crypto.randomUUID(),
      title: "Smoky Turkey Rub",
      proteinId: getP("turkey"),
      cookingMethodId: getM("pellet-grill"),
      flavorProfileId: getF("smoky"),
      recipeType: "dry_rub" as const,
      ingredients: [
        "1 turkey breast (bone-in or boneless)",
        "2 tbsp smoked paprika",
        "1 tbsp black pepper",
        "1 tbsp salt",
        "1 tsp poultry seasoning (thyme, sage, rosemary blend)",
        "1/2 tsp onion powder",
        "2 tbsp olive oil (as binder)"
      ],
      instructions: [
        "Rub the turkey breast with olive oil.",
        "Apply the smoky rub liberally to all sides of the breast.",
        "Preheat pellet grill to 325°F using hickory or competition blend pellets.",
        "Place turkey on the grill and cook until internal temperature reaches 165°F.",
        "Rest for 15-20 minutes before slicing."
      ],
      prepTime: "15 min",
      cookTime: "1.5-2 hours",
      restingTime: "20 min",
      targetTempF: 165,
      woodPairings: ["Hickory", "Competition Blend"],
      sauceRecommendations: ["Smoky BBQ sauce", "white Alabama sauce"],
      sideRecommendations: ["Cornbread", "sweet potato mash", "coleslaw"],
      cookingTips: ["Cooking turkey at a slightly higher temp (325°F) on a pellet grill helps keep the skin from getting rubbery."]
    },
    {
      id: crypto.randomUUID(),
      title: "Savory Brisket Marinade",
      proteinId: getP("brisket"),
      cookingMethodId: getM("smoker"),
      flavorProfileId: getF("savory"),
      recipeType: "marinade" as const,
      ingredients: [
        "1 whole beef brisket (10-12 lbs)",
        "1 cup beef broth",
        "1/2 cup soy sauce",
        "1/4 cup Worcestershire sauce",
        "4 cloves garlic, minced",
        "1 tsp black pepper",
        "1/2 tsp onion powder"
      ],
      instructions: [
        "Combine all marinade ingredients.",
        "Optional: Use a meat injector to inject the marinade into the thickest parts of the brisket.",
        "Otherwise, place brisket in a large container and pour marinade over. Marinate overnight in the fridge.",
        "Remove from marinade and pat dry. Apply a light salt and pepper rub if desired.",
        "Smoke at 225°F until tender (internal temp ~203°F)."
      ],
      prepTime: "12 hours",
      cookTime: "10-12 hours",
      restingTime: "2 hours",
      targetTempF: 203,
      woodPairings: ["Oak", "Mesquite"],
      sauceRecommendations: ["Beef au jus", "horseradish sauce"],
      sideRecommendations: ["Smoked beans", "cornbread", "pickled onions"],
      cookingTips: ["Injection is the best way to get flavor deep inside a large cut like brisket."]
    },
    {
      id: crypto.randomUUID(),
      title: "Tangy Carolina Pork Brine",
      proteinId: getP("pork-butt"),
      cookingMethodId: getM("smoker"),
      flavorProfileId: getF("carolina-style"),
      recipeType: "brine" as const,
      ingredients: [
        "1 pork butt (8-10 lbs)",
        "1 gallon water",
        "1/2 cup kosher salt",
        "1/2 cup apple cider vinegar",
        "1/4 cup sugar",
        "1 tbsp red pepper flakes",
        "2 bay leaves"
      ],
      instructions: [
        "Dissolve salt and sugar in 1 quart of hot water, then mix with remaining cold water, vinegar, and spices.",
        "Submerge pork butt in the brine for 8-12 hours in the refrigerator.",
        "Remove from brine and pat dry.",
        "Smoke at 225°F using hickory wood until internal temperature reaches 203°F.",
        "Rest for 1 hour, then shred and serve with a vinegar-based Carolina sauce."
      ],
      prepTime: "12 hours",
      cookTime: "10-14 hours",
      restingTime: "1 hour",
      targetTempF: 203,
      woodPairings: ["Hickory", "Oak"],
      sauceRecommendations: ["Eastern Carolina vinegar sauce", "South Carolina mustard sauce"],
      sideRecommendations: ["Hush puppies", "coleslaw", "collard greens"],
      cookingTips: ["The vinegar in the brine helps tenderize the pork while it seasons."]
    },
    {
      id: crypto.randomUUID(),
      title: "Sweet Memphis Rib Rub",
      proteinId: getP("ribs"),
      cookingMethodId: getM("smoker"),
      flavorProfileId: getF("memphis-style"),
      recipeType: "dry_rub" as const,
      ingredients: [
        "2 racks baby back ribs",
        "1/2 cup brown sugar",
        "2 tbsp paprika",
        "1 tbsp kosher salt",
        "1 tbsp onion powder",
        "1 tsp garlic powder",
        "1 tsp black pepper",
        "1/2 tsp cayenne pepper"
      ],
      instructions: [
        "Remove the membrane from the back of the ribs.",
        "Coat the ribs liberally with the rub on both sides.",
        "Preheat smoker to 225°F with pecan or hickory wood.",
        "Smoke ribs for 3 hours.",
        "Spritz with apple juice every hour for the remaining 2-3 hours until tender.",
        "Apply a thin layer of sauce in the last 15 minutes if desired, or serve 'dry' in the Memphis tradition."
      ],
      prepTime: "20 min",
      cookTime: "5 hours",
      restingTime: "10 min",
      targetTempF: 195,
      woodPairings: ["Pecan", "Hickory"],
      sauceRecommendations: ["Sweet and tangy BBQ sauce on the side"],
      sideRecommendations: ["Potato salad", "baked beans", "white bread"],
      cookingTips: ["Memphis style often favors 'dry' ribs, where the rub is the star. Don't over-sauce!"]
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
