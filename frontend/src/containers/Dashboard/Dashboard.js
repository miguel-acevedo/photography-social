import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import axios from "axios";

export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuth: false,
            username: "",
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

    fetchUsername = () => {
        const token = localStorage.getItem('token');
        /*
        const token = JSON.parse(localStorage.getItem('token'));
        //console.log(token);
        const api = '/api/account/view_username/'
        axios.get(api, { headers: {"Authorization" : `Bearer ${token}`} })
                .then(res => {
                    console.log(res.data);
            });
        */
       const api = '/api/account/view_username/'
       axios.get(api, { headers: {"Authorization" : `Bearer ${token}`} })
               .then(res => {
                    this.setState({ username: res.data.username });
           });
    }

    componentDidUpdate(prevState) {
        if (this.state.isAuth != prevState.isAuth) {
            if (this.state.username == "")
                this.fetchUsername();
        }
    }

    render() {
        const status = this.state.isAuth ? "You are logged in" : "Not logged in";
        return(
            <div>
                <h1>Welcome to Dashboard</h1>
                <p>Welcome back, {this.state.username}</p>
                <p>{status}</p>
                <h2 onClick={this.handleLogout}>Logout</h2>
            </div>
        )
    }

}