import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ success: false, message: "Method not allowed" });

  const { number, time } = req.body;
  const repo = "Avwilyz/databasenew";
  const filePath = "databasenew.json";
  const token = process.env.GITHUB_TOKEN; // simpan token di environment variable

  try {
    const getFile = await axios.get(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      headers: { Authorization: `token ${token}` },
    });

    let data = JSON.parse(Buffer.from(getFile.data.content, "base64").toString());
    if (!Array.isArray(data)) data = [];

    if (data.find(d => d.number === number))
      return res.status(400).json({ success: false, message: "Nomor sudah terdaftar" });

    data.push({ number, time });

    await axios.put(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        message: `Add number ${number}`,
        content: Buffer.from(JSON.stringify(data, null, 2)).toString("base64"),
        sha: getFile.data.sha,
      },
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to save data", error: error.message });
  }
}
