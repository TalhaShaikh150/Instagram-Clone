import {
  getUserDetailsFromDb,
  sendProfileToDb,
  sendProfileSrc,
  getProfileSrc,
  getProfileFromDb,
  sendPostToDb,
  getPostFromDb,
  supabase,
  sendPostSrc,
  getPostSrc,
} from "../backend/database.js";

let userId;

export async function renderUserDetails() {
  const userName = document.querySelectorAll(".username");
  //Here Fetching User Details From Database
  const data = await getUserDetailsFromDb();
  for (let i = 0; i < data.length; i++) {
    userId = JSON.parse(localStorage.getItem("userid")) || "User";
    if (data[i].id.includes(userId)) {
      let fullName = `${data[i].firstName} ${data[i].lastName} `;
      userName.forEach((name) => {
        name.innerHTML = fullName;
      });
      return data[i].email;
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const email = await renderUserDetails();
  const postModal = document.querySelector(".post-modal");
  const overlay = document.querySelector(".overlay");
  if (window.location.pathname.endsWith("/dashboard.html")) {
    const profileImage = document.querySelector(".profile");

    const dataImages = await getProfileSrc();
    for (let i = 0; i < dataImages.length;i++) {
      if (dataImages[i].src.includes(email)) {
        profileImage.src = dataImages[i].src;
        break;
      }
    }

    // For Logout
    const logOutBtn = document.querySelector(".logout-btn");
    logOutBtn.addEventListener("click", () => {
      window.location = "./login.html";
    });

    // For Show Post
    const showPost = document.querySelector(".show-post-btn");
    showPost.addEventListener("click", () => {
      postModal.classList.remove("hide");
      overlay.classList.remove("hide");
    });

    // For Add Post
    const postCountElement = document.querySelector(".post-count");
    const postTitle = document.querySelector(".post-modal .post-title");
    const postfile = document.querySelector(".post-modal .post-file");
    const addPostBtn = document.querySelector(".post-modal .add-post-btn");
    const postContainer = document.querySelector(".post-container");
    const postSrc = await getPostSrc();

    for (let i = 0; i < postSrc.length; i++) {
      if (postSrc[i].email.includes(email)) {
        postContainer.innerHTML += ` <div class="post">
          <img src="${postSrc[i].src}" class="all-images" alt="" loading="lazy"/>
          <p class="title-post">${postSrc[i].title}</p>
          </div>`;
      }
    }
    const allPost = document.querySelectorAll(".post");
    let postCount = allPost.length;
    postCountElement.innerHTML = postCount;

    addPostBtn.addEventListener("click", async () => {
      if (!postTitle.value || !postfile.value) {
        alert("Don't Leave Empty Fields");
        return;
      }
      if (postTitle.value.length > 15) {
        console.log(postTitle.value.length);
        alert("Post Title Lenght Should Be Less Than 16");
        return;
      }
      postModal.classList.add("hide");
      overlay.classList.add("hide");

      async function render() {
        await sendPostToDb();
        const databasefile = await getPostFromDb();
        const src = databasefile;
        const title = postTitle.value;

        await sendPostSrc(email, src, title);

        let html = `
        <div class="post">
        <img src="${databasefile}" class="all-images" alt="" loading="lazy"/>
        <p class="title-post">${postTitle.value}</p>
        </div>
        `;
        postTitle.value = "";
        postfile.value = "";

        postCount++;

        postCountElement.innerHTML = postCount;
        postContainer.innerHTML += html;
      }
      render();
    });

    const backPostBtn = document.querySelector(".back-post-btn");

    backPostBtn.addEventListener("click", () => {
      postModal.classList.add("hide");
      overlay.classList.add("hide");
    });

    // To Add Profile
    let addProfile = document.querySelector(".upload-btn");

    const postProfileBtn = document.querySelector(".post-profile-btn");
    const backProfileModal = document.querySelector(".back-profile-btn");
    const postProfile = document.querySelector(".profile-pic");
    const profileModal = document.querySelector(".profile-modal");
    //To Show Profile Modal
    addProfile.addEventListener("click", async () => {
      overlay.classList.remove("hide");
      profileModal.classList.remove("hide");
    });

    //To Post Profile Image
    postProfileBtn.addEventListener("click", async () => {
      if (!postProfile.value) {
        alert("Select Image");
        return;
      }
      async function render() {
        await sendProfileToDb();
        const databasefile = await getProfileFromDb();

        //Send Profile Src
        await sendProfileSrc(email, databasefile);

        profileImage.src = databasefile;
        overlay.classList.add("hide");
        profileModal.classList.add("hide");
      }
      render();
    });

    //To Hide Profile Modal
    backProfileModal.addEventListener("click", () => {
      profileModal.classList.add("hide");
      overlay.classList.add("hide");
    });
  }
});
