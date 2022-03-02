const { Server } = require("socket.io");
const { createServer } = require("http");
const Middleware = require("./middleware/auth");
const AuthController = require("./controller/authController");
const UsersController = require("./controller/usersController");
const InviteController = require("./controller/inviteController");
const RoomsController = require("./controller/roomsController");
const MessagesController = require("./controller/messagesController");

require("dotenv").config();

class App {
  constructor() {
    this.server = createServer();
    this.io = new Server(this.server, {
      cors: {
        // origin: process.env.IO_URL,
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    this.AuthController = new AuthController(this.io);
    this.UsersController = new UsersController(this.io);
    this.InviteController = new InviteController(this.io);
    this.RoomsController = new RoomsController(this.io);
    this.MessagesController = new MessagesController(this.io);
  }

  start() {
    const AuthMiddleware = new Middleware();
    this.server.listen(process.env.PORT || 5000, () => {
      console.log(`server is running on port ${process.env.PORT || 5000}`);
    });


    this.io.on("connection", (socket) => {
      socket.use(AuthMiddleware.auth(socket));

      /********************** Auth ************************************/
      socket.on("login", this.AuthController.login(socket));


      /**************************** Users ************************************/
      socket.on("onlineUsers", this.UsersController.onlineUsers());




      /************************** invitation **************************************/ 
      socket.on("invitation", this.InviteController.invitation(socket));
      socket.on("acceptInvitation", this.InviteController.changeStatusInvitation(socket, "accepted"));
      socket.on("declineInvitation", this.InviteController.changeStatusInvitation(socket, "decline"));

      /******************************** Rooms ***********************************/
      socket.on("currentRooms", this.RoomsController.currentRoom());
      socket.on("createRoom", this.RoomsController.createRoom(socket));
      socket.on("joinRoom", this.RoomsController.joinRoom(socket))
      socket.on("createOrJoin", this.RoomsController.createOrJoinRoom(socket))
      socket.on("changeRoomToPublic", this.RoomsController.changeRoomToPublic(socket))
      socket.on("changeStatusRoom", this.RoomsController.changeStatusRoom(socket))
      socket.on("leaveRoom", this.RoomsController.leaveRoom(socket))


      /****************************** Game ************************************/

      socket.on("gameActions", this.RoomsController.gameAction(socket))
      socket.on("continueGame", this.RoomsController.gameContinue(socket))

      /***************************** Chat *************************************/
      socket.on("sentMessage", this.MessagesController.sentMessage(socket));

      /******************************* logout **********************************/
      socket.on("disconnect", this.AuthController.logout(socket));
      socket.on("error", (error) => {
        socket.emit("error", { message: error.message });
      });


    });
  }
}

module.exports = new App().start();
