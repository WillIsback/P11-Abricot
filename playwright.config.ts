import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/visual",
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: [["html", { outputFolder: "playwright-report" }]],
	use: {
		baseURL: "http://localhost:3000",
		trace: "on-first-retry",
		screenshot: "on",
		viewport: { width: 1440, height: 900 },
	},
	projects: [
		{
			name: "setup",
			testMatch: /auth\.setup\.ts/,
		},
		{
			name: "visual-tests",
			dependencies: ["setup"],
			use: {
				storageState: "tests/.auth/user.json",
			},
			testIgnore: /auth\.setup\.ts/,
		},
	],
	webServer: {
		command: "npx pnpm dev",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
		timeout: 120000,
	},
});
