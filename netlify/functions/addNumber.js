export async function handler(event) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };

  const token = process.env.GITHUB_TOKEN;
  const repo = "Avwilyz/databasenew";
  const filePath = "databasenew.json";

  try {
    const { number, time } = JSON.parse(event.body || "{}");
    if (!number || !time) return { statusCode: 400, body: JSON.stringify({ success: false }) };

    const getFile = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      headers: { Authorization: `token ${token}` },
    });
    const file = await getFile.json();
    const sha = file.sha;
    const existing = JSON.parse(Buffer.from(file.content, "base64").toString());
    existing.push({ number, time });

    const update = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      method: "PUT",
      headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Add number ${number}`,
        content: Buffer.from(JSON.stringify(existing, null, 2)).toString("base64"),
        sha,
      }),
    });
    if (!update.ok) throw new Error("Gagal update");

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (e) {
    console.error("Error:", e);
    return { statusCode: 500, body: JSON.stringify({ success: false }) };
  }
}
