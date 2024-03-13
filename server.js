import http from "http";
import fs from "fs/promises";

const writeLog = async (req, res) => {
  try {
    const log = `${new Date().toISOString()} - ${req.socket.remoteAddress} - ${
      req.url
    } - ${res.statusCode}\n`;

    await fs.appendFile("server.log", log);
  } catch (error) {
    console.error("Failed to log request:", error);
  }
};

const server = http.createServer(async (req, res) => {
  let filePath = "." + req.url;

  if (filePath === "./") {
    filePath = "./index.html";
  }

  try {
    await fs.access(filePath, fs.constants.F_OK);
  } catch (error) {
    res.writeHead(404);
    res.end("404 Not Found");
    await writeLog(req, res);
    return;
  }

  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200);
    res.end(data);
  } catch (error) {
    res.writeHead(500);
    res.end("Internal Server Error");
  } finally {
    await writeLog(req, res);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
