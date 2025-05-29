// js/login.js

import { login } from "./api.js";
import { saveToken } from "./auth.js";
import { redirectTo } from "./router.js";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await login(email, password);
      saveToken(response.token);

      // Tampilkan notifikasi sukses
      await Swal.fire({
        title: "Berhasil!",
        text: "Login berhasil. Mengalihkan ke dashboard...",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      redirectTo("/dashboard");
    } catch (error) {
      loginError.textContent =
        error.message || "Login gagal. Silakan coba lagi.";
      loginError.classList.remove("hidden");
    }
  });
});
