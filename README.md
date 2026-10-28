# Zomato Lite deployment setup

A small full-stack restaurant review application built with Next.js 15, TypeScript, Neon PostgreSQL, and raw SQL.

## Routes

- `/restaurant/1` — restaurant details, computed rating, latest review, older reviews
- `/review/1` — submit a review
- `GET /api/restaurants/1` — restaurant data API
- `POST /api/reviews` — create a review

## 1. Create the database tables

1. Open your Neon project in the browser.
2. Open **SQL Editor**.
3. Open `db/schema.sql` from this repository and copy its contents into the SQL Editor.
4. Run the SQL.
5. Confirm that the `restaurants` table has one restaurant and `reviews` has three sample reviews.

The SQL is safe to re-run for the seeded restaurant/reviews, and it does not create stored average or latest-review columns.

## 2. Add the database connection in Vercel

After importing this repository into Vercel:

1. Open **Project → Settings → Environment Variables**.
2. Add `DATABASE_URL`.
3. Paste the connection string copied from Neon. Do not add it to source files or GitHub.
4. Select Production (and Preview if you want preview deployments to use the database).
5. Save and redeploy.

Do not use a `NEXT_PUBLIC_` prefix for this variable.

## 3. Deploy

1. Create a private GitHub repository named `zomato-lite`.
2. Upload the extracted contents of this folder to the repository root. The `app` and `db` directories must remain directories at the root.
3. In Vercel, choose **Add New → Project**, import the repository, and deploy.
4. Set `DATABASE_URL` before testing the production site.

Vercel will install dependencies and build the project. No local Node.js installation is required.

## Security

- Never commit `.env.local`, database passwords, or access tokens.
- If a token or password was shared in a document or chat, rotate/revoke it.
- This learning app intentionally has no authentication or rate limiting. Do not use it for sensitive or high-traffic production workloads without adding appropriate protections.

## Tests after deployment

- Open `/restaurant/1`.
- Open `/review/1` and submit a review.
- Verify the new review appears and average/count update.
- Open `/api/restaurants/999` and expect HTTP 404.
- Submit rating `500` to `POST /api/reviews` and expect HTTP 400.
