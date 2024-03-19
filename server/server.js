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

    await db.collection("todo").doc(teamId).set({
      uid: {},
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
      })
      .catch((err) => {
        res.send({ errorMsg: "존재하지 않는 팀입니다." });
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
    };

    const todoDoc = await db.collection("todo").doc(teamId).get();
    let todoData = todoDoc.data();

    todoData = { ...todoData, [uid]: {} };

    await db.collection("todo").doc(teamId).update(todoData);

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
  const { uid, teamId, todoId, fileInfo } = req.body;
  console.log(uid, fileInfo);
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

    // firestore에서 문서 가져오기
    const doc = await db.collection("fileList").doc(uid).get();
    const data = doc.data();

    // 계획 데이터 추가

    /*await db
      .collection("fileList")
      .doc(uid)
      .update({
        files: FieldValue.arrayUnion(JSON.parse(fileInfo)),
      });*/
    let newData = {};
    if (data[teamId].hasOwnProperty(todoId)) {
      newData = {
        ...data[teamId],
        [todoId]: [...data[teamId][todoId], JSON.parse(fileInfo)],
      };
    } else {
      newData = {
        ...data[teamId],
        [todoId]: [JSON.parse(fileInfo)],
      };
    }

    // firestore에 파일 정보 저장
    await db
      .collection("fileList")
      .doc(uid)
      .update({ [teamId]: newData }); // 같은 투두아이디에 안만들어짐

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
    let data = {};
    // firestore에서 todo 정보 가져오기
    await db
      .collection("todo")
      .doc(teamId)
      .get()
      .then((snapshot) => {
        // 찾은 문서에서 데이터를 JSON 형식으로 얻어옴
        data = snapshot.data();
      });
    console.log(data);

    // 계획 데이터 추가
    data[memberId][todoData.number] = todoData;

    // 업데이트
    await db.collection("todo").doc(teamId).update(data);
    res.send({ isCompleted: true });
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
    let newData = {};
    if (data[uid].hasOwnProperty(todoId)) {
      newData = {
        ...data[uid],
        [todoId]: {
          ...data[uid][todoId],
          [commentUserId]: {
            comment: comment,
            createdAt: `${date.year}-${date.month}-${date.day}`,
          },
        },
      };
    } else {
      newData = {
        ...data[uid],
        [todoId]: {
          [commentUserId]: {
            comment: comment,
            createdAt: `${date.year}-${date.month}-${date.day}`,
          },
        },
      };
    }

    // firestore에 저장
    await db.collection("comment").doc(teamId).set(newData);

    res.send({ isCompleted: true });
  } catch (err) {
    res.send({ isCompleted: false });
    console.log(err);
  }
});

/* ------------- 프로젝트 계획 수정 API -------------
  // req로 받아야하는 데이터 형식
  {
    teamId: 팀플 id
    memberId: 멤버 id
    newContent: {
      number: 수정할 todo번호 -> string 형태
      content: "바꿀 내용",
      deadline: "바꿀 기한",
      isCompleted: false,  -> 완료 여부
    }
  }

  // 응답 형식 -> res.data.isCompleted
  성공 -> isCompleted: true
  실패 -> isCompleted: false, error: "msg"
*/
app.post("/api/changeTodo", async (req, res) => {
  // 요청 데이터 받아오기
  const { teamId, memberId, newContent } = req.body;

  try {
    // firestore에서 팀 정보 가져오기
    const doc = await db.collection("todo").doc(teamId).get();
    const data = doc.data();

    data[memberId][newContent.number] = newContent;

    // 업데이트
    await db.collection("todo").doc(teamId).update(data);
    res.send({ isCompleted: true });
  } catch (err) {
    res.send({ isCompleted: false, error: "error" });
    console.log(err);
  }
});

/* ------------- 팀별 todo 받아오기 API -------------
  // req로 받아야하는 데이터 형식
  {
    teamId: 팀플 id
  }

  // 응답 형식
  성공 -> res.data
  {
    [uid -> 유저id]: {
      1: {
        content: todo 내용,
        deadline: 기한,
        isCompleted: 완료 여부,
        number: todo 번호
      }
      2: {
        content: todo 내용,
        deadline: 기한,
        isCompleted: 완료 여부,
        number: todo 번호
      }
      ....
    }
  }
  실패 -> isCompleted: false
*/
app.post("/api/teamData/todos", async (req, res) => {
  // 요청 데이터 받아오기
  const teamId = req.body.teamId;
  try {
    // firestore에서 가져오기
    await db
      .collection("todo")
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

/* ------------- 팀별 comment 받아오기 API -------------
  // req로 받아야하는 데이터 형식
  {
    teamId: 팀플 id
  }

  // 응답 형식
  성공 -> res.data
  {
    [uid -> 유저id]: {
      1: {
        [commnet한 user id]: {
          comment: 내용,
          createdAt: 작성일시,
        },
        [commnet한 user id]: {
          comment: 내용,
          createdAt: 작성일시,
        }
      }
      ....
    }
  }
  실패 -> isCompleted: false
*/
app.post("/api/teamData/comment", async (req, res) => {
  // 요청 데이터 받아오기
  const teamId = req.body.teamId;

  try {
    // firestore에서 가져오기
    await db
      .collection("comment")
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

/* ------------- 알림 보내기 API -------------
 */
app.post("/api/noticesend", async (req, res) => {
  // 요청 데이터 받아오기
  const { uid, title, label, text } = req.body;

  try {
    // 알림을 받는 사용자의 UID를 기반으로 알림 데이터베이스에 저장
    await db.collection("notifications").doc(uid).collection("notices").add({
      title,
      label,
      text,
    });

    res.send({ isSaved: true });
  } catch (err) {
    res.send({ isSaved: false });
    console.log(err);
  }
});

/* ------------- 캘린더 일정 추가 API ------------
 */
app.post("/api/addCalender", async (req, res) => {
  // 요청 데이터 받아오기
  const { uid, teamId, name, date, time } = req.body;

  try {
    let calObj = {
      name,
      date,
      time,
    };
    // firestore에 저장
    await db
      .collection("calender")
      .doc(uid)
      .set({
        [teamId]: [calObj],
      });

    res.send({ isCompleted: true });
  } catch (err) {
    res.send({ isCompleted: false });
    console.log(err);
  }
});

/* ------------- 캘린더 받아오기 API -------------
  // req로 받아야하는 데이터 형식
  {
    uid: 유저 id
    teamId: 팀플 id
  }

  // 응답 형식
  성공 -> res.data
  {
    calender: [ { name: 일정 이름, date: 날짜, time: 시간 }, ~... ]
  } 
  실패 -> isCompleted: false
*/
app.post("/api/calender", async (req, res) => {
  // 요청 데이터 받아오기
  const { uid, teamId } = req.body;

  try {
    // firestore에서 가져오기
    await db
      .collection("calender")
      .doc(uid)
      .get()
      .then((snapshot) => {
        // 찾은 문서에서 데이터를 JSON 형식으로 얻어옴
        var calenderData = snapshot.data();
        return res.json(calenderData[teamId]);
      });
  } catch (err) {
    res.send({ isCompleted: false });
    console.log(err);
  }
});
