// lib/getPetsData.ts
"use server";

import fs from "fs";
import path from "path";

export async function getPetsData() {
  const filePath = path.join(process.cwd(), "data", "pets.json"); // Ajusta la ruta
  const jsonData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(jsonData);
}
