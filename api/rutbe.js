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

res.json({
  kullanici: kullanici,
  robloxID: userData.data?.[0]?.id
});