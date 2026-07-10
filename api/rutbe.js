export default async function handler(req, res) {
const ranks = {
  "Yardımcı Grup Sahibi": 60,
  "Ordu Yönetimi": 50,
  "Geliştirici Ekibi": 40,
  "ÖZEL MİSAFİR": 39,
  "Yönetim Kurulu Başkanı": 29,
  "Yönetim Kurulu": 28,
  "Albay": 16,
  "Yarbay": 15,
  "Binbaşı": 14,
  "Yüzbaşı": 13,
  "Teğmen": 12,
  "Asteğmen": 11,
  "Astsubay Kıdemli BaşÇavuş": 10,
  "Astsubay BaşÇavuş": 9,
  "Astsubay Kıdemli Çavuş": 8,
  "Astsubay Çavuş": 7,
  "Uzman Çavuş": 6,
  "Uzman Onbaşı": 5,
  "Çavuş": 4,
  "Onbaşı": 3,
  "Acemi Er": 2
};
  if (req.method !== "POST") {
    return res.status(405).json({
      hata: "Sadece POST kullanılabilir"
    });
  }

  const { kullanici, rank } = req.body;

 const userResponse = await fetch(
  `https://users.roblox.com/v1/usernames/users`,
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
    hata: "Roblox kullanıcısı bulunamadı"
  });
}

const userId = userData.data[0].id;

  const rankId = ranks[rank];

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

  let changeResult;

  if (csrfToken) {
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

    changeResult = await changeRank.json();
  } else {
    changeResult = await csrfResponse.json();
  }

  res.status(200).json({
    kullanici,
    rankAdi: rank,
    rankID: rankId,
    sonuc: changeResult
  });
}