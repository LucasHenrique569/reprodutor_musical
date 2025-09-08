
const express = require("express");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

app.get("/download", async (req, res) => {
  const url = req.query.url;
  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).send("URL inválida");
  }

  const outputPath = path.join(__dirname, "music.mp3");

  ffmpeg(ytdl(url, { quality: "highestaudio" }))
    .format("mp3")
    .on("error", (err) => {
      console.error(err);
      res.status(500).send("Erro ao extrair áudio");
    })
    .on("end", () => {
      res.download(outputPath, "music.mp3", (err) => {
        if (err) console.error(err);
        fs.unlinkSync(outputPath);
      });
    })
    .save(outputPath);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
