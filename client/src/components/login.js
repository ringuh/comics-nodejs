import React from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    responseGoogle = (response) => {
        const Authenticate = async (google) => {
            this.setState({ progress: true })
            let res = await axios.post('/auth', google);
            if(res.data.jwt) localStorage.setItem("jwt", res.data.jwt)
            
            window.location.reload();
        };

        Authenticate(response)
    }
    render() {
        return (
            <GoogleLogin
                clientId={global.config.google_oauth.id}
                buttonText="Login"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
        )
    }
}

export default Login;