import {
  getPostSrc,
  getProfileSrc,
  getUserDetailsFromDb,
} from "../backend/database.js";

const profileImages = await getProfileSrc();

const postImages = await getPostSrc();

const dummyImgSrc = "assets/placeholder.jpg";
const dummyProfileSrc = "assets/profile.png";

const feedContainer = document.querySelector(".feed-container");

const userDetails = await getUserDetailsFromDb(); // all users
async function generateFeed() {
  feedContainer.innerHTML = "";

  for (let i = 0; i < userDetails.length; i++) {
    const user = userDetails[i];

    const fullName = `${user.firstName} ${user.lastName}`;

    const email = user.email;

    let userPost = dummyImgSrc;
    for (let j = postImages.length - 1; j >= 0; j--) {
      if (postImages[j].email === email) {
        userPost = postImages[j].src;
        break;
      }
    }

    let userProfile = dummyProfileSrc;
    for (let k = profileImages.length - 1; k >= 0; k--) {
      if (profileImages[k].email === email) {
        userProfile = profileImages[k].src;
        break;
      }
    }

    const html = `
      <div class="feed-post">
      <div class="d-flex">
      <div class="profile-border">
      <img src="${userProfile}" class="profile" />
      </div>
      <div class="username">${fullName}</div>
      </div>
      <div class="feed-img-container">
      <img src="${userPost}" alt="Post Image" />
      </div>
      <div class="icons">
      <div class="gap">
            <i class="fa-regular fa-heart"></i>
            <i class="fa-regular fa-message"></i>
            <i class="fa-solid fa-paper-plane"></i>
          </div>
          <div>
            <i class="fa-solid fa-bookmark"></i>
            </div>
            </div>
            </div>
    `;

    // feedContainer.innerHTML += html;

    feedContainer.innerHTML = html + feedContainer.innerHTML;
  }
}

generateFeed();

// function likeAnimation() {
//   const allFeedPost = document.querySelectorAll(".feed-post");
//   const heart = document.querySelectorAll(".like");

//   allFeedPost.forEach((post) => {
//     post.addEventListener("dblclick", () => {});
//     heart.forEach((h) => {
//       h.classList.remove("hide");
//     });
//   });
// }

// likeAnimation();

{
  /* <i class="fa-solid fa-heart like hide"></i> */
}
