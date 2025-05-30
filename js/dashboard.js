// js/dashboard.js

import { getExpenses, addExpense, deleteExpense, getUser } from "./api.js";
import { isAuthenticated, removeToken } from "./auth.js";
import { redirectTo } from "./router.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Check authentication
  if (!isAuthenticated()) {
    await Swal.fire({
      icon: "warning",
      title: "Akses Ditolak",
      text: "Silakan login terlebih dahulu",
      showConfirmButton: false,
      timer: 2000,
      background: "#fff",
    });
    redirectTo("/login");
    return;
  }

  const addExpenseForm = document.getElementById("addExpenseForm");
  const expensesTableBody = document.getElementById("expensesTableBody");
  const totalExpenses = document.getElementById("totalExpenses");
  const logoutButton = document.getElementById("logoutButton");
  const addExpenseError = document.getElementById("addExpenseError");
  const expensesListError = document.getElementById("expensesListError");
  const logoutError = document.getElementById("logoutError");
  const userEmailSpan = document.getElementById("userEmail");

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  // Load expenses
  const loadExpenses = async () => {
    try {
      const expenses = await getExpenses();
      let total = 0;

      expensesTableBody.innerHTML =
        expenses.length === 0
          ? '<tr><td colspan="4" class="text-center py-4">Tidak ada pengeluaran</td></tr>'
          : expenses
              .map((expense) => {
                total += parseFloat(expense.amount);
                return `
                        <tr>
                            <td class="py-2 px-4 border-b">${new Date(
                              expense.date
                            ).toLocaleDateString("id-ID")}</td>
                            <td class="py-2 px-4 border-b">${
                              expense.description
                            }</td>
                            <td class="py-2 px-4 border-b text-right">${formatCurrency(
                              expense.amount
                            )}</td>
                            <td class="py-2 px-4 border-b text-center">
                                <button 
                                    class="text-red-500 hover:text-red-700 delete-expense" 
                                    data-id="${expense.id}"
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    `;
              })
              .join("");

      totalExpenses.textContent = formatCurrency(total);
      expensesListError.classList.add("hidden");
    } catch (error) {
      expensesListError.textContent =
        error.message || "Gagal memuat daftar pengeluaran.";
      expensesListError.classList.remove("hidden");
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Gagal memuat daftar pengeluaran.",
        background: "#fff",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  // Add expense
  addExpenseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;

    try {
      await addExpense(date, description, amount);
      addExpenseForm.reset();
      addExpenseError.classList.add("hidden");
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Data pengeluaran berhasil ditambahkan",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      await loadExpenses();
    } catch (error) {
      addExpenseError.textContent =
        error.message || "Gagal menambahkan pengeluaran.";
      addExpenseError.classList.remove("hidden");
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Gagal menambahkan pengeluaran.",
        background: "#fff",
        confirmButtonColor: "#3085d6",
      });
    }
  });

  // Delete expense
  expensesTableBody.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-expense")) {
      const id = e.target.dataset.id;

      const result = await Swal.fire({
        title: "Hapus Data?",
        text: "Data yang dihapus tidak dapat dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
        background: "#fff",
      });

      if (result.isConfirmed) {
        try {
          await deleteExpense(id);
          await Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Data pengeluaran berhasil dihapus",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });

          await loadExpenses();
        } catch (error) {
          expensesListError.textContent =
            error.message || "Gagal menghapus pengeluaran.";
          expensesListError.classList.remove("hidden");
          await Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message || "Gagal menghapus pengeluaran.",
            background: "#fff",
            confirmButtonColor: "#3085d6",
          });
        }
      }
    }
  });

  // Logout
  logoutButton.addEventListener("click", async () => {
    const result = await Swal.fire({
      title: "Keluar dari Sistem?",
      text: "Anda akan keluar dari sistem!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, keluar!",
      cancelButtonText: "Batal",
      background: "#fff",
    });

    if (result.isConfirmed) {
      try {
        removeToken();
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Anda telah keluar dari sistem",
          showConfirmButton: false,
          timer: 2000,
          background: "#fff",
        });
        redirectTo("/login");
      } catch (error) {
        logoutError.textContent = error.message || "Gagal logout.";
        logoutError.classList.remove("hidden");
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Gagal logout.",
          background: "#fff",
          confirmButtonColor: "#3085d6",
        });
      }
    }
  });

  // Initial load
  await loadExpenses();

  // Load user email
  try {
    const user = await getUser();
    userEmailSpan.textContent = `Halo, ${user.email}`;
  } catch (error) {
    console.error("Error fetching user email:", error);
    userEmailSpan.textContent = "Halo, Pengguna"; // Fallback text
  }
});
