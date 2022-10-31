import React from 'react';
import AuthForm from '../components/AuthForm';
import {
	signInWithPopup,
	GoogleAuthProvider,
	GithubAuthProvider,
} from 'firebase/auth';
import { authService } from 'fbase';
import { FaTwitter } from 'react-icons/fa';
import styled from 'styled-components';

const AuthWrap = styled.section`
	width: 100vw;
	height: 100vh;

	display: flex;
	justify-content: center;
	align-items: center;

	.left {
		width: 50%;
		height: 100%;
		color: #fff;
		font-size: 10rem;
		background: rgb(29, 155, 240);

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.right {
		width: 50%;
		height: 100%;
		margin: 0 50px;

		display: flex;
		flex-direction: column;
		justify-content: center;

		h1 {
			font-size: 4vw;
			font-weight: 700;
			margin-bottom: 30px;
		}

		.accounts {
			max-width: 500px;
			margin-top: 30px;

			display: flex;
			flex-direction: column;
			gap: 10px;

			button {
				border: 1px solid #efefef;
				border-radius: 30px;
				background: none;
				padding: 10px;
				cursor: pointer;
				transition: 0.5s;

				&:hover {
					border: 1px solid rgb(29, 155, 240);
					color: rgb(29, 155, 240);
				}
			}
		}
	}
`;

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
		<AuthWrap>
			<div className='left'>
				<FaTwitter />
			</div>

			<div className='right'>
				<h1>크위터에 로그인 하기</h1>

				<AuthForm />

				<div className='accounts'>
					<button name='google' onClick={onSocialClick}>
						Google 계정으로 계속하기
					</button>
					<button name='github' onClick={onSocialClick}>
						Github 계정으로 계속하기
					</button>
				</div>
			</div>
		</AuthWrap>
	);
};

export default Auth;
