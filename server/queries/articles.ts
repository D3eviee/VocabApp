import { sql } from "drizzle-orm";
import { db } from "../db";

export async function getHeroArticles() {
  return await db.query.articles.findMany({
    where: (table, { eq, and, inArray }) => and(
      eq(table.status, "public"),
      inArray(table.priority, ["hero1", "hero2", "hero3"]) 
    ),
    columns: {
      id: true,
      slug: true,
      title: true,
      thumbnailAlt: true,
      thumbnailImage: true,
      priority: true,
      category: true,
      publishedAt: true,
    },
    orderBy: (table) => [
      sql`CASE ${table.priority} 
        WHEN 'hero1' THEN 1 
        WHEN 'hero2' THEN 2 
        WHEN 'hero3' THEN 3 
      END ASC`
    ],
  });
}


export async function getLatestArticles() {
  return await db.query.articles.findMany({
    where: (table, { eq, and,  }) => and(
      eq(table.status, "public"),
    ),
    columns: {
      id:true,
      slug: true,
      title: true,
      thumbnailAlt: true,
      thumbnailAnnotaion: true,
      thumbnailDescription: true,
      thumbnailImage: true,
      category: true,
      publishedAt: true,
    },
    orderBy: (table, { desc }) => [desc(table.publishedAt)],
    limit: 6,
  })
}

export async function getArticles() {
  return await db.query.articles.findMany({
    where: (table, { eq, and,  }) => and(
      eq(table.status, "public"),
    ),
    columns: {
      id:true,
      slug: true,
      title: true,
      thumbnailAlt: true,
      thumbnailAnnotaion: true,
      thumbnailDescription: true,
      thumbnailImage: true,
      category: true,
      publishedAt: true,
    },
    orderBy: (table, { desc }) => [desc(table.publishedAt)],
    limit: 10,
  })
}