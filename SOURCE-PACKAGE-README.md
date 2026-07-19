# DentAlchemy Appointment Landing Page

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local URL shown in the terminal.

## Production build

Run `npm run build`.

## Main files

- `app/page.tsx` — landing page content and interactions
- `app/globals.css` — responsive design and animations
- `app/layout.tsx` — SEO metadata and page layout
- `public/assets/` — logo, hero, doctors, and treatment images

The appointment form and guided DentBot create a prefilled WhatsApp message. Update the clinic phone number and WhatsApp number in `app/page.tsx` if required.
