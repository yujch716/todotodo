import confetti from "canvas-confetti";
import party from "party-js";

export const fireConfetti = () => {
  const fire = () => {
    confetti({
      particleCount: 120,
      startVelocity: 30,
      spread: 180,
      scalar: 1.2,
      origin: { x: Math.random(), y: Math.random() },
      zIndex: 9999,
    });
  };

  const burstCount = 5;
  const interval = 200;

  for (let i = 0; i < burstCount; i++) {
    setTimeout(() => {
      fire();
      fire();
    }, i * interval);
  }
};

export const fireSparkles = () => {
  const triggerSparkles = () => {
    party.sparkles(document.body, {
      count: party.variation.range(180, 200),
      size: party.variation.range(1, 3),
      speed: party.variation.range(400, 600),
    });
  };

  triggerSparkles();

  setTimeout(() => {
    triggerSparkles();
  }, 1000);
};

export const fireBubbles = () => {
  const triggerBubbles = () => {
    party.confetti(document.body, {
      shapes: ["circle", "roundedRectangle"],
      count: party.variation.range(280, 300),
      size: party.variation.range(1, 3),
      speed: party.variation.range(600, 800),
    });
  };

  triggerBubbles();

  setTimeout(() => {
    triggerBubbles();
  }, 500);
};
