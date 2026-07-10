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


    // Kullanıcı ID bul

    const userReq = await fetch(
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


    const userData = await userReq.json();

    if (!userData.data || userData.data.length === 0) {
      return res.status(404).json({
        hata: "Roblox kullanıcısı bulunamadı"
      });
    }


    const userId = userData.data[0].id;



    // Grup üyeliklerini al

    const memberships = await fetch(
      `https://apis.roblox.com/cloud/v2/groups/${process.env.ROBLOX_GROUP_ID}/memberships`,
      {
        headers: {
          "x-api-key": process.env.ROBLOX_API_KEY
        }
      }
    );


    const membershipData = await memberships.json();


    const member = membershipData.groupMemberships?.find(
      x => x.user?.id == userId
    );


    if (!member) {
      return res.status(404).json({
        hata: "Kullanıcı grupta bulunamadı"
      });
    }


    const membershipId = member.name.split("/").pop();



    // Rol değiştir

    const change = await fetch(
      `https://apis.roblox.com/cloud/v2/groups/${process.env.ROBLOX_GROUP_ID}/memberships/${membershipId}:assignRole`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ROBLOX_API_KEY
        },
        body: JSON.stringify({
          roleId: roleId
        })
      }
    );


    const result = await change.json();


    return res.status(200).json({
      basarili: true,
      kullanici,
      robloxID: userId,
      membershipId,
      sonuc: result
    });


  } catch (err) {

    return res.status(500).json({
      hata: err.message
    });

  }

}