const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const Vonage = require("@vonage/server-sdk");
const socketio = require("socket.io");

const vonage = new Vonage(
  {
    apiKey: "dd7006cc",
    apiSecret: "eV4qNJfIyCEgk9zy",
  },
  { debug: true }
);

const app = express();

app.set("view engine", "html");
app.engine("html", ejs.renderFile);

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  // res.send(req.body);
  // console.log(req.body);
  const number = req.body.number;
  const text = req.body.text;

  vonage.message.sendSms(
    "186662801041",
    number,
    text,
    { type: "unicode" },
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.log(responseData);
        const data = {
          id: responseData.messages[0]["message-id"],
          number: responseData.messages[0]["to"],
        }

        io.emit('smsStatus', data);
      }
    }
  );
});

const port = 3000;

const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

const io = socketio(server);
io.on("connection", (socket) => {
  console.log("connected");
  io.on("disconnect", () => {
    console.log("disconnected");
  });
});
