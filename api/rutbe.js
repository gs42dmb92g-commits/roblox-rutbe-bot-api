export default async function handler(req, res) {

  try {

    if (req.method !== "POST") {
      return res.status(405).json({
        hata: "Sadece POST"
      });
    }


    const { kullanici, roleId } = req.body;


    if (!kullanici || !roleId) {
      return res.status(400).json({
        hata: "kullanici ve roleId gerekli"
      });
    }



    // Roblox ID bul

    const userResponse = await fetch(
      "https://users.roblox.com/v1/usernames/users",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          usernames:[kullanici]
        })
      }
    );


    const userData = await userResponse.json();


    if (!userData.data?.length) {
      return res.status(404).json({
        hata:"Kullanıcı bulunamadı"
      });
    }


    const userId = userData.data[0].id;



    // Üyeyi bul

    let pageToken = null;
    let membership = null;


    while (true) {


      let url =
      `https://apis.roblox.com/cloud/v2/groups/${process.env.ROBLOX_GROUP_ID}/memberships?pageSize=100`;


      if (pageToken) {
        url += `&pageToken=${pageToken}`;
      }



      const membersResponse = await fetch(
        url,
        {
          headers:{
            "x-api-key":process.env.ROBLOX_API_KEY
          }
        }
      );


      const members = await membersResponse.json();



      membership =
      members.groupMemberships?.find(
        x => x.user === `users/${userId}`
      );


      if (membership) break;


      if (!members.nextPageToken) break;


      pageToken = members.nextPageToken;

    }



    if (!membership) {
      return res.status(404).json({
        hata:"Kullanıcı grupta bulunamadı"
      });
    }



    // Rol değiştir

    const change = await fetch(
      `https://apis.roblox.com/cloud/v2/${membership.path}`,
      {
        method:"PATCH",
        headers:{
          "Content-Type":"application/json",
          "x-api-key":process.env.ROBLOX_API_KEY
        },
        body:JSON.stringify({
          role:`groups/${process.env.ROBLOX_GROUP_ID}/roles/${roleId}`
        })
      }
    );


    const result = await change.json();



    return res.status(200).json({
      basarili:true,
      kullanici,
      userId,
      sonuc:result
    });



  } catch(err) {

    return res.status(500).json({
      hata:err.message
    });

  }

}