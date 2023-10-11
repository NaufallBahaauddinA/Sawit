var firebaseConfig = {
  apiKey: "AIzaSyDOrQCkN2KmbPvaBqH8cq0FbzelJcRDLyM",
  authDomain: "sawit-website.firebaseapp.com",
  projectId: "sawit-website",
  storageBucket: "sawit-website.appspot.com",
  messagingSenderId: "83313894601",
  appId: "1:83313894601:web:e244f4377fbe7ee1895918",
};

// Menginisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage().ref();
var db = firebase.firestore();
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var uid = user.uid; // ID Pengguna
    var adminRef = db.collection("admin").doc(uid);
    var imageRef = firebase.firestore().collection("admin").doc(uid);

    // Ambil elemen <img> dengan ID tertentu
    var imageElement = document.getElementById("profile");

    // Ambil data gambar dari Firestore
    imageRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          var data = doc.data();
          var imageUrl = data.img;

          // Ubah atribut src untuk menampilkan gambar
          if (imageUrl != null) {
            // Ubah atribut src untuk menampilkan gambar
            imageElement.src = imageUrl;
          }
        } else {
          console.log("Dokumen tidak ditemukan!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });

    var genderRadioElements = document.getElementsByName("gender");
    var nameInputElement = document.getElementById("AdminnameInput");
    var imgElement = document.getElementById("imgprofile");
    var nameElement = document.getElementById("Adminname");

    adminRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          var adminData = doc.data();
          var adminName = adminData.name;
          var adminimg = adminData.img;

          nameInputElement.value = adminName;
          nameElement.textContent = adminName;
          imgElement.src = adminimg;

          if (adminData.gender) {
            genderRadioElements.forEach(function (radio) {
              if (radio.value === adminData.gender) {
                radio.checked = true;
              }
            });
          }

          adminRef.onSnapshot(function (doc) {
            var updatedData = doc.data();

            genderRadioElements.forEach(function (radio) {
              if (radio.value === updatedData.gender) {
                radio.checked = true;
              } else {
                radio.checked = false;
              }
            });
          });
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

    var saveButton = document.getElementById("buttonsave");
    saveButton.addEventListener("click", function () {
      var newName = nameInputElement.value;
      var imgprofile = imgElement.files[0]; // Menggunakan .files[0] untuk mendapatkan gambar dari input file
      var selectedGender;

      genderRadioElements.forEach(function (radio) {
        if (radio.checked) {
          selectedGender = radio.value;
        }
      });

      updateAdminData(uid, newName, selectedGender, imgprofile);
    });

    document
      .getElementById("updateAdminForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        postImagesToFirestore(uid);
      });
  } else {
    // User is signed out.
    console.log("No user is signed in.");
  }
});

function updateAdminData(uid, newName, newGender, newImage) {
  var adminRef = db.collection("admin").doc(uid);

  adminRef
    .update({
      name: newName,
      gender: newGender,
    })
    .then(() => {
      console.log("Document successfully updated!");
      if (newImage) {
        postImagesToFirestore(uid, newImage);
      } else {
        location.reload();
      }
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
}

function postImagesToFirestore(uid, newImage) {
  if (newImage) {
    let uploadTask = storage
      .child("profileAdmin/" + newImage.name)
      .put(newImage);

    uploadTask.on(
      "state_changed",
      function (snapshot) {
        // proses upload
      },
      function (error) {
        console.error(error);
      },
      function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          db.collection("admin")
            .doc(uid)
            .update({
              img: downloadURL,
            })
            .then(function () {
              console.log("Gambar berhasil diunggah!");
              location.reload();
            })
            .catch(function (error) {
              console.error("Error menulis dokumen: ", error);
            });
        });
      }
    );
  } else {
    console.log("Tidak ada gambar yang dipilih.");
  }
}

//--------------------------------------------------
var threadsCollection = db.collection("threads");

// Gunakan metode .get() untuk mendapatkan seluruh dokumen di koleksi
threadsCollection
  .get()
  .then(function (querySnapshot) {
    var jumlahThreads = querySnapshot.size; // Mendapatkan jumlah dokumen dalam koleksi
    var jumlahThreadsElement = document.getElementById("jumlahthreads");
    jumlahThreadsElement.textContent = "Terdapat " + jumlahThreads + " threads";
  })
  .catch(function (error) {
    console.error("Error getting documents: ", error);
  });
