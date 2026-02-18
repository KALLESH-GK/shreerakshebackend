const app = require("./app");
const { initializeDatabase } = require("./db/connection");
require("dotenv").config({ path: "./config/.env" });

const PORT = process.env.PORT || 5000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 API available at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  });
