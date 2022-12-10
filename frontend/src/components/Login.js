import React from 'react'

import { GoogleLogin } from '@react-oauth/google';
import jwt_decode  from 'jwt-decode';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

function Login({setUser}) {

	const onSuccess = res => {
		let tokenData = jwt_decode(res.credential);
		let loginData = {
			googleId: tokenData.sub,
			...tokenData
		}
		setUser(loginData);
		localStorage.setItem("login", JSON.stringify(loginData));

		// console.log('login successful')
	};

	const onFailure = res => console.log('Login failed:', res)

	return <div>
		<GoogleLogin
			clientId={clientId}
			buttonTest={'login'}
			onSuccess={onSuccess}
			onFailure={onFailure}
			cookiePolicy={'single_host_origin'}
			style={{marginTop: '100px'}}
			isSignedIn={true}
		/>
	</div>
}

export default Login