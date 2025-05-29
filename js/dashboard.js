// js/dashboard.js

import { getExpenses, addExpense, deleteExpense } from "./api.js";
import { isAuthenticated, removeToken } from "./auth.js";
import { redirectTo } from "./router.js";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", async () => {
  // Check authentication
  if (!isAuthenticated()) {
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

      // Tampilkan notifikasi sukses
      await Swal.fire({
        title: "Berhasil!",
        text: "Pengeluaran berhasil ditambahkan.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      await loadExpenses();
    } catch (error) {
      addExpenseError.textContent =
        error.message || "Gagal menambahkan pengeluaran.";
      addExpenseError.classList.remove("hidden");
    }
  });

  // Delete expense
  expensesTableBody.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-expense")) {
      const id = e.target.dataset.id;

      // Konfirmasi penghapusan dengan SweetAlert2
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Pengeluaran ini akan dihapus permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        try {
          await deleteExpense(id);

          // Tampilkan notifikasi sukses
          await Swal.fire({
            title: "Terhapus!",
            text: "Pengeluaran berhasil dihapus.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          await loadExpenses();
        } catch (error) {
          expensesListError.textContent =
            error.message || "Gagal menghapus pengeluaran.";
          expensesListError.classList.remove("hidden");
        }
      }
    }
  });

  // Logout
  logoutButton.addEventListener("click", async () => {
    try {
      removeToken();

      // Tampilkan notifikasi sukses
      await Swal.fire({
        title: "Berhasil!",
        text: "Anda telah berhasil logout.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      redirectTo("/login");
    } catch (error) {
      logoutError.textContent = error.message || "Gagal logout.";
      logoutError.classList.remove("hidden");
    }
  });

  // Initial load
  await loadExpenses();
});
