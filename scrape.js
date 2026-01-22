const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(
    "https://www.hotstar.com/in/sports/cricket/tournaments/india-vs-new-zealand",
    { waitUntil: "domcontentloaded" }
  );

  // Give time for JS
  await page.waitForTimeout(8000);

  // Scroll to trigger lazy loading
  await page.evaluate(async () => {
    for (let i = 0; i < 5; i++) {
      window.scrollBy(0, window.innerHeight);
      await new Promise(r => setTimeout(r, 1500));
    }
  });

  const data = await page.evaluate(() => {
    const items = [];

    document.querySelectorAll('img[alt]').forEach(img => {
      const title = img.getAttribute("alt")?.trim();
      const src =
        img.getAttribute("src") ||
        img.getAttribute("data-src");

      if (!title || !src) return;

      if (!src.includes("hotstar")) return;
      if (title.toLowerCase().includes("hotstar")) return;

      items.push({ title, image: src });
    });

    return items;
  });

  console.log(JSON.stringify(data, null, 2));

  await browser.close();
})();
