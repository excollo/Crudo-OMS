const http = require("http");
const dotenv = require("dotenv");
const app = require("./src/app");

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})

process.on("SIGINT", () => {
  console.log("Shutting down server....");
  server.close(() => {
    console.log("Server Shut down gracefully.");
    process.exit(0);
  });
});