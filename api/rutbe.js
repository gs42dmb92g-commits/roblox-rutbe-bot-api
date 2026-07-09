export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            hata: "Sadece POST kullanılabilir"
        });
    }

    const { kullanici, rank } = req.body;

    if (!kullanici || !rank) {
        return res.status(400).json({
            hata: "Kullanıcı ve rank gerekli"
        });
    }

    res.status(200).json({
        mesaj: `${kullanici} kullanıcısına ${rank} rank isteği alındı`
    });
}