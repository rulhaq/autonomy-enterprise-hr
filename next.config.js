/**
 * Autonomy Enterprise HR Assistant
 * 
 * Copyright (c) 2025 Scalovate Systems Solutions
 * 
 * MIT License (Educational Use) - See LICENSE file for details
 * 
 * DISCLAIMER:
 * This software is provided for EDUCATIONAL PURPOSES ONLY and "as is" without warranty
 * of any kind. Users must configure their own Firebase project and Groq API keys.
 * 
 * IMPORTANT RESTRICTIONS:
 * - Educational use only
 * - Reselling is NOT allowed
 * - For customization/modification, contact support@scalovate.com
 * - Replace demo credentials with your own before any use
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: true, // Required for static export
  },
  // Fix for WebSocket HMR issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    // Exclude scripts from build
    config.module.rules.push({
      test: /scripts\/.*\.ts$/,
      use: 'ignore-loader',
    });
    return config;
  },
  // Static export for Firebase Hosting
  // API routes removed - using client-side Groq calls instead
  output: 'export',
  trailingSlash: true,
  // Skip static generation for pages that need auth
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig

