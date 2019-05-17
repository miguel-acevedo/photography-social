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

    handleRedirect = (url) => {
        this.props.history.push({
            pathname: url,
          })
    }

    render() {
        const authMethod = (this.state.type === "login") ? 
        <Login handler = {this.handler} redirect={this.handleRedirect} /> : <Register handler = {this.handler} redirect={this.handleRedirect} />;
        return (
            authMethod
        );
    }
}