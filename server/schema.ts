import { pgTable, uuid, varchar, timestamp, index, pgEnum, text, integer, jsonb, real, boolean} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const partOfSpeechEnum = pgEnum("part_of_speech", [
  "noun",           
  "adjective",      
  "verb",           
  "adverb",         
  "phrasal_verb",   
  "idiom",          
  "preposition",    
  "conjunction",
  "pronoun",    
  "interjection"
]);

export type WordVariation = {
  word: string;
  partOfSpeech: (typeof partOfSpeechEnum.enumValues)[number];
  examples: string[];
};

export interface Meaning {
  id: string;
  back: string;
  examples: string[];
}

// USERS
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull().notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
  streak: integer("streak").default(0),
  lastStudyDate: timestamp("last_study_date"), 

  // STRIPE
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }).unique(),
  stripePriceId: varchar("stripe_price_id", { length: 255 }),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  stripeCancelAtPeriodEnd: boolean("stripe_cancel_at_period_end").default(false),
}, 
  (table) => [ index("idx_users_email").on(table.email) ]
);


// SESSIONS
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
});

// RELATION FOR USER SESSIONS
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));


// TYPE OF CARD
export const deckTypeEnum = pgEnum("deck_type", ["classic", "storytelling"]);

export const decks = pgTable("decks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 100 }).notNull(),
  type: deckTypeEnum("type").default("classic").notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const deckItems = pgTable("deck_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  deckId: uuid("deck_id").notNull().references(() => decks.id, { onDelete: "cascade" }),

  // CARDS
  front: text("front"),
  partOfSpeech: varchar("part_of_speech", { length: 30 }),
  meanings: jsonb("meanings").$type<Meaning[]>().default([]).notNull(),
  variations: jsonb("variations").$type<WordVariation[]>().default([]).notNull(),
  
  // STORYBOARDS
  dateLabel: varchar("date_label", { length: 50 }), 
  title: varchar("title", { length: 255 }),        
  description: text("description"),                
  order: integer("order").default(0).notNull(),

  dueDate: timestamp("due_date").defaultNow().notNull(),
  interval: integer("interval").default(0).notNull(), 
  easeFactor: real("ease_factor").default(2.5).notNull(), 
  repetitions: integer("repetitions").default(0).notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// HOW THE PLAYGROUND BEEN CREATED
export const sourceTypeEnum = pgEnum("source_type", ["upload", "search", "generate"]);

export const playgrounds = pgTable("playgrounds", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 50 }).notNull(),
  sourceType: sourceTypeEnum("source_type").notNull(),
  originalQuery: text("original_query"),
  modelUrl: text("model_url"),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const playgroundFlashcards = pgTable("playgroundFlashcards", {
  id: uuid("id").defaultRandom().primaryKey(),
  playgroundId: uuid("playground_id").notNull().references(() => playgrounds.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  positionX: real("position_x").notNull(),
  positionY: real("position_y").notNull(),
  positionZ: real("position_z").notNull(),
  meshName: text("mesh_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// CARD LOG
export const reviewLogs = pgTable("review_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  deckItemId: uuid("deck_item_id").notNull().references(() => deckItems.id, { onDelete: "cascade" }),
  isCorrect: boolean("is_correct").notNull(), 
  reviewedAt: timestamp("reviewed_at").defaultNow().notNull(),
});