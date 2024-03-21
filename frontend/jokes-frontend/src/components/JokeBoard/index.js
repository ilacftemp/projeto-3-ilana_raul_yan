import React from "react";
import "./index.css";

export default function JokeBoard(props) {
    return (
        <div className="card">
          <div>
          <h3 className="joke-setup">{props.title}</h3>
          <div className="joke-delivery">{props.children}</div>
          </div>
          <p className="usuarioField">usuário: {props.username}</p>
        </div>
    );
}