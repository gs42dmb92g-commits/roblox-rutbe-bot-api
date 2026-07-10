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
export default async function handler(req, res) {

try {

  // bütün mevcut kodların burada

} catch (err) {
  return res.status(500).json({
    hata: err.message
  });
}

}
  const { kullanici, rank } = req.body;


const changeRank = await fetch(
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

const changeResult = await changeRank.json();
  res.status(200).json({
    kullanici,
    rankAdi: rank,
    rankID: rankId,
    sonuc: changeResult
  });
}