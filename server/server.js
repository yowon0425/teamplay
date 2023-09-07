// 필요한 모듈 가져오기
const express = require("express");
const cors = require("cors");
const config = require("./config");
const firebase = require("./firebase");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// 인덱스 페이지 응답 반환
app.get("/", (req, res) => {
  res.send("response completed!");
});

// 서버 실행: node server.js
app.listen(config.port, () => {
  console.log(`Server started on ${config.url}...`);
});
