// JavaScript
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const create_account_btn = document.querySelector("#create-account-btn");
const container = document.querySelector(".container");
const signupContainer = document.querySelector("#signup-container");
const signupForm = document.querySelector(".sign-up-form");
const signupSuccess = document.querySelector("#signup-success");

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
  create_account_btn.style.display = "block";
  signupContainer.style.display = "none";
  signupSuccess.style.display = "none";
});

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
  create_account_btn.style.display = "none";
  signupContainer.style.display = "block";
  signupSuccess.style.display = "none";
});

create_account_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
  create_account_btn.style.display = "none";
  signupContainer.style.display = "block";
  signupSuccess.style.display = "none";
});

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Simulasi pendaftaran admin (gantilah dengan logika sesuai kebutuhan)
  const signupSuccessful = true;

  if (signupSuccessful) {
    signupSuccess.style.display = "block";
  }
});