//--------------------------------------------------
var threadsCollection = db.collection("chats");

// Gunakan metode .get() untuk mendapatkan seluruh dokumen di koleksi
threadsCollection
  .get()
  .then(function (querySnapshot) {
    var jumlahThreads = querySnapshot.size; // Mendapatkan jumlah dokumen dalam koleksi
    var jumlahThreadsElement = document.getElementById("jumlahkonsultasi");
    jumlahThreadsElement.textContent = "Terdapat " + jumlahThreads + " chat";
  })
  .catch(function (error) {
    console.error("Error getting documents: ", error);
  });
//--------------------------------------------------
var threadsCollection = db.collection("reports");

// Gunakan metode .get() untuk mendapatkan seluruh dokumen di koleksi
threadsCollection
  .get()
  .then(function (querySnapshot) {
    var jumlahThreads = querySnapshot.size; // Mendapatkan jumlah dokumen dalam koleksi
    var jumlahThreadsElement = document.getElementById("jumlahlaporan");
    jumlahThreadsElement.textContent = "Terdapat " + jumlahThreads + " Laporan";
  })
  .catch(function (error) {
    console.error("Error getting documents: ", error);
  });
//--------------------------------------------------
var threadsCollection = db.collection("articles");

// Gunakan metode .get() untuk mendapatkan seluruh dokumen di koleksi
threadsCollection
  .get()
  .then(function (querySnapshot) {
    var jumlahThreads = querySnapshot.size; // Mendapatkan jumlah dokumen dalam koleksi
    var jumlahThreadsElement = document.getElementById("jumlahartikel");
    jumlahThreadsElement.textContent = "Terdapat " + jumlahThreads + " artikel";
  })
  .catch(function (error) {
    console.error("Error getting documents: ", error);
  });
//---------------------ADD ACONUT ADMIN----------------------------
document.getElementById("signup-button").addEventListener("click", function () {
  // Mendapatkan nilai dari input form
  var name = document.getElementById("name").value;
  var nohp = document.getElementById("nohp").value;
  var email = document.getElementById("email_signup").value;
  var password = document.getElementById("psw_signup").value;

  // Membuat akun dengan Firebase Authentication
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      // Mendapatkan ID pengguna yang baru dibuat
      var user = userCredential.user;

      // Menyimpan data pengguna ke Firestore
      db.collection("admin")
        .doc(user.uid)
        .set({
          name: name,
          nohp: nohp,
          email: email,
          password: password,
          id: user.uid,
        })
        .then(function () {
          console.log("Data pengguna berhasil disimpan ke Firestore");
          // Di sini Anda dapat mengarahkan pengguna ke halaman lain atau menampilkan pesan sukses.
        })
        .catch(function (error) {
          console.error("Error menyimpan data pengguna: ", error);
        });
    })
    .catch(function (error) {
      console.error("Error membuat akun: ", error);
    });
});
//---------------------ADD ACONUT COUNSELOR----------------------------
document
  .getElementById("signup-buttonkons")
  .addEventListener("click", function () {
    // Mendapatkan nilai dari input form
    var name = document.getElementById("namekons").value;
    var nohp = document.getElementById("nohpkons").value;
    var email = document.getElementById("email_signupkons").value;
    var password = document.getElementById("psw_signupkons").value;

    // Membuat akun dengan Firebase Authentication
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function (userCredential) {
        // Mendapatkan ID pengguna yang baru dibuat
        var user = userCredential.user;

        // Menyimpan data pengguna ke Firestore
        db.collection("counselor")
          .doc(user.uid)
          .set({
            name: name,
            nohp: nohp,
            email: email,
            password: password,
            id: user.uid,
          })
          .then(function () {
            console.log("Data pengguna berhasil disimpan ke Firestore");
            location.reload();
            // Di sini Anda dapat mengarahkan pengguna ke halaman lain atau menampilkan pesan sukses.
          })
          .catch(function (error) {
            console.error("Error menyimpan data pengguna: ", error);
          });
      })
      .catch(function (error) {
        console.error("Error membuat akun: ", error);
      });
  });
