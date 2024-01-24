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
    lecture: 수업 이름
    numOfMember: 팀원 수
    description: 팀플 설명
  }

  // 응답 형식 -> res.data.isCompleted
  성공 -> isCompleted: true
  실패 -> isCompleted: false
*/
app.post("/api/createTeam", async (req, res) => {
  // 요청 데이터 받아오기
  const { uid, userName, name, teamId, lecture, numOfMember, description } =
    req.body;

  try {
    let userObj = {
      uid,
      userName, // 다른 필드에는 다 유저네임으로 되어있어서 일단 바꿔보았다..스리슬쩍
    };
    // firestore에 저장
    await db
      .collection("teamlist")
      .doc(teamId)
      .set({
        name,
        lecture,
        teamId,
        numOfMember,
        description,
        member: [userObj],
        teamGoal: "팀플 목표를 설정해보세요.",
      });

    let teamObj = {
      teamId,
      name,
      description,
    };
    // user 정보 -> teamList에 팀플 추가
    await db
      .collection("users") //여기 users라고해야하는데 user로 오타났음....
      .doc(uid)
      .update({
        teamList: FieldValue.arrayUnion(teamObj),
      });

    let commentObj = {
      [uid]: {
        0: [],
        1: [],
        2: [],
        3: [],
      },
    };

    // comment collection 추가
    await db.collection("comment").doc(teamId).set(commentObj);

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
  const { uid, teamId, userName } = req.body;

  let name = "";
  let description = "";

  try {
    await axios
      .post("http://127.0.0.1:4000/api/teamData", { teamId })
      .then((res) => {
        name = res.data.name;
        description = res.data.description;
      });

    let teamObj = {
      teamId,
      name,
      description,
    };

    // user 정보 -> teamList에 팀플 추가
    await db
      .collection("users")
      .doc(uid)
      .update({
        teamList: FieldValue.arrayUnion(teamObj),
      });

    let userObj = {
      uid,
      userName,
      todo: [],
    };

    // 팀플 DB에 유저(팀플 멤버) id 추가
    await db
      .collection("teamlist")
      .doc(teamId)
      .update({
        member: FieldValue.arrayUnion(userObj),
      });

    console.log("teamData");
    const teamDoc = await db.collection("comment").doc(teamId).get();
    const data = teamDoc.data();

    const comment = {
      ...data,
      [uid]: {
        0: [],
        1: [],
        2: [],
        3: [],
      },
    };

    // comment collection 추가
    await db
      .collection("comment")
      .doc(teamId)
      .set({ ...comment });

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
      .doc(uid)
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
    member: [
      {
        name: oo,
        uid: oo,
        todo: [
          {
            number: 1,
            content: "자료조사",
            deadline: "2024.1.1",
            isCompleted: false,
          },
        ]
      },
    ]
    teamGoal: 팀플 목표
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
  성공 -> isCompleted: true
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
        return res.send(data);
      });
    res.send({ isCompleted: true });
  } catch (err) {
    res.send({ isCompleted: false });
    console.log(err);
  }
});

/* ------------- 팀플 목표 API -------------
  // req로 받아야하는 데이터 형식
  {
    teamId: 팀플 id
    goal: 목표 (string 형태)
  }

  // 응답 형식 -> res.data.isCompleted
  성공 -> isCompleted: true
  실패 -> isCompleted: false
*/
app.post("/api/teamGoal", async (req, res) => {
  // 요청 데이터 받아오기
  const { teamId, teamGoal } = req.body;

  try {
    // firestore에 목표 업데이트
    await db.collection("teamlist").doc(teamId).update({
      teamGoal: teamGoal,
    });

    res.send({ isCompleted: true });
  } catch (err) {
    res.send({ isCompleted: false });
    console.log(err);
  }
});

/* ------------- 프로젝트 계획 추가 API -------------
  // req로 받아야하는 데이터 형식
  {
    teamId: 팀플 id
    memberId: 멤버 id
    todoData: 계획 데이터 -> 객체 형태
      -> {
        number: 1,
        content: "자료조사",
        deadline: "2024.1.1",
        isCompleted: false,
      }
  }

  // 응답 형식 -> res.data.isCompleted
  성공 -> isCompleted: true
  실패 -> isCompleted: false, error: "msg"
*/
app.post("/api/todo", async (req, res) => {
  // 요청 데이터 받아오기
  const { teamId, memberId, todoData } = req.body;

  try {
    // firestore에서 팀 정보 가져오기
    const teamDoc = await db.collection("teamlist").doc(teamId).get();
    const teamData = teamDoc.data();

    // 계획을 추가할 멤버 데이터 찾기
    const index = teamData.member.findIndex(
      (member) => member.uid === memberId
    );

    // 찾았다면, 계획 데이터 추가
    if (index !== -1) {
      teamData.member[index].todo.push(todoData);

      // 업데이트
      await db.collection("teamlist").doc(teamId).update({
        member: teamData.member,
      });
      res.send({ isCompleted: true });
    } else {
      res.send({ isCompleted: false, error: "Member not found" });
    }
  } catch (err) {
    res.send({ isCompleted: false, error: "error" });
    console.log(err);
  }
});

/* ------------- comment 추가 API -------------
  // req로 받아야하는 데이터 형식
  {
    uid: user id
    teamId: 팀플 id
    commentUserId: comment를 남긴 유저 id
    comment: comment 내용
    todoId: todo 번호 (string 형태 -> "0")
  }

  // 응답 형식 -> res.data.isCompleted
  성공 -> isCompleted: true
  실패 -> isCompleted: false
*/
app.post("/api/addComment", async (req, res) => {
  // 요청 데이터 받아오기
  const { uid, teamId, comment, commentUserId, todoId } = req.body;

  // const comment = {
  //   ...teamData,
  //   [uid]: {
  //     0: [],
  //     1: [],
  //     2: [],
  //     3: [],
  //   },
  // };

  try {
    // firestore에서 문서 가져오기
    const doc = await db.collection("comment").doc(teamId).get();
    const data = doc.data();

    // date 객체
    let dateObj = new Date();
    let date = {
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      day: dateObj.getDate(),
    };

    // 코멘트 업데이트
    data[uid][todoId][commentUserId] = {
      comment: comment,
      createdAt: `${date.year}-${date.month}-${date.day}`,
    };

    // firestore에 저장
    await db.collection("comment").doc(teamId).set(data);

    res.send({ isCompleted: true });
  } catch (err) {
    res.send({ isCompleted: false });
    console.log(err);
  }
});