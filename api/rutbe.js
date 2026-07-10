export default async function handler(req, res) {
  try {

    const response = await fetch(
      `https://apis.roblox.com/cloud/v2/groups/${process.env.ROBLOX_GROUP_ID}`,
      {
        headers: {
          "x-api-key": process.env.ROBLOX_API_KEY
        }
      }
    );

    const text = await response.text();

    return res.status(200).json({
      kod: response.status,
      cevap: text
    });

  } catch (err) {
    return res.status(500).json({
      hata: err.message
    });
  }
}