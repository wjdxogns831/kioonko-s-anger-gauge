// 분노 단계 정의: 웹 페이지와 서버(디스코드 알림)가 함께 사용합니다.
// 구간·사진·색·문구를 바꾸고 싶으면 이 파일만 고치면 됩니다.
// 값 101 은 "100을 넘긴" 히든 단계(폭주)를 뜻합니다.
(function (root) {
  const OVERFLOW = 101;

  const LEVELS = [
    { max: 10,  img: 'img/angry-1.png', color: '#99e550', caption: '내 이름은 신채호! 오늘의 기분은 뭐, 그럭저럭이야!' },
    { max: 25,  img: 'img/angry-2.png', color: '#5b6ee1', caption: '오늘 상처받는 말을 들었어, 기분이 별로 안 좋아.' },
    { max: 50,  img: 'img/angry-3.png', color: '#b12dbd', caption: '으... 오늘은 나를 건들이지 않았으면 좋겠어...' },
    { max: 75,  img: 'img/angry-4.png', color: '#e544a3', caption: '나 지금 기분 나빠, 건들이면 화낼 거다아?' },
    { max: 99,  img: 'img/angry-5.png', color: '#ff364a', caption: '야 X발놈아, 뭘 꼬라봐? 의미 없는 비하하지 말라고오!' },
    { max: 100, img: 'img/angry-6.png', color: '#ff0000', caption: '우선 X발 나는 흑인이 아니라고, 너 사람 X끼도 아니지?' },
  ];

  // 히든: 100을 넘기면
  const HIDDEN = { key: 'hidden', img: 'img/angry-7.png', color: '#8b5a3c', caption: '...' };
  // 특별: 정확히 67일 때만
  const SIXTY_SEVEN = { key: '67', img: 'img/10th-life.png', color: '#ff0000', caption: '씩~스 쎄븐~~~' };

  function getLevel(value) {
    const v = Number(value) || 0;
    if (v > 100) return HIDDEN;
    if (v === 67) return SIXTY_SEVEN;
    const i = LEVELS.findIndex((l) => v <= l.max);
    const idx = i === -1 ? LEVELS.length - 1 : i;
    return { key: String(idx + 1), ...LEVELS[idx] };
  }

  // 화면/알림에 보일 숫자
  function displayValue(value) {
    return Number(value) > 100 ? '???' : String(value);
  }

  const api = { LEVELS, HIDDEN, SIXTY_SEVEN, OVERFLOW, getLevel, displayValue };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AngerLevels = api;
})(typeof window !== 'undefined' ? window : globalThis);
