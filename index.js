const express = require("express");
const http = require("http");
const cors = require("cors");
require("./db/config.js")
const Product = require('./db/Product.js');
const socketIO = require("socket.io");
const app = express();
const users = [{}];
app.use(cors());
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config({ path: './.env' })
const port = process.env.port || 4500;



// ..............user register API start..........?
app.post("/register", async (req, resp) => {
  try {
    const { email } = req.body;
    const newUser = await Product.findOne({ email });
    if (newUser) {
      return resp.send({ message: "user already exits" });
    }
    const user = new Product(req.body);
    const result = await user.save();
    resp.send(result);
  } catch (error) {
    resp.send({ message: "internal server error" })

  }


})




// ..................Login Api code start here.................?
app.post('/login', async (req, resp) => {
  if (req.body.password && req.body.email) {
    const data = await Product.findOne(req.body).select("-password");
    if (data) {
      resp.send(data);

    } else {
      resp.send({ Result: "Result not found" });
    }

  } else {
    resp.send({ result: "Record is missing" })
  }

})
// ..................Login Api code end here.................?



const server = http.createServer(app);

const io = socketIO(server);
io.on("connection", (socket) => {


  socket.on('joined', ({ user }) => {
    users[socket.id] = user;

    socket.broadcast.emit("userjoined", { user: "admin", message: ` ${users[socket.id]} has joined` });
    socket.emit('welcome', { user: "admin", message: `welcome to  ${users[socket.id]}` })
  })

  socket.on('message', ({ message, id }) => {
    io.emit('sendMessage', { user: users[id], message, id })

  })
  socket.on('desconnect', () => {
    socket.broadcast.emit('leave', { user: "admin", message: `${users[socket.id]}user has left` })

  })

});

server.listen(port, () => {
  console.log(`server is working on http://localhost:${port}`);
});
