 "use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewForm({ restaurantId }: { restaurantId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = rating >= 1 && rating <= 5 && comment.trim().length > 0 && !submitting;

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId: Number(restaurantId), rating, comment })
      });
      const result = await response.json();
      if (!response.ok) {
        setError(typeof result.error === "string" ? result.error : "Unable to submit review.");
        return;
      }
      router.push(`/restaurant/${encodeURIComponent(restaurantId)}`);
      router.refresh();
    } catch {
      setError("Unable to submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <div className="content">
        <Link className="back-link" href={`/restaurant/${encodeURIComponent(restaurantId)}`}>← Back to restaurant</Link>
        <div className="eyebrow">Your experience matters</div>
        <h1 className="restaurant-name">Write a review</h1>
        <div className="subline">Ludhiana Burrito · Indian · Sector 32</div>

        <form className="form-card" onSubmit={submitReview}>
          <label className="field-label">Your rating</label>
          <div className="star-picker" role="group" aria-label="Choose a rating from one to five stars">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                className={`star-button ${rating >= value ? "selected" : ""}`}
                type="button"
                key={value}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                aria-pressed={rating === value}
                onClick={() => setRating(value)}
              >★</button>
            ))}
          </div>

          <label className="field-label" htmlFor="comment">Your review</label>
          <textarea
            className="comment-input"
            id="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={2000}
            placeholder="What should others know?"
            required
          />
          <button className="primary-button" type="submit" disabled={!canSubmit}>
            {submitting ? "Submitting…" : "Submit review"}
          </button>
          {error && <p className="error-message" role="alert">{error}</p>}
        </form>
        <div className="footer-note">Keep it honest, helpful and kind.</div>
      </div>
    </main>
  );
}
