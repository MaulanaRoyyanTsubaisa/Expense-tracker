// js/login.js

import { login } from "./api.js";
import { saveToken } from "./auth.js";
import { redirectTo } from "./router.js";

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
      await Swal.fire({
        icon: "success",
        title: "Selamat Datang!",
        text: "Login berhasil, mengarahkan ke dashboard...",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: "animated fadeInDown",
        },
        background: "#fff",
        backdrop: `
          rgba(0,0,0,0.4)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `,
      });
      redirectTo("/dashboard");
    } catch (error) {
      loginError.textContent =
        error.message || "Login gagal. Silakan coba lagi.";
      loginError.classList.remove("hidden");
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Login gagal. Silakan coba lagi.",
        customClass: {
          popup: "animated fadeInDown",
        },
        background: "#fff",
        confirmButtonColor: "#3085d6",
      });
    }
  });
});
