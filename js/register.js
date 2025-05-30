import { register } from "./api.js";
import { redirectTo } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const registerError = document.getElementById("registerError");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await register(email, password);
      await Swal.fire({
        icon: "success",
        title: "Selamat!",
        text: "Akun berhasil dibuat, mengarahkan ke halaman login...",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: "animated fadeInDown",
        },
        background: "#fff",
      });
      redirectTo("/login");
    } catch (error) {
      registerError.textContent =
        error.message || "Registrasi gagal. Silakan coba lagi.";
      registerError.classList.remove("hidden");

      console.error("Error saat register:", error); // Debug log

      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Registrasi gagal. Silakan coba lagi.",
        background: "#fff",
        confirmButtonColor: "#3085d6",
        focusConfirm: true,
        allowOutsideClick: true,
        allowEscapeKey: true,
        preConfirm: () => Promise.resolve(),
      });
    }
  });
});
