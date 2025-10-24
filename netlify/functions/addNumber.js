import axios from "axios";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = "Avwilyz/databasenew";
  const filePath = "databasenew.json";

  try {
    const body = JSON.parse(event.body);
    let { number, time } = body;

    if (!number || !time) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: "Missing number or time" }) };
    }

    // Ambil data lama
    const getFile = await axios.get(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      headers: { Authorization: `token ${token}` }
    });

    const sha = getFile.data.sha;
    const existingData = JSON.parse(Buffer.from(getFile.data.content, "base64").toString());
    const newEntry = { number, time };

    // Tambah ke akhir
    existingData.push(newEntry);

    // Upload ulang ke GitHub
    await axios.put(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        message: `Add number ${number}`,
        content: Buffer.from(JSON.stringify(existingData, null, 2)).toString("base64"),
        sha
      },
      { headers: { Authorization: `token ${token}` } }
    );

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error("Error adding number:", error.message);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
  }
};
