const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const indexRoutes=require("./routes/index.routes")
const applicationRoutes=require("./routes/application/application.routes")
const skoRoutes = require("./routes/sko/sko.routes");
const gramasevakaRoutes = require("./routes/gramasevaka/gramasevaka.routes");
const walletRechargeRoutes = require("./routes/sko/walletrecharge.routes");


const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());
app.use("/api",indexRoutes)
app.use("/api/sko", skoRoutes);
app.use("/api", applicationRoutes);
app.use("/api/sko", walletRechargeRoutes);
app.use("/api/admin/reports", require("./routes/admin/report.routes"));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/gramasevaka", gramasevakaRoutes);
module.exports = app;

                       