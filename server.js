const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  let filePath = "." + req.url;
  if (filePath === "./") {
    //filePath = "./views/fan.html";
    filePath = "./views/main.html";
    // filePath = "./views/partySystem.html";
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType =
    {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
    }[extname] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code == "ENOENT") {
        // fs.readFile("./404.html", (err, content) => {
        //   res.writeHead(404, { "Content-Type": "text/html" });
        //   res.end(content, "utf-8");
        // });
      } else {
        res.writeHead(500);
        res.end(
          "Sorry, check with the site admin for error: " + err.code + " ..\n"
        );
        res.end();
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
