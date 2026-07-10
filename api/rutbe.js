export default async function handler(req, res) {
  try {

    const controller = new AbortController();

    setTimeout(() => controller.abort(), 4000);

    const response = await fetch(
      `https://apis.roblox.com/cloud/v2/groups/${process.env.ROBLOX_GROUP_ID}/memberships?pageSize=1`,
      {
        headers: {
          "x-api-key": process.env.ROBLOX_API_KEY
        },
        signal: controller.signal
      }
    );

    const text = await response.text();

    return res.status(200).json({
      kod: response.status,
      cevap: text
    });

  } catch (err) {

    return res.status(500).json({
      hata: err.name,
      mesaj: err.message
    });

  }
}