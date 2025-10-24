import axios from "axios";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const repo = "Avwilyz/databasenew"; // repo kamu
  const filePath = "databasenew.json"; // file database nomor
  const token = process.env.GITHUB_TOKEN;

  try {
    const { number, name, note } = JSON.parse(event.body || "{}");
    if (!number) return { statusCode: 400, body: "Nomor wajib diisi" };

    let sha = null;
    let data = [];
    try {
      const getFile = await axios.get(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        headers: { Authorization: `token ${token}` }
      });
      sha = getFile.data.sha;
      const content = Buffer.from(getFile.data.content, "base64").toString("utf8");
      data = JSON.parse(content);
      if (!Array.isArray(data)) data = [];
    } catch (e) {}

    // Cek duplikat
    const exists = data.find((r) => r.number === number);
    if (exists) {
      return { statusCode: 200, body: JSON.stringify({ success: true, duplicated: true }) };
    }

    // Tambah record baru
    const record = {
      id: data.length > 0 ? data[data.length - 1].id + 1 : 1,
      number,
      name: name || "",
      note: note || "",
      created_at: new Date().toISOString()
    };
    data.push(record);

    // Simpan ke GitHub
    await axios.put(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        message: `Add number ${number}`,
        content: Buffer.from(JSON.stringify(data, null, 2)).toString("base64"),
        sha
      },
      { headers: { Authorization: `token ${token}` } }
    );

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: "Gagal menambah nomor" }) };
  }
}
