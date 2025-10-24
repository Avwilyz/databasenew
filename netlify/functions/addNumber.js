export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = "Avwilyz/databasenew";
  const filePath = "databasenew.json";

  try {
    const { number, time } = JSON.parse(event.body || "{}");
    if (!number || !time) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: "Missing data" }) };
    }

    // Ambil file lama
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      headers: { Authorization: `token ${token}` },
    });
    if (!getRes.ok) throw new Error("Failed to read file");
    const fileData = await getRes.json();

    const sha = fileData.sha;
    const existingData = JSON.parse(Buffer.from(fileData.content, "base64").toString());
    const newData = [...existingData, { number, time }];

    // Upload ulang
    const updateRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add number ${number}`,
        content: Buffer.from(JSON.stringify(newData, null, 2)).toString("base64"),
        sha,
      }),
    });

    if (!updateRes.ok) throw new Error("Failed to update file");

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error("Add number error:", err.message);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
