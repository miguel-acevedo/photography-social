import React, { Component } from 'react';
import axios from "axios";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import PortfolioForm from '../PortfolioForm/PortfolioForm';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        // window.dashboard = this;
        this.state = {
            isAuth: false,
            username: "",
            portfolio: null,
        };
    }

    redirect = (url) => {
        this.props.history.push({
            pathname: url,
          })
    }

    handleLogout = () => {
        localStorage.clear();
        this.setState({ isAuth: false });
        this.redirect("/login");
    }

    // Change this function to also check if the token is valid on top of checking if
    // it exists in local storage.
    checkAuth = () => {
        if (localStorage.getItem('token') != undefined) {

            const token = localStorage.getItem('token');
            const api = '/api/auth/validate/';
            axios.get(api, { headers: {"Authorization": `Bearer ${token}`} })
                .then(res => {
                    if (!this.state.isAuth)
                        this.setState({ isAuth: true });
                }, error => {
                    if (error.response.status === 401) {
                        localStorage.clear();
                        this.setState({ isAuth: false });
                        this.redirect("/login");
                   }
                });
        } else {
            this.setState({ isAuth: false });
            this.redirect("/login");
        }
    }

    fetchPortfolio = () => {
        const token = localStorage.getItem('token');
        const api = '/api/portfolio/fetch_portfolios/';
        axios.get(api, { headers: {"Authorization": `Bearer ${token}`} })
            .then(res => {
                this.setState({ portfolio: res.data.data });
                console.log("test portfolio");
            }, error => {
                //console.log(error);
            });
    }

    fetchTest = () => {
        const token = localStorage.getItem('token');
        const api = '/api/portfolio/fetch_portfolios/'
        axios.get(api, { headers: {"Authorization" : `Bearer ${token}`} })
                .then(res => {
                     this.setState({ test: "testing" });
                     console.log("test new fetch");
                }, error => {
                   if (error.response.status === 401) {
                        localStorage.clear();
                        //this.setState({ isAuth: false });
                        this.redirect("/login");
                }
            });
    }

    componentDidMount() {
        this.checkAuth();
        //this.fetchTest();
        this.fetchPortfolio();
        this.fetchUsername();
    }

    fetchUsername = () => {
        const token = localStorage.getItem('token');
        const api = '/api/account/view_username/'
        axios.get(api, { headers: {"Authorization" : `Bearer ${token}`} })
                .then(res => {
                     this.setState({ username: res.data.username });
                     console.log("test");
                }, error => {
                   if (error.response.status === 401) {
                        localStorage.clear();
                        //this.setState({ isAuth: false });
                        this.redirect("/login");
                }
            });
    }

    componentDidUpdate(prevState) {
        if (this.state.isAuth != prevState.isAuth) {
            //if (this.state.test == "")
            //    this.fetchTest();
            //if (this.state.portfolio == "") {
            //    this.fetchPortfolio();
            //if (this.state.username == "")
            //    this.fetchUsername();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isAuth) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        const status = this.state.isAuth ? "You are logged in" : "Not logged in";
        if (this.state.isAuth) {
            return(
                <div className="container">
                    <h1>Welcome to Dashboard</h1>
                    <p>Welcome back, {this.state.username}</p>
                    <p>{status}</p>
                    <h2 onClick={this.handleLogout}>Logout</h2>
                    <DisplayPortfolio portfolio={this.state.portfolio} />
                </div>
            )
        } else {
            return null
        }
    }

}

const CreateFormImageGroups = ({props}) => {
    const data = props;
    return (
        <FormGroup controlId={data.id} bssize="large">
            <FormLabel>{data.caption}</FormLabel>
            <FormControl
              type="text"
              value={data.url}
            />
        </FormGroup>
    );
}

const CreateForm = ({props}) => {
    const data = props
    console.log(data);
    const imageGroups = Object.keys(data.images).map(key => 
        <CreateFormImageGroups props={data.images[key]} />
    )
    return (
        <div className="card">
            <h3>{data.title}</h3>
            <form>
                {imageGroups}
            </form>
        </div>
    );
}

const DisplayPortfolio = (props) => {
    const port = props.portfolio;
    let forms = null;

    if (port!= null) {

        // The CreateForm should be calling a class which contains the whole form operations.
        forms = Object.keys(port).map(key => 
            //<CreateForm key={key} props={port[key]}/> 
            <PortfolioForm key={key} data={port[key]} />
        )

        return(
            <div>
                <h2>Portfolios</h2>
                {forms}
            </div>
        );        
    } else {
        return null;
    }
}