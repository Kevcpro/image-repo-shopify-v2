import React, { Component } from "react";
import { Row, Col, Card, CardHeader, CardText, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const endpoint = "http://localhost:8080/api/image/"

class Marketplace extends Component {
    state = {
        images: [],
        reset: false
    };


    buyImage = async (id) => {
        axios.put(endpoint + "buy", {image_id: id}).then( res =>{
            if(res.status == 200){
                alert("Successfully bought the Image!");
                window.location.reload();
            }
            else{
                alert("Sorry the image is currently not available");
            }
        });
    };

    componentDidMount() {
        axios.get(endpoint).then(res => {
            console.log(res.data);
            this.setState({ images: res.data });
        });
    }

    render() {
        return (
            <div style={{ backgroundColor: '#96bf48' }}>
                <Col xs="8">
                    <Card>
                        <CardHeader className="p-2 mb-2 bg-primary text-white" />
                        <CardBody >
                            <CardText>
                                <table className="table table-stripe">
                                    <thead>
                                        <tr>
                                            <th>Image Id</th>
                                            <th>Price </th>
                                            <th>Units Available </th>
                                            <th>Image </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                         {this.state.images.map(image => (
                                            <tr>
                                                <td>{image.image_id}</td>
                                                <td>{image.price}</td>
                                                <td>{image.amountAvailable}</td>
                                                <td>
                                                    <img src = {image.fileLink} style= {{width: 150, height: 100, visibility: "visible"}} />
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={this.buyImage.bind(
                                                            this,
                                                            image.image_id
                                                        )}
                                                        className="btn btn-danger"
                                                    >
                                                        Buy
                                                        </button>
                                                </td>
                                            </tr>
                                        ))} 
                                    </tbody> 
                                </table>
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>

                <Row style={{ backgroundColor: '#96bf48' }}>
                    <Col>
                        <div class="float-sm-right m-b-sm">
                            <h4>
                                <Link
                                    to={"/api/image/upload"}
                                    className="btn btn-secondary btn-sm active"
                                    role="button"
                                    aria-pressed="true"
                                >
                                    Add a New Image
                </Link>
                            </h4>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Marketplace;
