import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Checkbox, Modal } from "antd";
import { connect } from "react-redux";
import { createRoom, createOrJoinRoom } from "../redux/actions";

const FormRoomName = (props) => {
  const { room, profile, createOrJoinRoom } = props;

  const [input, setInput] = useState({
    value: "",
    error: false,
    errorMessage: "Please enter a valid room name at least 3 characters long",
  });

  const [checked, setChecked] = useState(false);
  const handleChange = (e) => {
    setInput({
      ...input,
      value: e.target.value,
      error: e.target.value.length < 3,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      roomName: input.value,
      isPrivate: !checked,
      userId: props.profile.id,
    };
    input.value.length > 2
      ? setInput({
        ...input,
        error: false,
      })
      : setInput({
        ...input,
        error: true,
      });
    if (input.value.length > 2 && !input.error) {
      props.createRoom(data);
    }
  };


  useEffect(() => {
    if (room.error) {
      if (room.error === "Room is already exists do you want to join") {
        Modal.confirm({
          title: room.error,
          cancelText: "No",
          okText: "Yes",
          onOk() {
            let data = {
              roomName: input.value,
              isPrivate: true,
              userId: profile.id,
            };
            createOrJoinRoom(data);
          },
          onCancel() { },
        });
      }
    }
  }, [room, profile.id, createOrJoinRoom, input.value]);

  useEffect(() => {
    room.error && room.error !== "Room is already exists do you want to join"
      && message.error(room.error)
  }, [room.error])

  return (
    <Form
      size="large"
      style={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
      onSubmit={handleSubmit}
    >
      <Form.Item
        name="Multi Player"
        style={{
          display: "inline-block",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(!checked)}
          style={{
            display: "flex",
            margin: "auto",
            width: "calc(100% - 90px)",
            maxWidth: "49vh",
          }}
        >
          Multi Player
        </Checkbox>
      </Form.Item>

      <Input.Group
        compact
        style={{
          display: "flex",
          justifyContent: "center",
          flex: "1",
        }}
      >
        <Form.Item
          name="roomname"
          style={{
            width: "calc(100% - 90px)",
            maxWidth: "40vh",
          }}
          help={input.error ? input.errorMessage : ""}
          hasFeedback
          validateStatus={
            input.error ? "error" : input.value.length > 2 ? "success" : ""
          }
        >
          <Input
            onChange={handleChange}
            placeholder="Enter room name"
            name="roomname"
            autoFocus
          />
        </Form.Item>
        <Button
          loading={props.room.isLoading}
          htmlType="submit"
          type="primary"
          className="login-form-button"
          style={{
            background: "#6FCF97",
            color: "#fff",
          }}
          onClick={handleSubmit}
          disabled={
            input.error || input.value.length < 3 || props.room.isLoading
          }
        >
          Create
        </Button>
      </Input.Group>
    </Form>
  );
};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    room: state.room,
  };
};

const RoomName = connect(mapStateToProps, {
  createRoom,
  createOrJoinRoom,
})(FormRoomName);

export default RoomName;
