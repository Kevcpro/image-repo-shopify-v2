import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import ImageUpload from "./Components/ImageUpload";

const LandingPage = () => {
    return (
        <BrowserRouter>
            <div className="bg-success">
                <Route exact path={"/"} component={App} />
                <Route path={"/api/image/upload"} component={ImageUpload} />
            </div>
        </BrowserRouter >
    );
};

ReactDOM.render(<LandingPage />, document.getElementById("root"));
