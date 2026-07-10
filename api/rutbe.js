export default async function handler(req, res) {

  try {

    if (req.method !== "POST") {
      return res.status(405).json({
        hata: "Sadece POST kullanılabilir"
      });
    }

    const ranks = {
      "Holder": 255,
      "Grup Sahibi": 200,
      "BaşKomutan": 80,
      "Yardımcı Grup Sahibi": 60,
      "Ordu Yönetimi": 50,
      "Geliştirici Ekibi": 40,
      "ÖZEL MİSAFİR": 39,
      "Yönetim Kurulu Başkanı": 29,
      "Yönetim Kurulu": 28,
      "Yüksek Askeri Şûra": 27,
      "Genelkurmay Başkanı": 26,
      "Genelkurmay": 25,
      "Lider": 24,
      "Lider Yardımcısı": 23,
      "Ankara Heyeti": 22,
      "Büyük Konsey": 21,
      "OF-9 / Orgeneral": 20,
      "OF-8 / Korgeneral": 19,
      "OF-7 / Tümgeneral": 18,
      "OF-6 / Tuğgeneral": 17,
      "Albay": 16,
      "Yarbay": 15,
      "Binbaşı": 14,
      "Yüzbaşı": 13,
      "OF-1 (B) / Teğmen": 12,
      "OF-1 (A) / Asteğmen": 11,
      "OR-9 / Astsubay Kıdemli BaşÇavuş": 10,
      "OR-8 / Astsubay BaşÇavuş": 9,
      "OR-7 / Astsubay Kıdemli Çavuş": 8,
      "OR-6 / Astsubay Çavuş": 7,
      "OR-5 / Uzman Çavuş": 6,
      "OR-4 / Uzman Onbaşı": 5,
      "OR-3 / Çavuş": 4,
      "OR-2 / Onbaşı": 3,
      "OR-1 / Acemi Er": 2
    };


    const { kullanici, rank } = req.body;


    if (!kullanici || !rank) {
      return res.status(400).json({
        hata: "Kullanıcı ve rütbe gerekli"
      });
    }


    const rankId = ranks[rank];


    if (!rankId) {
      return res.status(400).json({
        hata: "Rütbe bulunamadı"
      });
    }


    // Roblox kullanıcı ID bul

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



    // CSRF TOKEN AL

    const csrfResponse = await fetch(
      `https://groups.roblox.com/v1/groups/${process.env.ROBLOX_GROUP_ID}/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ROBLOX_API_KEY
        },
        body: JSON.stringify({
          roleId: rankId
        })
      }
    );


    const csrfToken = csrfResponse.headers.get("x-csrf-token");


    if (!csrfToken) {
      const hata = await csrfResponse.json();

      return res.status(400).json({
        hata: "CSRF alınamadı",
        detay: hata
      });
    }



    // RÜTBE DEĞİŞTİR

    const changeRank = await fetch(
      `https://groups.roblox.com/v1/groups/${process.env.ROBLOX_GROUP_ID}/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ROBLOX_API_KEY,
          "x-csrf-token": csrfToken
        },
        body: JSON.stringify({
          roleId: rankId
        })
      }
    );


    const result = await changeRank.json();


    return res.status(200).json({
      kullanici,
      robloxID: userId,
      rankAdi: rank,
      rankID: rankId,
      sonuc: result
    });


  } catch (err) {

    return res.status(500).json({
      hata: err.message
    });

  }

}