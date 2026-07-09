const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Roblox Rütbe API aktif!");
});

app.listen(3000, () => {
    console.log("API çalışıyor!");
});