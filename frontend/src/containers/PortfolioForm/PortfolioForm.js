import React, { Component } from 'react';
import axios from "axios";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import './PortfolioForm.css';

export default class PortfolioForm extends Component {
    constructor(props) {
        super(props);

        console.log(props.data.images);
        const hi = [];
        const hiob = {
            "url": "testing",
            "fuck": "me",
        };
        hi.push(hiob);
        this.state = {
            portfolios: null,
            url: null,
            images: props.data.images,
        }
    }

    handleClick = () => {
        this.setState( {portfolios: "Test"} );
    }

    handleChange = (event, index) => {
        console.log(event.target.value);

        const inputVal = event.target.value;
        const inputId = event.target.id;

        this.setState(prevState => ({
            images: {
                ...prevState.images,
                [index]: {
                    ...prevState.images[index], 
                    [inputId] : inputVal
                }
            },
        }));

      }

      handleSave = () => {
        console.log("I will save data!")
      }

    render() {
        const data = this.props.data;
        console.log(this.state);

        const imageGroups = Object.keys(data.images).map(key => 
            <CreateFormImageGroups key={key} data={data.images[key]} state={this.state} handleChange={this.handleChange} index={key}/>
        )

        return (
            <div>
                <Card>
                <CardBody>
                    <h3>{data.title}</h3>
                    <form>
                        {imageGroups}
                        <Button block onClick={this.handleSave}>Save</Button>
                    </form>
                </CardBody>
                </Card>
            </div>
        );
    }
}

const CreateFormImageGroups = (props) => {
    const data = props.data;
    console.log(data);
    return (
        <Card className="image-form">
            <CardBody className="image-form-body">
                <FormGroup controlId="caption" bssize="small">
                    <FormLabel>Image Caption</FormLabel>
                    <FormControl
                    type="text"
                    value={props.state.images[props.index].caption}
                    onChange={(e) => props.handleChange(e, props.index)}
                    />
                </FormGroup>
                <FormGroup controlId="url" bssize="large">
                    <FormLabel>Image URL</FormLabel>
                    <FormControl
                    type="text"
                    value={props.state.images[props.index].url}
                    onChange={(e) => props.handleChange(e, props.index)}
                    />
                </FormGroup>
            </CardBody>
        </Card>
    );
}