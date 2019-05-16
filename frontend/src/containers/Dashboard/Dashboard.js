import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import axios from "axios";

export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuth: false,
        };
    }

    redirectLogin = () => {
        this.props.history.push({
            pathname: '/login',
          })
    }

    handleLogout = () => {
        localStorage.clear();
        this.redirectLogin();
    }

    checkAuth = () => {
        if (localStorage.getItem('token') != undefined) {
            this.setState({ isAuth: true });
        } else {
            this.redirectLogin();
        }
    }

    componentDidMount() {
        this.checkAuth();
    }

    render() {
        const status = this.state.isAuth ? "You are logged in" : "Not logged in";
        return(
            <div>
                <h1>Welcome to Dashboard</h1>
                <p>{status}</p>
                <h2 onClick={this.handleLogout}>Logout</h2>
            </div>
        )
    }

}