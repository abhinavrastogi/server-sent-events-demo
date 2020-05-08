const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
let clients = [];

app.use(express.static(__dirname + "/"));

app.get("/alerts", function (req, res) {
  // generate client id
  const clientId = Date.now();
  console.log(`connected client with id ${clientId}`);

  // start event stream
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  // save client ref so that we can push events on trigger
  clients.push({
    id: clientId,
    res: res,
  });

  // handle dropped connections
  req.on("close", () => {
    console.log(`dropped client with id ${clientId}`);
    clients = clients.filter((c) => c.id !== clientId);
  });
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
