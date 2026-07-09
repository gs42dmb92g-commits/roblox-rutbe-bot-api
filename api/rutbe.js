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
  "Orgeneral": 20,
  "Korgeneral": 19,
  "Tümgeneral": 18,
  "Tuğgeneral": 17,
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

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        hata: "Sadece POST kullanılabilir"
      });
    }

    const { kullanici, rank } = req.body;

    if (!kullanici || !rank) {
      return res.status(400).json({
        hata: "Kullanıcı veya rütbe eksik"
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
          usernames: [kullanici],
          excludeBannedUsers: true
        })
      }
    );

    const userData = await userResponse.json();

    res.status(200).json({
      kullanici: kullanici,
      rankAdi: rank,
      rankID: ranks[rank],
      robloxCevap: userData
    });

  } catch (error) {
    res.status(500).json({
      hata: error.message
    });
  }
}