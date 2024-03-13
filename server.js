import http from "http";
import fs from "fs";

const writeLog = (req, res) => {
  const log = `${new Date().toISOString()} - ${req.socket.remoteAddress} - ${
    req.url
  } - ${res.statusCode}\n`;

  fs.appendFile("server.log", log, (err) => {
    if (err) {
      console.error("Failed to log request:", err);
    }
  });
};

const server = http.createServer((req, res) => {
  let filePath = "." + req.url;
  if (filePath === "./") {
    filePath = "./index.html";
  }

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404);
      res.end("404 Not Found");
      writeLog(req, res);
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Internal Server Error");
        writeLog(req, res);
        return;
      }

      res.writeHead(200);
      res.end(data);

      writeLog(req, res);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
