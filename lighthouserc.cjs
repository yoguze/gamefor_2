module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start -- --port 3000",
      startServerReadyPattern: "Ready",
      url: ["http://127.0.0.1:3000/"],
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
        chromeFlags: "--no-sandbox --disable-dev-shm-usage --headless=new",
      },
    },
    assert: {
      // CI 共有ランナー向けに、致命的な崩れだけ error にする
      assertions: {
        "categories:performance": ["warn", { minScore: 0.6 }],
        "categories:accessibility": ["warn", { minScore: 0.85 }],
        "categories:best-practices": ["warn", { minScore: 0.85 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 4000 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 6000 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.25 }],
        "total-blocking-time": ["warn", { maxNumericValue: 800 }],
        interactive: ["warn", { maxNumericValue: 10000 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
};
