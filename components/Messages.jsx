import React from "react";
import { Message } from "rsuite";

export default function Messages(type, msg) {
  return (
    <Message showIcon type={type} closable>
      {msg}
    </Message>
  );
}
