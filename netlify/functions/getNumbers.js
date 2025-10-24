export const handler = async () => {
  try {
    const repo = "Avwilyz/databasenew";
    const filePath = "databasenew.json";
    const url = `https://raw.githubusercontent.com/${repo}/main/${filePath}?t=${Date.now()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch data");

    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Fetch error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to load data" }),
    };
  }
};
