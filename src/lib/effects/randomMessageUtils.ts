const messages = [
  "퇴근 하자!",
  "집에 가자!",
  "완료!",
  "👍👍👍👍👍👍👍👍👍👍👍👍👍👍",
  "유능해!",
  "잘했어요!",
  "완벽!",
  "끝냈다!",
  "클리어!",
  "대단해!",
];

export const getRandomMessage = () => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

export const getRandomEffect = () => {
  const effects = ["confetti", "bubbles", "sparkles"];
  return effects[Math.floor(Math.random() * effects.length)];
};
