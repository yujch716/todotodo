const images = [
  "/images/effect/leonardo-dicaprio-clapping.gif",
  "/images/effect/leonardo-dicaprio-cheers.gif",
  "/images/effect/lamb-thumbs-up.gif",
  "/images/effect/jim-carrey-thumbs-up.gif",
  "/images/effect/jang-thumb-up.gif",
  "/images/effect/company1.png",
  "/images/effect/company2.png",
  "/images/effect/james.jpg",
  "/images/effect/james2.png",
  "/images/effect/pengsu.gif",
  "/images/effect/spongebob.gif",
  "/images/effect/high-kick.gif",
  "/images/effect/spongebob2.gif",
  "/images/effect/cat-good.jpg",
  "/images/effect/high-kick2.jpg",
  "/images/effect/infinite-goal1.gif",
  "/images/effect/infinite-goal2.png",
  "/images/effect/infinite-goal3.jpg",
  "/images/effect/infinite-goal4.gif",
  "/images/effect/infinite-goal5.jpg",
  "/images/effect/stamp.jpg",
  "/images/effect/dog-clapping.png",
];

export const showRandomImage = () => {
  const randomImage = images[Math.floor(Math.random() * images.length)];

  const imgElement = document.createElement("img");
  imgElement.src = randomImage;
  imgElement.alt = "Centered Image";
  imgElement.style.position = "fixed";
  imgElement.style.top = "50%";
  imgElement.style.left = "50%";
  imgElement.style.transform = "translate(-50%, -50%)";
  imgElement.style.zIndex = "9998";
  imgElement.style.maxWidth = "80%";
  imgElement.style.maxHeight = "80%";
  imgElement.style.opacity = "0";

  imgElement.onload = () => {
    imgElement.style.opacity = "1";

    setTimeout(() => {
      imgElement.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(imgElement);
      }, 1000);
    }, 3000);
  };

  // 에러 처리
  imgElement.onerror = () => {
    console.error("이미지 로드 실패:", randomImage);
    document.body.removeChild(imgElement);
  };

  document.body.appendChild(imgElement);
  imgElement.src = randomImage;
};
