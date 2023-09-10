// 필요한 모듈 가져오기
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const config = require("./config");
const firebase = require("./firebase");

const GOOGLE_CLIENT_ID =
  "465266909496-p18pdq3o1df8ircqrjgg2djc01idr09v.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GOOGLE_REDIRECT_URI = "http://localhost:4000/login/redirect";

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

/* ---------- 구글 로그인 ---------- */
// 로그인 버튼을 누르면 도착하는 목적지 라우터
// 모든 로직을 처리한 뒤 구글 인증 서버인 https://accounts.google.com/o/oauth2/v2/auth
// 으로 redirect 되는데, 이 url에 첨부할 몇가지 QueryString들이 필요
app.get("/login", (req, res) => {
  let url = "https://accounts.google.com/o/oauth2/v2/auth";
  url += `?client_id=${GOOGLE_CLIENT_ID}`;
  // 로그인 창에서 계정을 선택하면 구글 서버가 이 redirect_uri로 redirect 시켜줌
  url += `&redirect_uri=${GOOGLE_REDIRECT_URI}`;
  // 필수 옵션.
  url += "&response_type=code";
  // 구글에 등록된 유저 정보 email, profile을 가져오겠다 명시
  url += "&scope=email profile";
  // 완성된 url로 이동
  // 이 url이 위에서 본 구글 계정을 선택하는 화면임.
  res.redirect(url);
});

/* ---------- 구글 로그인 후 사용자 정보 가져오기 ---------- */
// 토큰을 요청하기 위한 구글 인증 서버 url
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
// email, google id 등을 가져오기 위한 url
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

// 구글 계정 선택 화면에서 계정 선택 후 redirect 된 주소
// 아까 등록한 GOOGLE_REDIRECT_URI와 일치해야 함
app.get("/login/redirect", async (req, res) => {
  const { code } = req.query;

  // access_token, refresh_token 등의 구글 토큰 정보 가져오기
  const response = await axios.post(GOOGLE_TOKEN_URL, {
    // x-www-form-urlencoded(body)
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  });

  // email, google id 등의 사용자 구글 계정 정보 가져오기
  const response2 = await axios.get(GOOGLE_USERINFO_URL, {
    // Request Header에 Authorization 추가
    headers: {
      Authorization: `Bearer ${response.data.access_token}`,
    },
  });

  // 구글 인증 서버에서 json 형태로 반환 받은 body 클라이언트에 반환
  res.json(response2.data);
});
