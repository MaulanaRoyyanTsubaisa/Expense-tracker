import { register } from "./api.js";
import { redirectTo } from "./router.js";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const registerError = document.getElementById("registerError");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await register(email, password);

      // Tampilkan notifikasi sukses
      await Swal.fire({
        title: "Berhasil!",
        text: "Akun berhasil dibuat. Silakan login.",
        icon: "success",
        confirmButtonText: "OK",
      });

      redirectTo("/login");
    } catch (error) {
      registerError.textContent =
        error.message || "Registrasi gagal. Silakan coba lagi.";
      registerError.classList.remove("hidden");
    }
  });
});
