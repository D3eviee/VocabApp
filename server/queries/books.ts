import { db } from "@/server/db";

export async function getBooks() {
  return await db.query.books.findMany({
    where: (table, { eq, and, lte }) => and(
        eq(table.status, "public"),
        lte(table.publishedAt, new Date()) 
    ),
    columns: {
      id: true,
      slug: true,
      title: true,
      bookAuthor: true,
      bookCoverAlt: true, 
      bookCover: true,
      category: true,
      publishedAt: true,
    },
    orderBy: (table, { desc }) => [desc(table.publishedAt)],
  });
}

export async function getSingleBook(slug:string) {
  return await db.query.books.findFirst({
    where: (table, { eq, and }) => and(
        eq(table.slug, slug),
        eq(table.status, "public")
    ),
    columns:{
      category: true,
      publishedAt: true,
      title: true,
      subtitle: true,
      bookCover: true,
      bookAuthor: true,
      bookCoverAlt: true,
      bookCoverAnnotation: true,
      blocks: true,
    }
  });
}

export async function getLatestBooks() {
   return await db.query.books.findMany({
    where: (table, { eq, and, lte }) => and(
        eq(table.status, "public"),
        lte(table.publishedAt, new Date()) 
    ),
    columns: {
      id: true,
      category: true,
      publishedAt: true,
      slug: true,
      title: true,
      bookCover: true,
      bookAuthor: true,
      bookCoverAlt: true,
    },
    limit: 3,
    orderBy: (table, { desc }) => [desc(table.publishedAt)],
  })
}