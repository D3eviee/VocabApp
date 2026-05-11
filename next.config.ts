import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wrzucasz to bezpośrednio do głównego obiektu:
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
};

export default nextConfig;