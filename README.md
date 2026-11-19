# 🌋 신채호 분노 게이지

신채호의 현재 분노 수치(0~100)를 누구나 실시간으로 볼 수 있는 웹 페이지입니다.
값은 **신채호만** 바꿀 수 있고, 웹(비밀번호) 또는 디스코드(`/분노 70`)로 조작할 수 있어요.
값이 바뀔 때마다 디스코드 채널에 알림이 갑니다.

| 구간 | 사진 | 문구 |
|---|---|---|
| 0~10 | ANGRY-N1 | 내 이름은 신채호! 오늘의 기분은 뭐, 그럭저럭이야! |
| 11~25 | ANGRY-N2 | 오늘 상처받는 말을 들었어, 기분이 별로 안 좋아. |
| 26~50 | ANGRY-N3 | 으... 오늘은 나를 건들이지 않았으면 좋겠어... |
| 51~75 | ANGRY-N4 | 나 지금 기분 나빠, 건들이면 화낼 거다아? |
| 76~99 | ANGRY-N5 | 야 X발놈아, 뭘 꼬라봐? 의미 없는 비하하지 말라고오! |
| 100 | ANGRY-N6 | 우선 X발 나는 흑인이 아니라고, 너 사람 X끼도 아니지? (화면이 흔들려요) |
| 정확히 67 | 10th_life | 씩~스 쎄븐~~~ |
| 히든 (100 초과) | ANGRY-N7 | ... (숫자는 ??? 로 표시) |

히든 단계로 가는 방법은 비밀이에요. 🤫

구간·사진·색·문구는 `public/levels.js` 한 파일만 고치면 (사진은 `public/img/`) 웹과 디스코드 알림에 같이 반영돼요.

## 구조

외부 패키지 없이 Node.js(20.6 이상)만으로 돌아가는 웹 서버 **하나**입니다.

```
server.js                    웹 서버 (페이지, 실시간 반영, 비밀번호 확인, 디스코드 명령 처리, 알림)
public/index.html            게이지 페이지
public/levels.js             단계별 사진·색·문구
public/img/                  단계별 사진
scripts/register-commands.js 디스코드에 /분노 명령 등록 (처음 한 번)
render.yaml                  Render 배포 설정
.env.example                 환경변수 예시
```

- 실시간 반영: 브라우저가 서버에 연결을 열어두고(Server-Sent Events) 값이 바뀌면 바로 받아요. 새로고침 필요 없음.
- 디스코드: 게이트웨이 봇(24시간 접속해 있는 봇)이 아니라, 디스코드가 슬래시 명령을 우리 서버 주소(`/discord/interactions`)로 보내주는 **HTTP 방식**이에요. 그래서 웹 서버 하나로 웹과 디스코드를 같이 처리합니다.

## 1. 내 컴퓨터에서 실행해 보기

