export default async function handler(req, res) {

  try {

    const { kullanici, roleId } = req.body;

    if (!kullanici || !roleId) {
      return res.status(400).json({
        hata: "kullanici ve roleId gerekli"
      });
    }


    // Kullanıcı ID bul

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



    // Üyelikleri çek

    const membersResponse = await fetch(
      `https://apis.roblox.com/cloud/v2/groups/${process.env.ROBLOX_GROUP_ID}/memberships?pageSize=100`,
      {
        headers: {
          "x-api-key": process.env.ROBLOX_API_KEY
        }
      }
    );


    const members = await membersResponse.json();


    const member = members.groupMemberships.find(
      x => x.user === `users/${userId}`
    );


    if (!member) {
      return res.status(404).json({
        hata: "Kullanıcı grupta bulunamadı"
      });
    }


    const membershipPath = member.path;


    // Rol değiştir

    const change = await fetch(
      `https://apis.roblox.com/cloud/v2/${membershipPath}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ROBLOX_API_KEY
        },
        body: JSON.stringify({
          role: `groups/${process.env.ROBLOX_GROUP_ID}/roles/${roleId}`
        })
      }
    );


    const result = await change.json();


    return res.status(200).json({
      basarili: true,
      kullanici,
      userId,
      sonuc: result
    });


  } catch (err) {

    return res.status(500).json({
      hata: err.message
    });

  }

}