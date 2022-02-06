import { io } from "socket.io-client";
// import axios from "axios";

// const ENDPOINT = process.env.REACT_APP_IO_ENDPOINT || "http://localhost:5000";
const ENDPOINT = "http://localhost:5000";

const socket = (nameSpace, event, data) => {
  return new Promise((resolve, reject) => {
    const manager = io(`${ENDPOINT}/${nameSpace}`, {
      auth: {
        id: data.auth,
      },
    });
    manager.on("timeout", () => {
      return reject("timeout");
    });
    manager.on("connect_error", (error) => {
      console.log("connect_error", error);
      manager.close();
      return reject(error.message);
    });
    manager.on("connect_failed", (error) => {
      console.log(error, "failed");
      manager.close();
      return reject(error.message);
    });
    manager.on("error", (error) => {
      console.log(error, "error");
      manager.close();
      return reject(error.message);
    });

    manager.on("connect", () => {
      manager.emit(event, data, (res, err) => {
        manager.emit("rooms", "new user user joined");

        console.log(res, "reserro");
        if (err) {
          return reject(err.message);
        }
        return resolve(res);
      });

    });
  });
};

export default socket;