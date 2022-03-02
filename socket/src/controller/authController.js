const Users = require("../users/users");
const Rooms = require("../rooms/rooms");
const _ = require("lodash");

class AuthController {

    constructor(io) {
        this.io = io;
        this.users = new Users;
        this.rooms = new Rooms;
    }

    /**
     * @description login
     * @param {object} socket - socket object
     * @param {string} data - user name
     * @param {function} callback - (res, err)
     */
    login = (socket) => async (data, callback) => {
        try {
            if (!data || typeof data !== 'string')
                return callback(null, { message: "Please enter a valid name" });
            let res = await this.users.login(socket.id, data);
            socket.join('online');
            this.io.in('online').emit("updateUsers", this.users.getUsers());
            return callback(res, null);
        } catch (error) {
            return callback(null, error);
        }
    };

    /**
     * @description logout user and delet room if empty
     * @param {object} socket - socket object 
     */
    logout = (socket) => async () => {
        try {
            let user = await this.users.getUser(socket.id);
            if (user.isJoined) {
                let room = await this.rooms.leaveRoom(socket.id, user.room);
                if (room.users.length === 0) {
                    let currntRooms = await this.rooms.deleteRoom(room.id);
                    this.io.emit("updateRooms", currntRooms);
                } else {
                    let usersIds = room.ids;
                    if (user.id === room.admin) {
                        let updateRoom = this.rooms.switchAdmin(room.id);
                        let newAdmin = updateRoom.users.find(user => user.id === updateRoom.admin)
                        usersIds = usersIds.filter(id => id !== updateRoom.admin);
                        usersIds.length && this.io.to(usersIds).emit("notification", {
                            message: `admin changed to ${newAdmin.name}`,
                            type: "notification",
                            read: true,
                        })
                        this.io.to(newAdmin.id).emit('notification', {
                            message: `you are admin of this room`,
                            type: 'notification',
                        })
                        this.io.to(newAdmin.id).emit("updateRoom", updateRoom);
                        let resUsers = _.omit(updateRoom, ["invit"]);
                        usersIds.length && this.io.to(usersIds).emit('updateRoom', resUsers);
                    }
                    else {
                        usersIds.length && this.io.to(usersIds).emit("updateRoom", room);
                        usersIds.length && this.io.to(usersIds).emit("notification", {
                            message: `${user.name} left this room`,
                            type: "notification",
                            read: true,
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