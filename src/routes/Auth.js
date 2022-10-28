import React from 'react';
import AuthForm from '../components/AuthForm';
import {
	signInWithPopup,
	GoogleAuthProvider,
	GithubAuthProvider,
} from 'firebase/auth';
import { authService } from 'fbase';

const Auth = () => {
	const onSocialClick = async (e) => {
		const {
			target: { name },
		} = e;
		let provider;
		if (name === 'google') {
			provider = new GoogleAuthProvider();
		} else if (name === 'github') {
			provider = new GithubAuthProvider();
		}

		// 팝업 로그인
		const data = await signInWithPopup(authService, provider);
		console.log(data);
	};
	return (
		<div>
			<AuthForm />
			<div>
				<button name='google' onClick={onSocialClick}>
					Google 계정으로 계속하기
				</button>
				<button name='github' onClick={onSocialClick}>
					Github 계정으로 계속하기
				</button>
			</div>
		</div>
	);
};

export default Auth;
