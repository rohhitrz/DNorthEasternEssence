const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isDev ? ["'unsafe-eval'"] : []),
  "https://js.stripe.com",
  "https://checkout.razorpay.com",
  "https://*.clerk.accounts.dev",
  "https://challenges.cloudflare.com",
  "https://hcaptcha.com",
  "https://*.hcaptcha.com",
  "https://www.google.com",
  "https://www.gstatic.com",
].join(" ");

const csp = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://images.pexels.com https://*.clerk.accounts.dev https://img.clerk.com https://images.clerk.dev https://hcaptcha.com https://*.hcaptcha.com https://www.google.com https://www.gstatic.com",
  `script-src ${scriptSrc}`,
  "worker-src 'self' blob: https://*.clerk.accounts.dev",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://api.stripe.com https://api.razorpay.com https://*.clerk.accounts.dev https://api.resend.com https://challenges.cloudflare.com https://hcaptcha.com https://*.hcaptcha.com https://www.google.com",
  "frame-src 'self' https://js.stripe.com https://api.razorpay.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://hcaptcha.com https://*.hcaptcha.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
