export default async function handler(req, res) {
  return res.status(200).json({
    api_key_var: !!process.env.ROBLOX_API_KEY,
    group_id_var: !!process.env.ROBLOX_GROUP_ID
  });
}