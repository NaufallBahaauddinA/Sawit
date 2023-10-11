var firebaseConfig = {
  apiKey: "AIzaSyDOrQCkN2KmbPvaBqH8cq0FbzelJcRDLyM",
  authDomain: "sawit-website.firebaseapp.com",
  projectId: "sawit-website",
  storageBucket: "sawit-website.appspot.com",
  messagingSenderId: "83313894601",
  appId: "1:83313894601:web:e244f4377fbe7ee1895918",
};
firebase.initializeApp(firebaseConfig);

// Referensi Firestore
var db = firebase.firestore();
var auth = firebase.auth();

document.getElementById("signin-button").addEventListener("click", function () {
  var email = document.getElementById("email_signin").value;
  var password = document.getElementById("psw_signin").value;
  var userType = document.getElementById("user_type").value;

  // Sign in menggunakan Firebase Authentication
  auth
    .signInWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      var user = userCredential.user;

      alert("Login berhasil sebagai " + userType);
      // Redirect ke halaman yang sesuai
      if (userType === "admin") {
        // Set status login ke local storage
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "dashboard.html";
      }
      if (userType === "counselor") {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "dashboard.html";
      }
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Login gagal. Periksa email dan password Anda.");
    });
});

function checkLoginStatus() {
  // Periksa status login dengan Firebase Authentication
  var user = auth.currentUser;

  if (user) {
    // Pengguna sudah masuk
    location.href = "dashboard.html";
  } else {
    console.log("Not logged in");
  }
}
