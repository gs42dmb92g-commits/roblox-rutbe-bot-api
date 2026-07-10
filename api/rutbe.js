export default async function handler(req, res) {

  try {

    const { kullanici } = req.body;

    if (!kullanici) {
      return res.status(400).json({
        hata: "kullanici gerekli"
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


    if (!userData.data || userData.data.length === 0) {
      return res.status(404).json({
        hata: "Kullanıcı bulunamadı"
      });
    }


    return res.status(200).json({
      kullanici: kullanici,
      robloxID: userData.data[0].id
    });


  } catch (err) {

    return res.status(500).json({
      hata: err.message
    });

  }

}