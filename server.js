const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
let clients = [];

app.use(express.static(__dirname + "/"));

app.get("/alerts", function (req, res) {
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  const clientId = Date.now();
  clients.push({
    id: clientId,
    res: res,
  });
  console.log(`connected client with id ${clientId}`);

  req.on("close", () => {
    console.log(`dropped client with id ${clientId}`);
    clients = clients.filter((c) => c.id !== clientId);
  });

  setInterval(function () {}, 2000);
});

app.get("/trigger", (req, res) => {
  clients.forEach((client) => {
    const msg = `data: ${JSON.stringify({
      numberOfClients: clients.length,
    })}\n\n`;
    client.res.write(msg);
  });
  res.send(`updates triggered to ${clients.length} connected clients`);
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
