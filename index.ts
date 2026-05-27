import express from "express";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes";
import restuarantRoutes from "./src/routes/restaurantRoutes"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/",restuarantRoutes)

app.get("/", (_req, res) => {
  res.json({ message: "Zomato backend API" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
