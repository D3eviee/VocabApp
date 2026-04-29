import { pgTable, uuid, varchar, timestamp, index, pgEnum, text, integer, jsonb, real} from "drizzle-orm/pg-core";
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
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
  streak: integer("streak").default(0),
  lastStudyDate: timestamp("last_study_date"), 
}, (table) => [ index("idx_users_email").on(table.email) ]);

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


// Typ talii: Klasyczna (Fiszki) lub Roadmapa (Storytelling)
export const deckTypeEnum = pgEnum("deck_type", ["classic", "storytelling"]);

export const decks = pgTable("decks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 100 }).notNull(),
  type: deckTypeEnum("type").default("classic").notNull(), // Kluczowe rozróżnienie
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
  
  // STORY BOARDS
  dateLabel: varchar("date_label", { length: 50 }), // np. "15 Marca 2024"
  title: varchar("title", { length: 255 }),        // Tytuł karty w historii
  description: text("description"),                // Opis / treść opowieści
  order: integer("order").default(0).notNull(),

  dueDate: timestamp("due_date").defaultNow().notNull(), // Kiedy karta ma zostać wyświetlona ponownie
  interval: integer("interval").default(0).notNull(), // Aktualny odstęp między powtórkami (w dniach)
  easeFactor: real("ease_factor").default(2.5).notNull(), // Współczynnik łatwości (domyślnie 2.5 jak w algorytmie SM-2)
  repetitions: integer("repetitions").default(0).notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
});