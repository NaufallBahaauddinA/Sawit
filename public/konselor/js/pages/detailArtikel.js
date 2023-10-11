// 1. Mengatur Firebase SDK dan Autentikasi
// Pastikan Anda telah menambahkan script Firebase ke file HTML Anda.
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
    var adminRef = db.collection("counselor").doc(uid);
    var imageRef = firebase.firestore().collection("counselor").doc(uid);

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
  var adminRef = db.collection("counselor").doc(uid);

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
          db.collection("counselor")
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
//-------------------------------------------------------------------
const urlParams = new URLSearchParams(window.location.search);
const threadId = urlParams.get("id");
db.collection("articles")
  .doc(threadId)
  .get()
  .then((doc) => {
    if (doc.exists) {
      const threadData = doc.data();

      let title = document.getElementById("titleArtikel");
      let content = document.getElementById("description");
      let imgElement = document.getElementById("imgArtikel"); // Menyesuaikan ID elemen gambar Anda
      title.textContent = threadData.title;
      content.textContent = threadData.content;

      // Menetapkan URL gambar ke atribut src elemen gambar
      imgElement.src = threadData.img || "default-image-url.jpg"; // Ganti "default-image-url.jpg" dengan URL gambar default jika img kosong
    } else {
      console.error("Dokumen tidak ditemukan.");
    }
  })
  .catch((error) => {
    console.error("Terjadi kesalahan saat mengambil dokumen thread:", error);
  });

//------------------hapus-----------------------
let hapusButton = document.getElementById("hapusartikel");

// Menambahkan event listener ke tombol hapus
hapusButton.addEventListener("click", () => {
  // Konfirmasi pengguna sebelum menghapus artikel
  const confirmation = confirm(
    "Apakah Anda yakin ingin menghapus artikel ini?"
  );
  if (confirmation) {
    // Hapus artikel dari database
    db.collection("articles")
      .doc(threadId)
      .delete()
      .then(() => {
        // Artikel berhasil dihapus, arahkan pengguna ke halaman lain atau lakukan tindakan lain yang sesuai
        console.log("Artikel berhasil dihapus.");
        // Misalnya, mengarahkan kembali ke halaman utama
        window.location.href = "artikel.html";
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat menghapus artikel:", error);
      });
  }
});
