const images = [
  "images/effect/leonardo-dicaprio-clapping.gif",
  "images/effect/lamb-thumbs-up.gif",
  "images/effect/jim-carrey-thumbs-up.gif",
  "images/effect/jang-thumb-up.gif",
  "images/effect/company1.png",
  "images/effect/company2.png",
  "images/effect/james-thumb-up.jpg",
  "images/effect/pengsu.gif",
  "images/effect/spongebob.gif",
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

  document.body.appendChild(imgElement);

  setTimeout(() => {
    imgElement.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(imgElement);
    }, 1000);
  }, 3000);
};
