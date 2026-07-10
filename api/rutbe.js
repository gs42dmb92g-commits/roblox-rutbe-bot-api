export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      hata: "Sadece POST kullanılabilir"
    });
  }

  const { kullanici, rank } = req.body;

  // Burada kullanıcı ID bulma kodun olacak

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