import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

// --- NextAuth Tables ---

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: integer("email_verified", { mode: "timestamp_ms" }),
  image: text("image"),
  // App specific fields
  passwordHash: text("password_hash"),
  provider: text("provider").default("credentials"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
  isAdmin: integer("is_admin", { mode: "boolean" }).default(false),
  premiumTier: text("premium_tier").default("free"),
  premiumExpires: text("premium_expires"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// --- App Specific Tables ---

export const proteins = sqliteTable("proteins", {
  id: text("id").primaryKey(),
  name: text("name").unique().notNull(),
  slug: text("slug").unique().notNull(),
  icon: text("icon"),
  description: text("description"),
  isAvailable: integer("is_available", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  sortOrder: integer("sort_order").default(0),
});

export const cookingMethods = sqliteTable("cooking_methods", {
  id: text("id").primaryKey(),
  name: text("name").unique().notNull(),
  slug: text("slug").unique().notNull(),
  icon: text("icon"),
  description: text("description"),
  defaultTempF: integer("default_temp_f"),
  isAvailable: integer("is_available", { mode: "boolean" }).default(true),
  sortOrder: integer("sort_order").default(0),
});

export const flavorProfiles = sqliteTable("flavor_profiles", {
  id: text("id").primaryKey(),
  name: text("name").unique().notNull(),
  slug: text("slug").unique().notNull(),
  icon: text("icon"),
  description: text("description"),
  isAvailable: integer("is_available", { mode: "boolean" }).default(true),
  sortOrder: integer("sort_order").default(0),
});

export const recipeTemplates = sqliteTable("recipe_templates", {
  id: text("id").primaryKey(),
  proteinId: text("protein_id")
    .notNull()
    .references(() => proteins.id),
  cookingMethodId: text("cooking_method_id")
    .notNull()
    .references(() => cookingMethods.id),
  flavorProfileId: text("flavor_profile_id")
    .notNull()
    .references(() => flavorProfiles.id),
  recipeType: text("recipe_type", {
    enum: ["dry_rub", "marinade", "brine"],
  }).notNull(),
  title: text("title").notNull(),
  ingredients: text("ingredients", { mode: "json" }).notNull(), // JSON array
  instructions: text("instructions", { mode: "json" }).notNull(), // JSON array
  prepTime: text("prep_time"),
  cookTime: text("cook_time"),
  restingTime: text("resting_time"),
  applyTiming: text("apply_timing"),
  targetTempF: integer("target_temp_f"),
  woodPairings: text("wood_pairings", { mode: "json" }), // JSON array
  sauceRecommendations: text("sauce_recommendations", { mode: "json" }), // JSON array
  sideRecommendations: text("side_recommendations", { mode: "json" }), // JSON array
  cookingTips: text("cooking_tips", { mode: "json" }), // JSON array
  isAvailable: integer("is_available", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const savedRecipes = sqliteTable("saved_recipes", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  recipeTemplateId: text("recipe_template_id").references(
    () => recipeTemplates.id
  ),
  protein: text("protein").notNull(),
  cookingMethod: text("cooking_method").notNull(),
  flavorProfile: text("flavor_profile").notNull(),
  recipeType: text("recipe_type").notNull(),
  title: text("title").notNull(),
  ingredients: text("ingredients", { mode: "json" }).notNull(),
  instructions: text("instructions", { mode: "json" }).notNull(),
  cookTime: text("cook_time"),
  targetTempF: integer("target_temp_f"),
  woodPairings: text("wood_pairings", { mode: "json" }),
  sauceRecommendations: text("sauce_recommendations", { mode: "json" }),
  sideRecommendations: text("side_recommendations", { mode: "json" }),
  cookingTips: text("cooking_tips", { mode: "json" }),
  notes: text("notes"),
  rating: integer("rating"),
  isFavorite: integer("is_favorite", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const recipeRatings = sqliteTable(
  "recipe_ratings",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    savedRecipeId: text("saved_recipe_id")
      .notNull()
      .references(() => savedRecipes.id),
    rating: integer("rating").notNull(),
    review: text("review"),
    createdAt: text("created_at").default(sql`(datetime('now'))`),
  },
  (table) => ({
    userRecipeUnique: uniqueIndex("user_recipe_unique").on(
      table.userId,
      table.savedRecipeId
    ),
  })
);

export const userSessions = sqliteTable("user_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  proteinsSelected: text("proteins_selected", { mode: "json" }), // JSON array
  methodsSelected: text("methods_selected", { mode: "json" }), // JSON array
  flavorsSelected: text("flavors_selected", { mode: "json" }), // JSON array
  recipesGenerated: integer("recipes_generated").default(0),
  recipesSaved: integer("recipes_saved").default(0),
  startedAt: text("started_at").default(sql`(datetime('now'))`),
  endedAt: text("ended_at"),
});

export const pageViews = sqliteTable("page_views", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  page: text("page").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  timestamp: text("timestamp").default(sql`(datetime('now'))`),
});
