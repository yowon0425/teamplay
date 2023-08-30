# React Native Project

- Client: 김은영, 채요원
- Server: 류지민

<br/>

## Rules

### 프로젝트 관련

- `src` 폴더 내 컴포넌트 모아놓는 `components`, 페이지 모아놓은 `screens` 폴더

### Github 관련

- 각 페이지 소단위 기능 별로 issue 작성 (assignees에 본인 등록)
- 작성한 issue id와 내용 이용하여 브랜치 생성 후 작업
- pull request 할 때 issue id 명시 (id가 `1`이면 `#1`과 같이)

<br/>

## 협업 방법

### 시작 전 세팅

1. [github] - 개발 진행할 repository fork

2. [로컬] - fork 한 repository를 로컬로 clone

3. [로컬] - remote 명령어를 통해서 upstream 생성

4. [로컬] - remote(원격지)의 origin, upstream 확인

<br/>

### 작업 flow

1. [github] - 개발 프로젝트 내 작업할 issue 생성

2. [로컬] 작업 브랜치 생성 (issue id 활용)

3. [로컬] 작업 브랜치 내에서 작업 후 커밋 생성

4. [로컬] 내 repository(origin)로 push

5. [github] pull request 생성 (issue id와 함께 작업 내용 작성하기)

6. [github] 코드 리뷰 후 merge

7. [로컬] upstream의 master 브랜치로부터 pull 진행

   → 로컬 저장소 최신화

8. [로컬] 로컬 코드를 origin의 master 브랜치에 push 진행

   → 원격 저장소 최신화
