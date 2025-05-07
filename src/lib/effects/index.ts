import { fireConfetti, fireCircles, fireSparkles } from "./fireEffects";
import { showRandomText } from "./randomMessageUtils";
import { showRandomImage } from "./randomImageUtils";

export const showCelebration = () => {
  const contentEffects = [showRandomText, showRandomImage];
  const randomContent =
    contentEffects[Math.floor(Math.random() * contentEffects.length)];

  const particleEffects = [fireConfetti, fireCircles, fireSparkles];
  const randomParticle =
    particleEffects[Math.floor(Math.random() * particleEffects.length)];

  randomContent();
  randomParticle();
};
