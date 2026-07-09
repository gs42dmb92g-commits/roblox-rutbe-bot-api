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

res.status(200).json({
  kullanici: kullanici,
  robloxCevap: userData
});