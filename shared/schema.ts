import { sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Galleries table - migrated from JSON data
export const galleries = pgTable("galleries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  slug: varchar("slug").unique().notNull(),
  model: varchar("model").notNull(),
  category: varchar("category").notNull(),
  cover: varchar("cover").notNull(),
  images: jsonb("images").notNull().$type<Array<{src: string; alt: string; caption?: string}>>(),
  tags: text("tags").array().default([]),
  publishedAt: timestamp("published_at").defaultNow(),
  viewCount: integer("view_count").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0"),
  ratingCount: integer("rating_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User favorites
export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  galleryId: varchar("gallery_id").notNull().references(() => galleries.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// User ratings
export const ratings = pgTable("ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  galleryId: varchar("gallery_id").notNull().references(() => galleries.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5 stars
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gallery views for analytics and recommendations
export const views = pgTable("views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }), // nullable for anonymous views
  galleryId: varchar("gallery_id").notNull().references(() => galleries.id, { onDelete: "cascade" }),
  viewedAt: timestamp("viewed_at").defaultNow(),
  ipAddress: varchar("ip_address"), // for anonymous tracking
  userAgent: text("user_agent"),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
  ratings: many(ratings),
  views: many(views),
}));

export const galleriesRelations = relations(galleries, ({ many }) => ({
  favorites: many(favorites),
  ratings: many(ratings),
  views: many(views),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  gallery: one(galleries, {
    fields: [favorites.galleryId],
    references: [galleries.id],
  }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  user: one(users, {
    fields: [ratings.userId],
    references: [users.id],
  }),
  gallery: one(galleries, {
    fields: [ratings.galleryId],
    references: [galleries.id],
  }),
}));

export const viewsRelations = relations(views, ({ one }) => ({
  user: one(users, {
    fields: [views.userId],
    references: [users.id],
  }),
  gallery: one(galleries, {
    fields: [views.galleryId],
    references: [galleries.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGallerySchema = createInsertSchema(galleries).omit({
  id: true,
  viewCount: true,
  averageRating: true,
  ratingCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  rating: z.number().min(1).max(5),
});

export const insertViewSchema = createInsertSchema(views).omit({
  id: true,
  viewedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Gallery = typeof galleries.$inferSelect;
export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type View = typeof views.$inferSelect;
export type InsertView = z.infer<typeof insertViewSchema>;

// Legacy schema for compatibility
export const galleryPostSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
  model: z.string(),
  category: z.string(),
  cover: z.string(),
  slug: z.string(),
  images: z.array(z.object({
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional()
  }))
});

export const galleryPostMetaSchema = galleryPostSchema.omit({ images: true }).extend({
  imageCount: z.number(),
  likes: z.number().default(0)
});

export const modelSchema = z.object({
  name: z.string(),
  slug: z.string(),
  avatar: z.string(),
  bio: z.string(),
  galleryCount: z.number(),
  totalLikes: z.number(),
  joinDate: z.string()
});

export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  models: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  dateRange: z.enum(['all', 'week', 'month', 'year']).optional(),
  sortBy: z.enum(['date', 'likes', 'title', 'rating', 'views']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
});

export type GalleryPost = z.infer<typeof galleryPostSchema>;
export type GalleryPostMeta = z.infer<typeof galleryPostMetaSchema>;
export type Model = z.infer<typeof modelSchema>;
export type SearchFilters = z.infer<typeof searchFiltersSchema>;

// Static data types for the gallery
export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface GalleryData {
  posts: GalleryPost[];
  models: Model[];
  categories: string[];
  tags: string[];
}
