import React, { Component } from 'react';
import axios from "axios";
import { Button, FormGroup, FormControl, FormLabel, FormCheck } from "react-bootstrap";
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import './PortfolioForm.css';
// https://preview.themeforest.net/item/skylith-viral-creative-multipurpose-html-template/full_screen_preview/21214857?ref=cirvitis

// TODO:
// Add a "Add Image" button which adds an image to the portfolio images array.
// Add a newImages to the state and add the new images there, then pass them through to a request.
// Add a isVisible checkbox to the form.

export default class PortfolioForm extends Component {
    constructor(props) {
        super(props);

        console.log(props.data);

        this.state = {
            title: props.data.title,
            about: props.data.about,
            visible: props.data.visible,
            id: props.data.id,
            images: props.data.images,
            newImages: [], // Used to add new images.
        }
    }

    handleClick = () => {
        this.setState( {portfolios: "Test"} );
    }

    handleInfoChange = event => {

        const inputVal = event.target.value;
        console.log("Testing");

        this.setState({
            [event.target.id]: event.target.value 
        });

      }

    handleNewImageChange = (event, index) => {

        const inputVal = event.target.value;
        const inputId = event.target.id;

        let newImages = [...this.state.newImages];
        newImages[index][inputId] = inputVal;
        this.setState({ newImages });

    }

    handleImageChange = (event, index) => {
        console.log(event.target.value);

        const inputVal = event.target.value;
        const inputId = event.target.id;
        /*
        this.setState(prevState => ({
            images: {
                ...prevState.images,
                [index]: {
                    ...prevState.images[index], 
                    [inputId] : inputVal
                }
            },
        })); */

        let images = [...this.state.images];
        images[index][inputId] = inputVal;
        images[index].update = true;
        this.setState({ images });
    }

    // Add a new index to the newImages array.
    handleNew = () => {
        const imageInfo = {
            "url": "",
            "caption": "",
            visible: true,
        };
        this.setState(prevState => {
            const state = prevState;
            const len = Object.keys(state.newImages).length;
            //state.newImages.splice(len, 0, imageInfo);
            state.newImages.push(imageInfo);
            //state.newImages[len] = imageInfo;
            return state;
        });
        //console.log(this.state);
    }

    handleDelete = (event, index, type) => {
        event.preventDefault();
        if (index > -1) {
            //let newImages = [...this.state.newImages];
            //newImages.splice(index, 1);
            //this.setState({ newImages });
            const deleted = [...this.state[type]];
            deleted.splice(index, 1);
            this.setState({ [type]: deleted });
        }
    }

    handleVisible = (event, index, type) => {
        // handle unchecking visibility here.
        const inputId = event.target.id;
        const checked = event.target.checked;

        let updateState = [...this.state[type]];
        updateState[index].visible = checked;
        this.setState({ [type]: updateState });
    }

    handleSave = () => {
        console.log(this.state);
    }

    render() {
        const data = this.props.data;
        console.log(this.state);

        const imageGroups = Object.keys(this.state.images).map(key => 
            <CreateFormImageGroups key={key} data={this.state.images[key]} state={this.state} 
            handleImageChange={this.handleImageChange} index={key} handleDelete={this.handleDelete} handleVisible={this.handleVisible} />
        )
        // Map over the new images and add their forms to the DOM.

        const newImageGroups = Object.keys(this.state.newImages).map(key => 
            <CreateNewFormImage key={key} data={this.state.newImages[key]} state={this.state} handleNewImageChange={this.handleNewImageChange} 
            index={key} handleDelete={this.handleDelete} handleVisible={this.handleVisible} />
        )

        return (
            <div>
                <Card>
                <CardBody>
                    <form>
                        <CreateFormPortfolioInfo data={this.state} handleInfoChange={this.handleInfoChange} />
                        {imageGroups}
                        {newImageGroups}
                        <Button block onClick={this.handleNew}>Add New</Button>
                        <Button block onClick={this.handleSave}>Save</Button>
                    </form>
                </CardBody>
                </Card>
            </div>
        );
    }
}

const CreateFormPortfolioInfo = (props) => {
    const data = props.data;
    return (
        <div>
            <FormGroup controlId="title" bssize="small">
                <FormLabel>Title</FormLabel>
                <FormControl
                type="text"
                value={data.title}
                onChange={props.handleInfoChange}
                />
            </FormGroup>
            <FormGroup controlId="about" bssize="small">
                <FormLabel>About</FormLabel>
                <FormControl
                type="text"
                value={data.about}
                onChange={props.handleInfoChange}
                />
            </FormGroup>
        </div>
    );
}

const CreateNewFormImage = (props) => {
    const data = props.data;
    //console.log(data);
    // Check if props.state.newImages is not null, then map through it and return newForm for each in it.
    const type = "newImages";
    const isVisible = props.state.newImages[props.index].visible;
    return (
        <Card className="image-form">
            <CardBody className="image-form-body-new">
                <FormGroup controlId="caption" bssize="small">
                    <FormLabel>Image Caption</FormLabel>
                    <FormControl
                    type="text"
                    value={props.state.newImages[props.index].caption}
                    onChange={(e) => props.handleNewImageChange(e, props.index)}
                    />
                </FormGroup>
                <FormGroup controlId="url" bssize="large">
                    <FormLabel>Image URL</FormLabel>
                    <FormControl
                    type="text"
                    value={props.state.newImages[props.index].url}
                    onChange={(e) => props.handleNewImageChange(e, props.index)}
                    />
                </FormGroup>
                <FormGroup>
                    <FormCheck onChange={(e) => props.handleVisible(e, props.index, type)} checked={isVisible} type="checkbox" label="Visible"/>
                </FormGroup>
                <Button variant="danger" onClick={(e) => props.handleDelete(e, props.index, type)} >Delete</Button>
            </CardBody>
        </Card>
    );
    // Return the new image form here.
}

const CreateFormImageGroups = (props) => {
    const data = props.data;
    console.log(data);
    // Check if props.state.newImages is not null, then map through it and return newForm for each in it.
    const type = "images";
    const isVisible = props.state.images[props.index].visible;
    return (
        <Card className="image-form">
            <CardBody className="image-form-body">
                <FormGroup controlId="caption" bssize="small">
                    <FormLabel>Image Caption</FormLabel>
                    <FormControl
                    type="text"
                    value={props.state.images[props.index].caption}
                    onChange={(e) => props.handleImageChange(e, props.index)}
                    />
                </FormGroup>
                <FormGroup controlId="url" bssize="large">
                    <FormLabel>Image URL</FormLabel>
                    <FormControl
                    type="text"
                    value={props.state.images[props.index].url}
                    onChange={(e) => props.handleImageChange(e, props.index)}
                    />
                </FormGroup>
                <FormGroup>
                    <FormCheck onChange={(e) => props.handleVisible(e, props.index, type)} checked={isVisible} type="checkbox" label="Visible"/>
                </FormGroup>
                <Button variant="danger" onClick={(e) => props.handleDelete(e, props.index, type)} >Delete</Button>
            </CardBody>
        </Card>
    );
}