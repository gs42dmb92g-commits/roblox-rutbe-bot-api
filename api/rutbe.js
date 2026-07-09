const ranks = {
  "Albay": 16,
  "Yarbay": 15,
  "Binbaşı": 14
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      hata: "Sadece POST kullanılabilir"
    });
  }

  const { kullanici, rank } = req.body;

  res.status(200).json({
    kullanici: kullanici,
    rankAdi: rank,
    rankID: ranks[rank]
  });
}