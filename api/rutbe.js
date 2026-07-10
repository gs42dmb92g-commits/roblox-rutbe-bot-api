export default async function handler(req, res) {
  try {

    const response = await fetch(
      `https://apis.roblox.com/cloud/v2/groups/${process.env.ROBLOX_GROUP_ID}/memberships?pageSize=100`,
      {
        headers: {
          "x-api-key": process.env.ROBLOX_API_KEY
        }
      }
    );

    const data = await response.json();

    return res.status(200).json({
      uyeSayisi: data.groupMemberships?.length,
      sonrakiSayfa: data.nextPageToken ? true : false
    });

  } catch (err) {

    return res.status(500).json({
      hata: err.message
    });

  }
}