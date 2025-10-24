import axios from "axios";

export const handler = async () => {
  try {
    const repo = "Avwilyz/databasenew";
    const filePath = "databasenew.json";

    const res = await axios.get(`https://raw.githubusercontent.com/${repo}/main/${filePath}?t=${Date.now()}`);
    const data = res.data;

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data" })
    };
  }
};
