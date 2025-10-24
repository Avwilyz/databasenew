import axios from "axios";

export async function handler() {
  const repo = "Avwilyz/databasenew"; // repo kamu
  const filePath = "databasenew.json"; // file JSON tempat database nomor
  const token = process.env.GITHUB_TOKEN;

  try {
    const file = await axios.get(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      headers: { Authorization: `token ${token}` }
    });

    const content = Buffer.from(file.data.content, "base64").toString("utf8");
    const data = JSON.parse(content);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Array.isArray(data) ? data : [])
    };
  } catch (err) {
    if (err?.response?.status === 404) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: "[]"
      };
    }
    return { statusCode: 500, body: JSON.stringify({ error: "Gagal ambil data" }) };
  }
}
