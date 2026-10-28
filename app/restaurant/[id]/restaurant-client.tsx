 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Review = { id: number; rating: number; comment: string; createdAt: string };
type Restaurant = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export default function RestaurantClient({ restaurantId }: { restaurantId: string }) {
  const [data, setData] = useState<Restaurant | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(`/api/restaurants/${encodeURIComponent(restaurantId)}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to load restaurant.");
        return result as Restaurant;
      })
      .then((result) => { if (active) setData(result); })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Unable to load restaurant.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [restaurantId]);

  if (loading) return <main className="page-shell"><div className="content">Loading restaurant…</div></main>;
  if (error || !data) return <main className="page-shell"><div className="content"><p className="error-message">{error || "Restaurant not found."}</p><Link className="action-link" href="/restaurant/1">Return to restaurant</Link></div></main>;

  return (
    <main className="page-shell">
      <div className="content">
        <div className="eyebrow">A neighbourhood favourite</div>
        <h1 className="restaurant-name">{data.name}</h1>
        <div className="subline">{data.cuisine} · {data.area}</div>

        <div className="rating-row">
          <div className="rating-value">{data.averageRating === null ? "—" : data.averageRating.toFixed(1)}</div>
          <div className="rating-caption">
            <div>{data.totalReviews === 1 ? "1 review" : `${data.totalReviews} reviews`}</div>
            <div>Community rating</div>
          </div>
        </div>

        <div className="section-label">Latest review</div>
        {data.latestReview ? (
          <article className="review-card">
            <div className="review-top">
              <span className="review-stars" aria-label={`${data.latestReview.rating} out of 5 stars`}>{"★".repeat(data.latestReview.rating)}{"☆".repeat(5 - data.latestReview.rating)}</span>
              <time dateTime={data.latestReview.createdAt}>{dateLabel(data.latestReview.createdAt)}</time>
            </div>
            <p className="review-comment">{data.latestReview.comment}</p>
          </article>
        ) : (
          <div className="empty-state">No reviews yet. Be the first to share your experience.</div>
        )}

        {data.reviews.length > 0 && (
          <>
            <div className="section-label">Earlier reviews</div>
            <div className="older-list">
              {data.reviews.map((review) => (
                <article className="older-review" key={review.id}>
                  <div className="review-top">
                    <span className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                    <time dateTime={review.createdAt}>{dateLabel(review.createdAt)}</time>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </article>
              ))}
            </div>
          </>
        )}

        <Link className="action-link" href={`/review/${encodeURIComponent(restaurantId)}`}>Write a review <span aria-hidden="true">&nbsp;↗</span></Link>
        <div className="footer-note">Thoughtful reviews help people find their next favourite.</div>
      </div>
    </main>
  );
}
