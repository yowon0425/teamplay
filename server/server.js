// 필요한 모듈 가져오기
const express = require("express");
const cors = require("cors");
const database = require("./firebase");
const config = require("./config");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// 인덱스 페이지 응답 반환
app.get("/", (req, res) => {
  const work = async () => {
    try {
      // 테스트 데이터
      var userData = new Object();
      userData.uid = "ABCCBAABCCBA";
      userData.name = "홍길동";
      userData.age = 27;

      console.log(userData.uid);

      // firestore 에서의 collection은 단순히 문서의 컨테이너이다.
      // db에 'user'라는 컬렉션이 없으면 자동으로 생성 후 사용하며
      // 있다면 그대로 사용한다.
      firebaseAdmin
        .firestore()
        .collection("user")
        // doc() 이면 firestore가 자동으로 id로 문서가 생성한다.
        // doc('임의의 이름') 이면 사용자가 지정한 이름으로 문서가 생성된다.
        .doc(userData.uid)
        // JSON 데이터를 직접 넣는다.
        .set(userData)
        .then(
          () => {
            // 데이터 입력 성공 시...
            return res.send(true);
          },
          (err) => {
            // 데이터 입력 실패 시...
            throw err;
          }
        );
    } catch (err) {
      console.log(err);

      return res.send(false);
    }
  };

  work();
  // res.send("response completed!");
});

// 서버 실행: node server.js
app.listen(config.PORT, () => {
  console.log(`Server started on ${config.HOST_URL}...`);
});
