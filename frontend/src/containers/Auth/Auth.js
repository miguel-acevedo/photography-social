import React, { Component } from 'react';
import Login from '../Login/Login';
import Register from '../Register/Register';
export default class Auth extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          type: "login",
        };

        this.handler = this.handler.bind(this);
    }

    handler(form) {
        this.setState({
          type: form,
        })
        console.log(form);
    }

    render() {
        const authMethod = (this.state.type === "login") ? <Login handler = {this.handler} /> : <Register handler = {this.handler} />;
        return (
            authMethod
        );
    }
}