export default async function handler(req, res) {
  try {

    if (req.method !== "POST") {
      return res.status(405).json({
        hata: "Sadece POST kullanılabilir"
      });
    }

    const { kullanici, roleId } = req.body;

    if (!kullanici || !roleId) {
      return res.status(400).json({
        hata: "kullanici ve roleId gerekli"
      });
    }


    // Roblox kullanıcı ID bulma

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

    if (!userData.data || userData.data.length === 0) {
      return res.status(404).json({
        hata: "Kullanıcı bulunamadı"
      });
    }

    const userId = userData.data[0].id;


    // Grup üyeliğini bul

    let members = [];
    let pageToken = null;

    do {

      let url =
        `https://apis.roblox.com/cloud/v2/groups/${process.env.ROBLOX_GROUP_ID}/memberships?pageSize=100`;

      if (pageToken) {
        url += `&pageToken=${pageToken}`;
      }


      const membersResponse = await fetch(
        url,
        {
          headers: {
            "x-api-key": process.env.ROBLOX_API_KEY
          }
        }
      );


      const data = await membersResponse.json();

      members.push(...(data.groupMemberships || []));

      pageToken = data.nextPageToken || null;


    } while (pageToken);



    const member = members.find(
      m => m.user === `users/${userId}`
    );


    if (!member) {
      return res.status(404).json({
        hata: "Kullanıcı grupta bulunamadı"
      });
    }



    // Rol değiştir

    const changeResponse = await fetch(
      `https://apis.roblox.com/cloud/v2/${member.path}`,
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


    const result = await changeResponse.json();


    return res.status(200).json({
      basarili: true,
      kullanici,
      robloxID: userId,
      roleId,
      sonuc: result
    });


  } catch (err) {

    return res.status(500).json({
      hata: err.message
    });

  }
}