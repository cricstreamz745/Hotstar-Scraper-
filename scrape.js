import fs from "fs";
import fetch from "node-fetch";

const API_URL = "https://www.hotstar.com/api/internal/bff/v2/slugs/in/browse/editorial/ind-vs-nz-highlights/1271523984";

const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJoSWRcIjpcIjNiZWE3YmEzYjI0ZjQ1ZGE4MTY2ZmQ0MDA2MzcyMmM1XCIsXCJwSWRcIjpcIjdhMDkwY2M4ZTMzYzQ2ODI5MzlmMWNhZjlkOTFhY2I3XCIsXCJkd0hpZFwiOlwiMTg2MjllMTczYjQ5MTMyMTkyMTUyOTQyNjgxZTE4MzU4ZjEyZTBiM2RmMWQxZTk4Yzg3MDllODJjMGM0MGUzMlwiLFwiZHdQaWRcIjpcIjViNWJlNzNhOGZjMTQ4ZjAyZGYwMjQwNjFiMWVkNGM3YTQxYmE1ZWQ1ODM3MWY4MDkyYzE1YTg3OGI5NzkwNWFcIixcIm9sZEhpZFwiOlwiM2JlYTdiYTNiMjRmNDVkYTgxNjZmZDQwMDYzNzIyYzVcIixcIm9sZFBpZFwiOlwiN2EwOTBjYzhlMzNjNDY4MjkzOWYxY2FmOWQ5MWFjYjdcIixcImlzUGlpVXNlck1pZ3JhdGVkXCI6ZmFsc2UsXCJuYW1lXCI6XCJZb3VcIixcImlwXCI6XCIyNDA5OjQwZTQ6M2Y6YjkxNjo4MDAwOjpcIixcImNvdW50cnlDb2RlXCI6XCJpblwiLFwiY3VzdG9tZXJUeXBlXCI6XCJudVwiLFwidHlwZVwiOlwiZ3Vlc3RcIixcImlzRW1haWxWZXJpZmllZFwiOmZhbHNlLFwiaXNQaG9uZVZlcmlmaWVkXCI6ZmFsc2UsXCJkZXZpY2VJZFwiOlwiMWE1MWYwLTUxNTM5ZS1mMzg5Zi00ZmMwMThcIixcInByb2ZpbGVcIjpcIkFEVUxUXCIsXCJ2ZXJzaW9uXCI6XCJ2MlwiLFwic3Vic2NyaXB0aW9uc1wiOntcImluXCI6e319LFwiaXNzdWVkQXRcIjoxNzY5MTA0MTkyNzYzLFwiZHBpZFwiOlwiN2EwOTBjYzhlMzNjNDY4MjkzOWYxY2FmOWQ5MWFjYjdcIixcInN0XCI6MSxcImRhdGFcIjpcIkNnUUlBQklBQ2dRSUFFSUFDZ3dJQUNJSWtBR1k1NUhJbXpNS0JBZ0FPZ0FLQkFnQUtnQUtCQWdBTWdBPVwifSIsImlzcyI6IlVNIiwiZXhwIjoxNzY5MTkwNTkyLCJqdGkiOiJlNzllOWMwZmZhOWE0Y2QyODM1ZmFiZDA2YjE2NmQ5MiIsImlhdCI6MTc2OTEwNDE5MiwiYXBwSWQiOiIiLCJ0ZW5hbnQiOiIiLCJ2ZXJzaW9uIjoiMV8wIiwiYXVkIjoidW1fYWNjZXNzIn0.Bt4feAk8vpmQ4sQ1eZHNPrHzaGKXrFeIxc8lVGI5DBQ";

const headers = {
  "accept": "application/json",
  "authorization": `Bearer ${TOKEN}`,
  "user-agent": "Mozilla/5.0",
};

(async () => {
  const res = await fetch(API_URL, { headers });
  const json = await res.json();

  // Save raw response first
  fs.writeFileSync("raw.json", JSON.stringify(json, null, 2));

  // Example extraction (we will refine this)
  const items = [];

  function walk(obj) {
    if (typeof obj !== "object" || obj === null) return;

    if (obj.title && obj.image) {
      items.push({
        title: obj.title,
        image: obj.image
      });
    }

    for (const k in obj) {
      walk(obj[k]);
    }
  }

  walk(json);

  fs.writeFileSync("data.json", JSON.stringify(items, null, 2));
  console.log("Saved", items.length, "items");
})();
