# DentAlchemy Appointment Landing Page

This is a Next.js 16 application for DentAlchemy, a dental clinic based in Hennur, Bangalore. It provides a landing page with a chatbot, lead generation, and clinic information.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

The application uses standard Next.js environment variables. You can create a `.env` or `.env.local` file in the root directory for local development:

```env
# Contact Details
NEXT_PUBLIC_WHATSAPP_NUMBER="919606948060"
NEXT_PUBLIC_CLINIC_PHONE="+919606948060"
NEXT_PUBLIC_CLINIC_PHONE_DISPLAY="+91 96069 48060"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

# Google Sheets Configuration
GOOGLE_SHEETS_API_URL="your_google_sheets_webhook_url"
```

*Note: Frontend variables must be prefixed with `NEXT_PUBLIC_`. Backend variables (like Google Sheets API URL) should remain without the prefix to stay secure.*

## Available Scripts

- `npm run dev`: Start the development server on `localhost:3000`
- `npm run build`: Build the application for production
- `npm start`: Start the production server (after running build)
- `npm run lint`: Run ESLint checks

## Deployment

This is a standard Next.js application, which can be deployed to any Node.js hosting provider.

### Vercel
The easiest way to deploy is on Vercel:
1. Connect your GitHub repository to Vercel.
2. Vercel will automatically detect the Next.js framework.
3. Add your environment variables in the Vercel dashboard.
4. Click Deploy.

### Render / Railway / DigitalOcean App Platform
1. Connect your repository.
2. Set the build command to `npm run build`.
3. Set the start command to `npm start`.
4. Add your environment variables.
5. Deploy!

### cPanel / VPS Node.js App
1. Upload your code to the server.
2. Run `npm install --production`.
3. Build the app using `npm run build`.
4. Setup PM2 or Passenger (cPanel) to run `npm start`.
5. Ensure environment variables are loaded in your `.env` file or hosting environment.
