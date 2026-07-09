const groupId = process.env.ROBLOX_GROUP_ID;
const botUsername = process.env.ROBLOX_USERNAME;
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

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      hata: "Sadece POST kullanılabilir"
    });
  }

  const { kullanici, rank } = req.body;
console.log(req.body);

  res.json({
  kullanici: kullanici,
  rankAdi: rank,
  rankID: ranks[rank],
  grupID: groupId,
  bot: botUsername
});
  
    
    

