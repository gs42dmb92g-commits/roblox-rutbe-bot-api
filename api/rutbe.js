export default async function handler(req, res) {

  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, 5000);

  try {

    const response = await fetch(
      `https://apis.roblox.com/cloud/v2/groups/${process.env.ROBLOX_GROUP_ID}/memberships?pageSize=10`,
      {
        headers: {
          "x-api-key": process.env.ROBLOX_API_KEY
        },
        signal: controller.signal
      }
    );

    clearTimeout(timer);

    const text = await response.text();

    return res.status(200).json({
      durum: "cevap geldi",
      kod: response.status,
      veri: text
    });


  } catch (err) {

    clearTimeout(timer);

    return res.status(500).json({
      hata: err.name,
      mesaj: err.message
    });

  }

}