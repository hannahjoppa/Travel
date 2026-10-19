# Mikeila XVIII — Taiwan Companion · V2 Interactive Route Atlas

A mobile-first offline PWA with daily itinerary, maps links, luggage reminders, and a family expense tracker from MNL airport through the return to Manila. The ₱50,000 wallet **excludes prepaid hotels, flights and HSR** (you may still log them as 'excluded'). Starts with zero transactions.

## What V2 adds
- **Interactive daily route atlas** (SVG, no street tiles): tappable numbered stops, traced travel segments, zoom +/- buttons, estimated mode and travel time, detailed ETA/ETD, direct Google Maps links. Works offline after installation. Not geographically to scale; estimates are marked as estimates.
- **Real destination photographs** linked from Wikimedia Commons, with visible source and license links. Photos require internet at first view and are not guaranteed offline because image hosts can block/cache differently; route atlas itself is offline.
- **ETA/ETD on each itinerary entry** when a schedule supports it; unknown departures display Flexible/Confirm rather than made-up timings.
- **Existing 50k wallet, prepaid exclusions, CSV/JSON, offline storage remain intact.**

## What works with no setup
- Five-day itinerary (Dec 17–21, 2026), stop-by-stop notes and offline schematic routes.
- Offline transaction recording on **each individual phone**, PHP and TWD entries, categories, payer, payment mode, family/personal fields, excluded prepaid items.
- Budget dashboard, transaction edit/delete, CSV export, JSON backup/import.
- Vercel hosting + Add to Home Screen installation after first online visit.

**Important:** Without optional cloud setup, expenses entered on different phones are NOT automatically shared. They are stored locally on that phone only. The itinerary and PWA files are offline, but live Google Maps, bus timetables and sync require internet.

## Deploy on Vercel
1. Unzip the folder. Put all contents in one GitHub repository (keep `index.html`, `sw.js`, `api/sync.js` and other files in their current locations).
2. Sign into Vercel, **Add New → Project → Import Git Repository**.
3. Framework Preset: **Other**. No build command. Deploy.
4. Visit your HTTPS Vercel URL in Safari; open it once online, then Share → Add to Home Screen. Repeat on three phones.
5. Verify Airplane Mode by opening the Home Screen icon and saving a sample entry. Delete the sample entry afterward.

## Turn on cross-device shared wallet (recommended)
1. In your existing Supabase dashboard, create a **SEPARATE project for the trip** if possible to avoid mixing with clinic or other data.
2. In Supabase SQL Editor, paste/run `supabase.sql`.
3. In Supabase Project Settings → API Keys, obtain project URL and **service_role secret key**. Treat service_role as a password. Never insert it into HTML or share it with others.
4. On Vercel → Project → Settings → Environment Variables, add:
   - `SUPABASE_URL` = Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = secret service_role key
   - `TRIP_ACCESS_KEY` = a long unique random secret phrase (ideally 32+ characters; never a 4-digit PIN).
5. **Redeploy** Vercel after setting environment variables.
6. On each of the three phones, open Settings in the app → enter the exact same `TRIP_ACCESS_KEY` → **Save & sync**.
7. To test, add an expense on one phone online. On another phone, tap Sync now or reopen the app with internet. The same transaction should appear.
8. Offline edits stay on the phone and automatically upload next time a connection is restored and the app is opened. Export occasional JSON backups.

**Security:** API requires the family secret, stored on each device. The example API uses a server-only Supabase service-role key, which remains powerful across this database, including other apps. **Do not configure it against a shared database containing clinic records until switching to least-privilege database access or a separate project.** This build does not supply that restriction yet. Once adequately isolated, a strong family key is also required., RLS disallows browser table access. This is a lightweight private-family app, not a financial/banking platform; don't reuse important passwords as your key. The cloud API reads and merges all entries and best suits a single family; use a separate Supabase project/table. A strong, unguessable family secret matters because the sync endpoint is Internet-accessible. Beware shared/borrowed phones that retain the secret.

## Budget breakdown (PHP)
- Food & drinks: ₱15,000
- Shopping: ₱15,000
- Local transport: ₱7,000
- Activities: ₱4,000
- Contingency: ₱9,000
- Total: ₱50,000

The wallet enforces one overall ₱50,000 ceiling; category numbers are planning allocations, not separate hard limits. Default approximate exchange rate NT$1 = ₱2 is editable in Settings.

## Scheduling cautions / confirmed vs pending
- Dec 19: Chiayi HSR bus 7329 09:30 to Alishan 12:00 is on the published timetable; reconfirm December service and HSR arrival buffer.
- Dec 19: 15:00-ish bus downhill to Shizhuo and 16:30 Siang Ting check-in are **targets** requiring confirmation with the operator and accommodation.
- Dec 20: Shizhuo → Fenqihu → Chiayi → CCU → HSR is **provisional**. Sunday bus timings, directions and seats must be confirmed BEFORE booking the northbound HSR. If the connections do not work, prioritize CCU; Fenqihu is optional.
- HSR Chiayi: do not rely on 3 large overnight lockers without checking availability, time limits, and retrieval window. Plan an alternate luggage solution.
- Confirm Holiday Inn HSR pickup/last-mile travel and its Dec 21 airport transfer directly with hotel.
- Massage in Shizhuo is not verified and is optional.

## Verify sources
- https://www.taiwanbus.tw/eBUSPage/Query/QueryResult.aspx?lan=E&rno=73290
- https://www.taiwanbus.tw/eBUSPage/Query/QueryResult.aspx?lan=E&rno=73020
- https://www.taiwanbus.tw/eBUSPage/Query/QueryResult.aspx?lan=E&rno=07460
- https://alishan.welcometw.com/tour/VNar?lang=en_US

## Notes
The service worker caches the app shell, not external Google Maps. If you upgrade the source, bump `CACHE` in `sw.js` and reload on each phone. Expense data persists separately in browser localStorage and is not removed by ordinary PWA cache updates, though clearing website data/deleting the app can remove it. Download a backup.