1. [Node.js](https://nodejs.org) LTS 버전 설치 (20.6 이상)
2. 이 폴더에서 `.env.example` 을 복사해 `.env` 파일을 만들고 최소한 `ADMIN_PASSWORD` 를 채우기
3. 터미널에서:
   ```
   npm run dev
   ```
4. 브라우저에서 http://localhost:3000 접속
5. 아래 **🔒 신채호 전용** 버튼 → 비밀번호 입력 → 슬라이더로 값 변경

> 디스코드 명령은 디스코드가 인터넷으로 접속할 수 있어야 해서, 내 컴퓨터에서는 테스트가 어렵고 Render에 올린 뒤에 확인하는 게 편해요.

## 2. 디스코드 앱 만들기

1. https://discord.com/developers/applications 접속 → **New Application** → 이름 입력 (예: 분노 게이지)
2. **General Information** 탭에서 복사해 두기
   - `APPLICATION ID` → `DISCORD_APP_ID`
   - `PUBLIC KEY` → `DISCORD_PUBLIC_KEY`
3. **Bot** 탭 → **Reset Token** → 나온 토큰 복사 → `DISCORD_BOT_TOKEN`
   (명령 등록할 때만 쓰고, 서버(Render)에는 넣지 않아도 돼요. 절대 남에게 공유 금지)
4. **Installation** 탭 (또는 OAuth2 → URL Generator)
   - Install Link를 열거나, 스코프 `applications.commands` 를 체크해 만든 링크로 들어가서 디스코드 서버에 앱을 추가
5. 신채호의 디스코드 사용자 ID 알아내기
   - 디스코드 설정 → 고급 → **개발자 모드** 켜기
   - 신채호 프로필 우클릭 → **사용자 ID 복사** → `DISCORD_OWNER_ID`
   - (명령을 바로 쓰고 싶은 서버도 우클릭 → **서버 ID 복사** → `DISCORD_GUILD_ID`)
6. 알림 받을 채널의 웹훅 만들기
   - 채널 설정(톱니바퀴) → **연동** → **웹후크** → **새 웹후크** → **웹후크 URL 복사** → `DISCORD_WEBHOOK_URL`
7. `/분노` 명령 등록 (내 컴퓨터에서, `.env` 에 `DISCORD_APP_ID`, `DISCORD_BOT_TOKEN`, `DISCORD_GUILD_ID` 를 채운 뒤)
   ```
   npm run register
   ```
   `DISCORD_GUILD_ID` 를 넣으면 그 서버에 바로 생기고, 비우면 모든 서버에 등록되는데 반영까지 최대 1시간 걸려요.

## 3. Render에 배포하기

1. 이 폴더를 GitHub 저장소에 올리기 (`.env` 는 `.gitignore` 에 있어서 안 올라가요)
2. https://dashboard.render.com → **New** → **Web Service** → 저장소 선택
3. 설정
   - Runtime: **Node**
   - Build Command: `npm install` (설치할 패키지는 없지만 형식상 넣어둬요)
   - Start Command: `node server.js`
   - Instance Type: Free (아래 주의사항 참고)
   - Health Check Path: `/healthz` (Advanced 안에 있어요, 선택)
4. **Environment** 에 환경변수 추가

   | 이름 | 필수 | 설명 |
   |---|---|---|
   | `ADMIN_PASSWORD` | ✅ | 웹에서 값을 바꿀 때 쓰는 비밀번호 |
   | `DISCORD_PUBLIC_KEY` | 디스코드 쓰면 ✅ | 디스코드 요청이 진짜인지 확인용 |
   | `DISCORD_OWNER_ID` | 디스코드 쓰면 ✅ | 이 사람만 `/분노 값` 으로 변경 가능 |
   | `DISCORD_WEBHOOK_URL` | 선택 | 변경 알림을 보낼 채널 웹훅 |
   | `PUBLIC_URL` | 선택 | 배포된 주소 (알림 제목에 링크로 붙음) |
   | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | 선택 | 값을 영구 저장 (아래 참고) |
   | `INITIAL_VALUE` | 선택 | 저장된 값이 없을 때 시작 값 (기본 0) |

   (`PORT` 는 Render가 알아서 넣어줘요.)
5. **Create Web Service** → 배포가 끝나면 `https://<이름>.onrender.com` 주소가 생겨요
6. 디스코드 개발자 포털 → 내 앱 → **General Information** → **Interactions Endpoint URL** 에
   ```
   https://<이름>.onrender.com/discord/interactions
   ```
   입력 후 **Save Changes**. 디스코드가 바로 검증 요청을 보내는데, 저장이 성공하면 연결 완료예요.
   (실패하면 서버가 깨어 있는지, `DISCORD_PUBLIC_KEY` 가 맞는지 확인)

### 디스코드에서 쓰는 법

- `/분노 값:70` → 게이지를 70으로 변경 (신채호만 가능, 다른 사람이 하면 거절 메시지가 본인에게만 보여요)
- `/분노` (값 없이) → 현재 게이지 확인 (누구나 가능)
- 웹이나 디스코드에서 값이 바뀌면 웹훅 채널에 알림이 가요.

## ⚠️ Render 무료 플랜 주의사항

### 1) 15분 동안 접속이 없으면 잠들어요

무료 웹 서비스는 15분간 요청이 없으면 꺼지고, 다음 요청이 오면 다시 켜지는 데 30초~1분쯤 걸려요.
웹 페이지는 조금 늦게 뜨는 정도지만, **디스코드는 3초 안에 응답이 없으면 "애플리케이션이 응답하지 않았습니다"로 실패**해요.
(서버는 그 사이에 깨어나니 한 번 더 치면 보통 됩니다.)

해결 방법:

- **주기적으로 깨우기 (무료)**: [UptimeRobot](https://uptimerobot.com) 이나 [cron-job.org](https://cron-job.org) 에서
  `https://<이름>.onrender.com/healthz` 를 **10분마다** 호출하도록 설정하면 잠들지 않아요.
  - 단, 무료 플랜은 **계정 전체가 한 달 750시간**을 나눠 써요. 서비스 하나를 24시간 켜두면 약 720~744시간이라 거의 다 써요.
    이미 Render에 다른 무료 서비스가 있고 그것도 계속 깨어 있다면 합쳐서 한도를 넘을 수 있어요. 넘으면 그 달 남은 기간 동안 무료 서비스가 멈춰요.
  - 다른 서비스가 평소에 잠들어 있는 편이면 대부분 괜찮아요. Render 대시보드의 **Billing → Free usage** 에서 사용량을 확인할 수 있어요.
- **유료 인스턴스 (Starter, 월 7달러 정도)**: 잠들지 않고, 아래 디스크 문제도 해결할 수 있어요.

### 2) 무료 플랜은 디스크가 초기화돼요

게이지 값은 기본적으로 `data/gauge.json` 파일에 저장되는데, Render 무료 플랜은 재배포·재시작·잠들었다 깨어날 때 파일이 사라져요.
그러면 값이 `INITIAL_VALUE`(기본 0)로 돌아가요.

해결 방법 (하나만 고르세요):

- **Upstash Redis (무료, 추천)**: https://upstash.com 가입 → Redis 데이터베이스 생성 →
  **REST API** 항목의 `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` 을 Render 환경변수에 넣으면 끝.
  코드가 자동으로 거기에 저장하고 불러와요.
- **Render 유료 + Persistent Disk**: 디스크를 `/var/data` 같은 경로에 붙이고 환경변수 `DATA_DIR=/var/data` 설정.
- **그냥 두기**: 리셋돼도 괜찮다면 아무것도 안 해도 돼요. 😄

## 보안 메모

- 비밀번호, 토큰은 코드에 없고 전부 환경변수로만 받아요. `.env` 는 git에 올라가지 않아요.
- 웹 비밀번호는 IP당 10분에 10번까지만 틀릴 수 있어요.
- 디스코드 요청은 `DISCORD_PUBLIC_KEY` 로 서명을 확인해서, 디스코드가 아닌 곳에서 보낸 가짜 요청은 거절해요.
- 웹훅 주소가 유출되면 누구나 그 채널에 메시지를 보낼 수 있으니 공유하지 마세요.
