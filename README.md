# Mikeila XVIII — Taiwan Trip Companion V2.3

Mobile-first, offline-capable itinerary, interactive numbered route atlas, credited Wikimedia destination photos, and shared family expense wallet.

## V2.3 changes
- A transit-first recommendation card on every day's Itinerary and Routes pages.
- Fares shown only in NT$ and PHP, family-of-three basis where available. These are approximate allowances, not verified prices.
- DIY bus remains preferred on Alishan day, with Klook shuttle shown as the optional safer timed stop at Eryanping.
- API rejects invalid transaction batches instead of silently discarding bad entries.
- Offline cache bumped for upgrade.

## Existing Supabase project
Your `public.trip_expenses (id text primary key, data jsonb not null)` table already exists with RLS enabled. **Do not rerun SQL or alter existing tables.**

### Vercel settings (server only)
Add under Vercel project Settings > Environment Variables for Production:
- `SUPABASE_URL`: Project Settings > API > Project URL (public URL, not a secret).
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase legacy service_role secret API key. Store **server-side only**. **Warning: service_role is powerful and can access other tables, including sensitive patient records.**
- `TRIP_ACCESS_KEY`: Unique long random family passphrase, e.g. generate 32+ random bytes and store privately. Never commit.

**Security caveat:** Reusing the clinic database with a service-role key grants this application broad database privileges even though the current API code only requests `trip_expenses`. For *strong isolation*, use a separate Supabase project or replace the API with a tested least-privilege database role before adding this key. RLS does not limit `service_role`. Do not assume this setup is restricted at database level.

After saving Vercel variables, redeploy the *latest* deployment (not an old commit). In app Settings, enter `TRIP_ACCESS_KEY` on all three iPhones and test a dummy NT$10 purchase, sync on a second device, edit it, sync back, and delete it.

## iPhone installation
Open URL in Safari, Share > Add to Home Screen, open the icon while online, then test Airplane Mode. Route diagram and expense form work offline once cached; real map directions, updated timetables, and sync need internet. Remote images are not guaranteed offline.

## Upload to existing GitHub repo
If V2.2 files are already in repository, replace only `app.js`, `style.css`, `sw.js`, `api/sync.js`, and `README.md`. Keep the `api/sync.js` path. Other app files unchanged. Vercel deploys from GitHub main.

## Routing caveats
All rural bus connections on Dec 19–20, hotel shuttle, HSR arrival, luggage overnight storage, and the Klook date availability must be confirmed before tickets are locked. Approximate bus fares are not guaranteed.
