const messages = [
  "이 정도면 지구 MVP예요 🌍",
  "성실함으로 우주를 정복 중이시군요 🚀",
  "당신의 노력이 빛났어요 ✨",
  "엄지척! 👍👍👍👍👍👍👍👍👍👍",
  "이 정도 퍼포먼스면 노벨상 감이에요 🏆",
  "탁월한 마무리, 최고예요!",
  "대단해요! 완전 퍼펙트 ⭐️️",
  "이건 예술이에요… 업무의 피카소! 🎨",
  "집중력 무엇?! 멋져요!",
  "하루가 빛났네요, 당신 덕분에 ☀️",
  "일잘러 그 자체, 전설로 남을 각! 📐",
  "지금 이 순간을 역사에 기록해야 해요 📜",
  "☁️하늘이 내린 실력… 아니 신이 보낸 인재!",
  "일 잘하는 사람 실존했네요, 그게 당신이에요 👀",
  "지금 이건 그냥 일한 게 아니라 예술한 거예요 🖌️",
  "이 정도면 사장님이 월급 올려줘야 해요 💸",
  "👽화성에서도 소문났대요. '지구에 레전드 있음'이라고",
  "오늘도 전설 한 편 써내셨네요 📘",
  "이 모든 일처리가 실화인가요? 꿈인 줄 💭",
  "이걸 마치다니… 당신 혹시 타노스예요? 손가락 딱? 🫰",
  "당신에게 주어지는 합격 목걸이 🏅",
];

export const getRandomMessage = () => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

export const showRandomText = () => {
  const message = getRandomMessage();

  const textElement = document.createElement("div");
  textElement.textContent = message;
  textElement.style.position = "fixed";
  textElement.style.top = "50%";
  textElement.style.left = "50%";
  textElement.style.transform = "translate(-50%, -50%)";
  textElement.style.fontSize = "3rem";
  textElement.style.color = "#000";
  textElement.style.zIndex = "9999";
  textElement.style.opacity = "1";
  textElement.style.transition = "opacity 1s ease-out";
  textElement.style.whiteSpace = "nowrap";
  document.body.appendChild(textElement);

  setTimeout(() => {
    textElement.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(textElement);
    }, 1000);
  }, 3000);
};
