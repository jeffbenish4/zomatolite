import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId) || restaurantId < 1) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  try {
    const sql = getSql();
    const restaurantRows = await sql`
      SELECT id, name, cuisine, area
      FROM restaurants
      WHERE id = ${restaurantId}
      LIMIT 1
    `;

    if (restaurantRows.length === 0) {
      return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
    }

    const summaryRows = await sql`
      SELECT
        ROUND(AVG(rating)::numeric, 1) AS "averageRating",
        COUNT(*)::int AS "totalReviews"
      FROM reviews
      WHERE restaurant_id = ${restaurantId}
    `;

    const allReviews = await sql`
      SELECT
        id,
        rating,
        comment,
        created_at AS "createdAt"
      FROM reviews
      WHERE restaurant_id = ${restaurantId}
      ORDER BY created_at DESC, id DESC
    `;

    const summary = summaryRows[0] as { averageRating: number | string | null; totalReviews: number };
    const latestReview = allReviews.length ? allReviews[0] : null;
    const olderReviews = allReviews.length > 1 ? allReviews.slice(1) : [];

    return NextResponse.json({
      name: restaurantRows[0].name,
      cuisine: restaurantRows[0].cuisine,
      area: restaurantRows[0].area,
      averageRating: summary.averageRating === null ? null : Number(summary.averageRating),
      totalReviews: Number(summary.totalReviews),
      latestReview,
      reviews: olderReviews
    });
  } catch (error) {
    console.error("GET restaurant failed:", error);
    return NextResponse.json(
      { error: "Unable to load restaurant data. Check the database configuration." },
      { status: 500 }
    );
  }
}
