import { Checkbox } from "./ui/checkbox";
import type { ChecklistItem as ChecklistItemType } from "../types/checklist";
import confetti from "canvas-confetti";
import party from "party-js";
import { useState } from "react";

interface Props {
  item: ChecklistItemType;
  onToggle: (id: number) => void;
}

export default function ChecklistItem({ item, onToggle }: Props) {
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const messages = [
    "퇴근 하자!",
    "집 가라!",
    "완료!",
    "굿잡!",
    "멋지다!",
    "잘했어요!",
    "완벽!",
    "끝냈다!",
    "클리어!",
    "대단해!",
  ];

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  const getRandomEffect = () => {
    const effects = ["confetti", "bubbles", "sparkles"];
    return effects[Math.floor(Math.random() * effects.length)];
  };

  const handleToggle = () => {
    if (!item.isChecked) {
      const randomEffect = getRandomEffect();
      if (randomEffect === "confetti") {
        fireConfetti();
      } else if (randomEffect === "bubbles") {
        fireBubbles();
      } else if (randomEffect === "sparkles") {
        fireSparkles();
      }

      const randomMessage = getRandomMessage();
      setShowMessage(randomMessage);
      setTimeout(() => {
        setShowMessage(null);
      }, 1600);
    }
    onToggle(item.id);
  };

  const fireConfetti = () => {
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

  const fireSparkles = () => {
    party.sparkles(document.body, {
      count: party.variation.range(180, 200),
      size: party.variation.range(1, 3),
      speed: party.variation.range(600, 800),
    });
  };

  const fireBubbles = () => {
    party.confetti(document.body, {
      shapes: ["circle", "roundedRectangle"],
      count: party.variation.range(280, 300),
      size: party.variation.range(1, 3),
      speed: party.variation.range(600, 800),
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox checked={item.isChecked} onCheckedChange={handleToggle} />
      <span className={item.isChecked ? "line-through text-gray-400" : ""}>
        {item.title}
      </span>

      {showMessage && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-black animate-pulse z-[9999] pointer-events-none">
          {showMessage}
        </div>
      )}
    </div>
  );
}
