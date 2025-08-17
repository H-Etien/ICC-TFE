import React, { Component } from "react";
import { createRoot } from "react-dom/client";

export default class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div>Test React Code</div>;
    }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
