// 필요한 모듈 가져오기
const express = require("express");
const cors = require("cors");
// const config = require("./config");
const axios = require("axios");
const db = require("./firebase");

const PORT = 4000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// 인덱스 페이지 응답 반환
app.get("/", (req, res) => {
  res.send("response completed!");
});

// 서버 실행: node server.js
app.listen(PORT, () => {
  console.log(`Server started on localhost:4000`);
});

/* ------------- 회원가입 API -------------
  // req로 받아야하는 데이터 형식
  {
    uid: firebase에서 생성된 유저 id
    email: 구글 계정 이메일
    name: 이름
    studentId: 학번
    organization: 학교/소속
    major: 전공
  }

  // 응답 형식 -> res.data.isSaved
  성공 -> isSaved: true
  실패 -> isSaved: false
*/
app.post("/api/signup", async (req, res) => {
  // 요청 데이터 받아오기
  const { uid, email, name, studentId, major, organization } = req.body;

  try {
    // firestore에 저장
    await db.collection("users").doc(uid).set({
      email,
      name,
      studentId,
      major,
      organization,
    });
    res.send({ isSaved: true });
  } catch (err) {
    res.send({ isSaved: false });
    console.log(err);
  }
});
