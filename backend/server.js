const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;
const JWT_SECRET = "your-secret-key"; // Dalam produksi, gunakan environment variable

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (dalam produksi, gunakan database)
const users = [];
const expenses = [];

// Middleware untuk verifikasi JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid" });
    }
    req.user = user;
    next();
  });
};

// Routes
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password harus diisi" });
    }

    // Cek apakah email sudah terdaftar
    if (users.find((user) => user.email === email)) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
    };
    users.push(newUser);

    res.status(201).json({ message: "Registrasi berhasil" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password harus diisi" });
    }

    // Cari user
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Verifikasi password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// Protected routes
app.get("/api/user", authenticateToken, (req, res) => {
  res.json({ email: req.user.email });
});

app.get("/api/expenses", authenticateToken, (req, res) => {
  const userExpenses = expenses.filter(
    (expense) => expense.userId === req.user.id
  );
  res.json(userExpenses);
});

app.post("/api/expenses", authenticateToken, (req, res) => {
  try {
    const { date, description, amount } = req.body;

    // Validasi input
    if (!date || !description || !amount) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    const newExpense = {
      id: expenses.length + 1,
      userId: req.user.id,
      date,
      description,
      amount: parseFloat(amount),
    };

    expenses.push(newExpense);
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

app.delete("/api/expenses/:id", authenticateToken, (req, res) => {
  const expenseId = parseInt(req.params.id);
  const expenseIndex = expenses.findIndex(
    (expense) => expense.id === expenseId && expense.userId === req.user.id
  );

  if (expenseIndex === -1) {
    return res.status(404).json({ message: "Pengeluaran tidak ditemukan" });
  }

  expenses.splice(expenseIndex, 1);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
