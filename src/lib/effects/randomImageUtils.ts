const images = [
  "/images/leonardo-dicaprio-clapping.gif",
  "images/lamb-thumbs-up.gif",
  "images/jim-carrey-thumbs-up.gif",
  "images/jang-thumb-up.gif",
  "images/company1.png",
  "images/company2.png",
  "images/james-thumb-up.jpg",
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
