// 필요한 모듈 가져오기
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { db, bucket, admin } = require("./firebase");
const multer = require("multer");
const { FieldValue } = admin.firestore;

const upload = multer({ storage: multer.memoryStorage() });
const fs = require("fs").promises;

/* ------- API 요청법 --------
await axios.post('/api/API이름', {
        전달할 데이터를 이곳에 객체 형식으로
      })
      .then(res => {
        if (res.data.응답값) {
          // 성공 시 할 작업
        } else {
          // 실패 시 할 작업
        }
      })
      .catch(err => 에러 시 할 작업);

*/

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
      teamList: [],
    });

    // fileList에 문서 생성
    await db.collection("fileList").doc(uid).set({
      files: [],
    });

    res.send({ isSaved: true });
  } catch (err) {
    res.send({ isSaved: false });
    console.log(err);
  }
});

/* ------------- 팀플 생성 API -------------
  // req로 받아야하는 데이터 형식
  {
    uid: user id
    userName: user name
    teamId: 팀플 id (랜덤 생성)
    name: 팀플 이름
    leture: 수업 이름
    numOfMember: 팀원 수
    description: 팀플 설명
  }

  // 응답 형식 -> res.data.isCompleted
  성공 -> isCompleted: true
  실패 -> isCompleted: false
*/
app.post("/api/createTeam", async (req, res) => {
  // 요청 데이터 받아오기
  const { uid, userName, name, lecture, nunOfMember, description } = req.body;

  try {
    let userObj = new Map([
      ["uid", uid],
      ["name", userName],
    ]);
    // firestore에 저장
    await db
      .collection("teamlist")
      .doc(teamId)
      .set({
        name,
        lecture,
        teamId,
        nunOfMember,
        description,
        member: [userObj],
      });

    let teamObj = new Map([
      ["teamId", teamId],
      ["name", name],
      ["description", description],
    ]);
    // user 정보 -> teamList에 팀플 추가
    await db
      .collection("user")
      .doc(uid)
      .update({
        teamList: FieldValue.arrayUnion(teamObj),
      });

    res.send({ isCompleted: true });
  } catch (err) {
    res.send({ isCompleted: false });
    console.log(err);
  }
});

/* ------------- 팀플 참가 API -------------
  // req로 받아야하는 데이터 형식
  {
    uid: 유저 id
    userName: 유저 이름
    teamId: 팀플 id
  }

  // 응답 형식
  성공 -> isJoined: true
  실패 -> isJoined: false
*/
app.post("/api/joinTeam", async (req, res) => {
  // 요청 데이터 받아오기
  const { uid, teamId } = req.body;

  const { name, description } = await axios.post("/api/teamData", { teamId });

  try {
    let teamObj = new Map([
      ["teamId", teamId],
      ["name", name],
      ["description", description],
    ]);

    // user 정보 -> teamList에 팀플 추가
    await db
      .collection("user")
      .doc(uid)
      .update({
        teamList: FieldValue.arrayUnion(teamObj),
      });

    let userObj = new Map([
      ["uid", uid],
      ["userName", userName],
    ]);

    // 팀플 DB에 유저(팀플 멤버) id 추가
    await db
      .collection("teamlist")
      .doc(teamId)
      .update({
        member: FieldValue.arrayUnion(userObj),
      });
    res.send({ isJoined: true });
  } catch (err) {
    res.send({ isJoined: false });
    console.log(err);
  }
});

/* ------------- 팀플 리스트 API (특정 유저의 팀플 리스트) -------------
  // req로 받아야하는 데이터 형식
  {
    uid: 유저 id
  }

  // 응답 형식
  성공 -> res.data
  {
    teamList: [ { teamId: '21212', name: '팀플이름', description: '팀플 설명~~' } ]
  } 
  실패 -> isCompleted: false
*/
app.post("/api/teamList", async (req, res) => {
  // 요청 데이터 받아오기
  const uid = req.body.uid;

  try {
    // firestore에서 가져오기
    await db
      .collection("users")
      .doc(`${uid}`)
      .get()
      .then((snapshot) => {
        // 찾은 문서에서 데이터를 JSON 형식으로 얻어옴
        var userData = snapshot.data();
        return res.json(userData.teamList);
      });
  } catch (err) {
    res.send({ isCompleted: false });
    console.log(err);
  }
});

/* ------------- 팀플 데이터 API (개별) -------------
  // req로 받아야하는 데이터 형식
  {
    teamId: 팀플 id
  }

  // 응답 형식
  성공 -> res.data
  {
    teamId: 팀플 id
    name: 팀플 이름
    leture: 수업 이름
    numOfMember: 팀원 수
    description: 팀플 설명
    member: [{name: oo, uid: oo}, {...}]
  }
  실패 -> isCompleted: false
*/
app.post("/api/teamData", async (req, res) => {
  // 요청 데이터 받아오기
  const teamId = req.body.teamId;

  try {
    // firestore에서 가져오기
    await db
      .collection("teamlist")
      .doc(teamId)
      .get()
      .then((snapshot) => {
        // 찾은 문서에서 데이터를 JSON 형식으로 얻어옴
        var teamData = snapshot.data();
        return res.json(teamData);
      });
  } catch (err) {
    res.send({ isCompleted: false });
    console.log(err);
  }
});

/* ------------- 파일 업로드 API -------------
  // req로 받아야하는 데이터 = formData 
  {
    file info
    uid
  }

  // 응답 형식
  성공 -> uploaded: true
  실패 -> uploaded: false
*/
app.post("/api/upload", upload.any(), async (req, res) => {
  const { uid, fileInfo } = req.body;
  const file = req.files[0];

  try {
    // 필요한 메타데이터 정의
    const metadata = {
      metadata: {
        // This line is very important. It's to create a download token.
        firebaseStorageDownloadTokens: uid,
      },
      contentType: file.mimetype,
      cacheControl: "public, max-age=31536000",
    };

    // file 읽기
    const tempFilePath = `/tmp/${uid}-${file.originalname}`;
    await fs.writeFile(tempFilePath, file.buffer);

    // firebase storage에 업로드 하기
    await bucket.upload(tempFilePath, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      destination: uid + "/" + file.originalname,
      metadata: metadata,
    });

    // firestore에 파일 정보 저장
    await db
      .collection("fileList")
      .doc(uid)
      .update({
        files: FieldValue.arrayUnion(fileInfo),
      });

    res.send({ uploaded: true });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.send({ uploaded: false });
  }
});

/* ------------- 파일 리스트 API -------------
  // req로 받아야하는 데이터 형식
  {
    uid: 유저 id
  }

  // 응답 형식
  성공 -> res.data
  {
    teamList: [ { teamId: '21212', name: '팀플이름', description: '팀플 설명~~' } ]
  } 
  실패 -> isCompleted: false
*/
app.post("/api/fileList", async (req, res) => {
  // 요청 데이터 받아오기
  const uid = req.body.uid;

  try {
    // firestore에서 가져오기
    await db
      .collection("fileList")
      .doc(uid)
      .get()
      .then((snapshot) => {
        // 찾은 문서에서 데이터를 JSON 형식으로 얻어옴
        var data = snapshot.data();
        return res.json(data);
      });
  } catch (err) {
    res.send({ isCompleted: false });
    console.log(err);
  }
});
