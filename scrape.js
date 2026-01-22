const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    viewport: { width: 1920, height: 1080 },
    locale: "en-US"
  });

  const page = await context.newPage();

  await page.goto(
    "https://www.hotstar.com/in/sports/cricket/tournaments/india-vs-new-zealand",
    { waitUntil: "domcontentloaded" }
  );

  await page.waitForTimeout(15000);

  // Scroll to force lazy load
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(1200);
  }

  const data = await page.evaluate(() => {
    const out = [];

    document.querySelectorAll("img[alt]").forEach(img => {
      const title = img.alt?.trim();
      const src = img.currentSrc || img.src;

      if (!title || !src) return;
      if (!src.includes("hotstar")) return;
      if (title.toLowerCase().includes("hotstar")) return;

      out.push({ title, image: src });
    });

    return out;
  });

  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  console.log("Saved:", data.length);

  await browser.close();
})();
