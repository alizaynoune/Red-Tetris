const Users = require("../users/users");
const Rooms = require("../rooms/rooms");
const Selector = require("../utils/selector")

class AuthController {

    constructor(io) {
        this.io = io;
        this.users = new Users;
        this.rooms = new Rooms;
        this.selector = new Selector;
    }

    /**
     * @description accept invetation join room
     * @param {object} socket - socket object
     * @param {object} data - {userName} 
     * @param {function} callback - (res, err)
     */
    login = (socket) => async (data, callback) => {
        // console.log("socket id=>", socket.id, this.io);
        console.log(`User ${socket.id} is trying to login`);
        try {
            let res = await this.users.login(socket.id, data);
            socket.join('online');
            this.io.in('online').emit("updateUsers", this.users.getUsers());
            console.log("res", res);
            if (typeof callback === "function") callback(res, null);
        } catch (error) {
            if (typeof callback === "function") callback(null, error);
        }
    };

    /**
     * @description logout user and delet room if empty
     * @param {object} socket - socket object 
     */
    logout = (socket) => async () => {
        console.log(`${socket.id} try to logout <<<<<<<<<<<<<<<<<<<<<<<`);
        try {
            let user = await this.users.getUser(socket.id);
            if (user.isJoned) {
                let room = await this.rooms.leaveRoom(socket.id, user.room);
                if (room.users.length === 0) {
                    console.log('delet room => ', room);
                    let currntRooms = await this.rooms.deleteRoom(room.id);
                    this.io.emit("updateRooms", currntRooms);
                } else {
                    let usersIds = this.selector.Data(room.users, (({id}) => id));
                    if (user.id === room.admin){
                        // switch admin
                        let updateRoom = this.rooms.switchAdmin(room.id);
                        let newAdmin = updateRoom.users.find(user => user.id === updateRoom.admin)
                        usersIds = usersIds.filter(id => id !== updateRoom.admin);
                        usersIds.length && this.io.to(usersIds).emit("notification", {
                            message: `admin changed to ${newAdmin.name}`,
                            type: "notif",
                        })
                        this.io.to(newAdmin.id).emit('notification', {
                            message: `you are admin of this room`,
                            type: 'notif',
                        })
                        this.io.to(newAdmin.id).emit('updateRoom', updateRoom);
                    }
                    else {
                        // notif users in this room
                        this.io.to(room.admin).emit("updateRoom", room);
                        this.io.to(usersIds).emit("notification", {
                            message: `${user.name} left this room`,
                            type: "notif",
                        })
                    }
                }
            }
            let allUsers = await this.users.logout(socket.id);
            this.io.emit("updateUsers", allUsers);
        } catch (error) {
            console.log("error", error);
        }
    }
}

module.exports = AuthController;