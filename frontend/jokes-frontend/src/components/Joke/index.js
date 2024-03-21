import React from "react";
import "./index.css";

export default function Joke(props) {
    return (
        <div className="card">
          <h3 className="joke-setup">{props.title}</h3>
          <div className="joke-delivery">{props.children}</div>
        </div>
    );
}