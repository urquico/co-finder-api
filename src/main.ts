import puppeteer from "puppeteer";
import express from "express";
import { findOptimalPath, scrape } from "./scrape";

const app = express();

const port = 3000;

app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.get("/all/shops", async (req, res) => {
  const shops = await scrape({
    verbose: true,
    context: req.query.context as string,
    coordinates: req.query.coordinates as string,
  });

  res.json(shops);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/optimal-path", async (req, res) => {
  const coordinates: string = req.query.coordinates as string;
  const shopCoordinates: string = req.query.shopCoordinates as string;

  const optimalPath = await findOptimalPath(coordinates, shopCoordinates);

  res.json(optimalPath);
});
