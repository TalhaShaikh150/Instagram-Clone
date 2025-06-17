import { renderUserDetails } from "../scripts/dashboard.js";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const supabaseUrl = "https://qkfpksymvoyepsbbfpmq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrZnBrc3ltdm95ZXBzYmJmcG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3OTU5NzQsImV4cCI6MjA2NDM3MTk3NH0.dOSrNcPAMBXkcEDfsLCzXoX1uWhiHCaJLpizQUuB1i8";

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function sendUserDetailsToDb(
  firstName,
  lastName,
  email,
  password
) {
  const { data, error } = await supabase
    .from("userDetails")
    .insert([{ firstName, lastName, email, password }])
    .select();

  if (error) {
    console.error("❌ Insert Error:", error.message);
    return null;
  }

  return data.length > 0 ? data[0] : null;
}

export async function getUserDetailsFromDb() {
  const { data, error } = await supabase.from("userDetails").select("*");

  if (error) {
    console.error("❌Fetching Error:", error.message);
    return [];
  }

  return data;
}

//Fetching UserDetails From dashboard.js To add On Stoarage Bucket Folder On Supabase

const email = await renderUserDetails();

//For File Upload
const postfile = document.querySelector(".post-file");
const postProfile = document.querySelector(".profile-pic");

export async function sendProfileToDb() {
  const profile = postProfile.files[0];
  if (!profile) {
    console.error("No profile file selected.");
    return null;
  }

  const { data, error } = await supabase.storage
    .from("userimages")
    .upload(`${email}/profile-${profile.name}`, profile);

  if (error) {
    console.error("Profile Upload Error:", error.message);
    return null;
  }
  return data;
}
//For Fetching Profile Pic From Database

export async function getProfileFromDb() {
  const profile = postProfile.files[0];

  const { data, error } = await supabase.storage
    .from("userimages")
    .getPublicUrl(`${email}/profile-${profile.name}`, profile);

  if (error) {
    console.error("Profile Pic Fetching", error.message);
  }
  const publicUrl = data.publicUrl;

  return publicUrl;
}

export async function sendPostToDb() {
  const file = postfile.files[0];
  if (!file) {
    console.error("No file selected.");
    return null;
  }

  const { data, error } = await supabase.storage
    .from("userimages")
    .upload(`${email}/${file.name}`, file);

  if (error) {
    console.error("File Upload Error:", error.message);
    return null;
  }

  return data;
}
// const postTitle = document.querySelector(".post-modal .post-title");

// const title = postTitle.value;

export async function sendPostSrc(email, src, title) {
  const { data, error } = await supabase
    .from("postSrc")
    .insert([{ email, src, title }])
    .select();

  if (error) {
    console.error("❌ Upsert Error:", error.message);
    return null;
  }

  return data.length > 0 ? data[0] : null;
}

export async function getPostSrc() {
  const { data, error } = await supabase.from("postSrc").select("*");
  return data;
}

//For Fetching Post From Database
export async function getPostFromDb() {
  const postfile = document.querySelector(".post-file");

  const file = postfile.files[0];
  const { data, error } = await supabase.storage
    .from("userimages")
    .getPublicUrl(`${email}/${file.name}`);

  if (error) {
    console.log("Fetch Error", error.message);
  }

  const publicUrl = data.publicUrl;

  return publicUrl;
}

export async function sendProfileSrc(email, src) {
  const { data, error } = await supabase
    .from("profileSrc")
    .upsert([{ email, src }], { onConflict: ["email"] }) // <-- this is the key
    .select();

  if (error) {
    console.error("❌ Upsert Error:", error.message);
    return null;
  }

  return data.length > 0 ? data[0] : null;
}

export async function getProfileSrc() {
  const { data, error } = await supabase.from("profileSrc").select("*");
  return data;
}
