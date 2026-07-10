export default async function handler(req, res) {

  try {

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        hata: "userId gerekli"
      });
    }


    const response = await fetch(
      `https://apis.roblox.com/cloud/v2/groups/${process.env.ROBLOX_GROUP_ID}/memberships?filter=user.id%3D%22${userId}%22`,
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