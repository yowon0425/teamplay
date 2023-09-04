// 필요한 모듈 가져오기
const express = require("express");
const app = express();

// 포트 설정
const port = 3000;

// 인덱스 페이지 응답 반환
app.get("/", (req, res) => {
  res.send("response completed!");
});

// 서버 실행
app.listen(port, () => {
  console.log("Server started on localhost:3000...");
});
