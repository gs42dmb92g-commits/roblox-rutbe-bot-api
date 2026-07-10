export default async function handler(req, res) {
  try {

    const { kullanici, roleId } = req.body;

    if (!kullanici || !roleId) {
      return res.status(400).json({
        hata: "kullanici ve roleId gerekli"
      });
    }


    const userResponse = await fetch(
      "https://users.roblox.com/v1/usernames/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usernames: [kullanici]
        })
      }
    );

    const userData = await userResponse.json();
    const userId = userData.data[0].id;


    let pageToken = "";
    let member = null;
    let sayac = 0;


    while (sayac < 60) {

      let url =
      `https://apis.roblox.com/cloud/v2/groups/${process.env.ROBLOX_GROUP_ID}/memberships?pageSize=100`;

      if (pageToken) {
        url += `&pageToken=${pageToken}`;
      }


      const response = await fetch(url, {
        headers: {
          "x-api-key": process.env.ROBLOX_API_KEY
        }
      });


      const data = await response.json();


      member = (data.groupMemberships || []).find(
        m => m.user === `users/${userId}`
      );


      if (member) break;


      pageToken = data.nextPageToken;

      if (!pageToken) break;

      sayac++;

    }


    if (!member) {
      return res.status(404).json({
        hata: "Kullanıcı grupta bulunamadı"
      });
    }


    return res.status(200).json({
      bulundu: true,
      userId,
      membership: member.path
    });


  } catch (err) {

    return res.status(500).json({
      hata: err.message
    });

  }
}