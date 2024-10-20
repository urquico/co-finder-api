import puppeteer from "puppeteer";
import express from "express";
import { scrape } from "./scrape";

const app = express();

const port = 3000;

app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.get("/all/shops", async (req, res) => {
  const shops = await scrape({
    verbose: false,
    context: req.query.context as string,
    coordinates: req.query.coordinates as string,
  });

  res.json(shops);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
