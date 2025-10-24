import axios from "axios";

export default async function handler(req, res) {
  const repo = "Avwilyz/databasenew";
  const filePath = "databasenew.json";

  try {
    const url = `https://raw.githubusercontent.com/${repo}/main/${filePath}?t=${Date.now()}`;
    const response = await axios.get(url, { headers: { "Cache-Control": "no-cache" } });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to load data", details: error.message });
  }
}
