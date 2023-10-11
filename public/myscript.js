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

      // Di sini kita dapatkan UID pengguna yang masuk
      var userId = user.uid;
      console.log(userId);
      // Cek apakah pengguna ada di koleksi "admin"
      firebase
        .firestore()
        .collection("admin")
        .doc(userId)
        .get()
        .then(function (adminDoc) {
          // Cek apakah pengguna ada di koleksi "counselor"
          firebase
            .firestore()
            .collection("counselor")
            .doc(userId)
            .get()
            .then(function (counselorDoc) {
              if (adminDoc.exists && userType === "admin") {
                alert("Login berhasil sebagai " + userType);
                // Redirect ke halaman admin
                localStorage.setItem("isLoggedIn", "true");
                window.location.href = "admin/dashboard.html";
              } else if (counselorDoc.exists && userType === "counselor") {
                alert("Login berhasil sebagai " + userType);
                // Redirect ke halaman counselor
                localStorage.setItem("isLoggedIn", "true");
                window.location.href = "konselor/dashboard.html";
              } else {
                alert(
                  "Anda tidak memiliki izin untuk mengakses sebagai " + userType
                );
              }
            })
            .catch(function (counselorError) {
              console.error(
                "Error getting counselor document:",
                counselorError
              );
            });
        })
        .catch(function (adminError) {
          console.error("Error getting admin document:", adminError);
        });
    })
    .catch(function (error) {
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
