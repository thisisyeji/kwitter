import React from 'react';
import AuthForm from '../components/AuthForm';

const Auth = () => {
	return (
		<div>
			<AuthForm />
			<button name='google'>Google 계정으로 계속하기</button>
			<button name='github'>Github 계정으로 계속하기</button>
		</div>
	);
};

export default Auth;
