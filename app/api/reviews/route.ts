import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Request body must be a JSON object." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const restaurantId = data.restaurantId;
  const rating = data.rating;
  const comment = typeof data.comment === "string" ? data.comment.trim() : "";

  if (!Number.isInteger(rating) || Number(rating) < 1 || Number(rating) > 5) {
    return NextResponse.json({ error: "Rating must be a whole number from 1 to 5." }, { status: 400 });
  }

  if (!comment) {
    return NextResponse.json({ error: "Comment must not be empty." }, { status: 400 });
  }

  if (!Number.isInteger(restaurantId) || Number(restaurantId) < 1) {
    return NextResponse.json({ error: "Restaurant does not exist." }, { status: 400 });
  }

  try {
    const sql = getSql();
    const restaurantRows = await sql`
      SELECT id FROM restaurants WHERE id = ${Number(restaurantId)} LIMIT 1
    `;

    if (restaurantRows.length === 0) {
      return NextResponse.json({ error: "Restaurant does not exist." }, { status: 400 });
    }

    const inserted = await sql`
      INSERT INTO reviews (restaurant_id, rating, comment)
      VALUES (${Number(restaurantId)}, ${Number(rating)}, ${comment})
      RETURNING id
    `;

    return NextResponse.json({ success: true, reviewId: inserted[0].id }, { status: 201 });
  } catch (error) {
    console.error("POST review failed:", error);
    return NextResponse.json(
      { error: "Unable to save the review. Check the database configuration." },
      { status: 500 }
    );
  }
}
