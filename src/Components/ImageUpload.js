import React, { Component } from "react";
import axios from "axios";

import { Card, CardHeader, CardText, CardBody, Row, Col } from "reactstrap";

const endpoint = "http://localhost:8080/api/image/upload";

class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            price: 0,
            amountAvailable: 0,
            userId: 0,
            selectedFile: null,
            privacy: ""
        };
    }

    handleSelectedFile = e => {
        e.preventDefault();
        this.setState({
            selectedFile: e.target.files[0]
        });
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleUpload = event => {
        event.preventDefault();
        const data = new FormData(event.target);
        data.append("file", this.state.selectedFile);
        data.append("price", this.state.price);
        data.append("userId", this.state.userId);
        data.append("privacy", this.state.privacy);
        data.append("amountAvailable", this.state.amountAvailable);

        axios
            .post(endpoint, data)
            .then(() => { })
            .catch(error => {
                alert("Oops some error happened, please try again");
            });
    };

    render() {
        return (
            <div>
                <Row style={{ backgroundColor: '#96bf48' }}>
                    <Col xs="4">
                        <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                            <CardHeader className="p-2 mb-2 bg-primary text-white">
                                Upload a new Image
              </CardHeader>
                            <CardBody>
                                <CardText>
                                    <form onSubmit={this.handleUpload}>
                                        <div className="form-group">
                                            <label htmlFor="user">UserId:</label>
                                            <input
                                                type="number"
                                                class="form-control"
                                                name="userId"
                                                onChange={this.onChange}
                                                placeholder="Enter a valid User Id"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="price">Price:</label>
                                            <input
                                                type="number"
                                                class="form-control"
                                                name="price"
                                                onChange={this.onChange}
                                                placeholder="Enter an Amount"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="amountAvailable">Amount Available:</label>
                                            <input
                                                type="number"
                                                class="form-control"
                                                name="amountAvailable"
                                                onChange={this.onChange}
                                                placeholder="Enter the number of units Available"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="privacy">Privacy:</label>
                                            <input
                                                type="string"
                                                class="form-control"
                                                name="privacy"
                                                onChange={this.onChange}
                                                placeholder="Enter your Privacy Setting"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="file"
                                                name=""
                                                id=""
                                                onChange={this.handleSelectedFile}
                                            />
                                        </div>
                                        <button type="submit" class="btn btn-primary">
                                            Upload
                    </button>
                                    </form>
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div >
        );
    }
}

export default ImageUpload;