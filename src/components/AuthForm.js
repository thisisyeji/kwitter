import React, { useState } from 'react';
import { authService } from 'fbase';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import styled from 'styled-components';

const FormBox = styled.form`
	max-width: 500px;
	display: flex;
	flex-direction: column;
	gap: 5px;

	input {
		padding: 10px;
		outline: none;

		&:focus {
			border: 2px solid rgb(29, 155, 240);
		}
	}

	input[type='submit'] {
		font-size: 18px;
		font-weight: 600;
		margin: 15px 0 40px;
		border: 1px solid rgb(29, 155, 240);
		border-radius: 30px;
		background: rgb(29, 155, 240);
		color: #fff;
		cursor: pointer;
		transition: 0.5s;

		&:hover {
			box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
		}
	}

	.error {
		font-size: 14px;
		font-weight: 600;
		color: hotpink;
		margin-top: 5px;
	}
`;

const ToggleBox = styled.div`
	max-width: 500px;
	color: #777;
	text-align: center;

	.toggle {
		color: rgb(29, 155, 240);
		font-weight: 700;
		border-bottom: 2px solid transparent;
		margin-left: 10px;
		margin-bottom: 20px;
		cursor: pointer;
		transition: 0.5s;

		&:hover {
			border-bottom: 2px solid rgb(29, 155, 240);
		}
	}
`;

const AuthForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [password2, setPassword2] = useState('');
	const [error, setError] = useState('');
	const [newMember, setNewMember] = useState(false);

	const authError = {
		'auth/weak-password': '비밀번호를 6글자 이상 입력하세요.',
		'auth/email-already-in-use': '이미 가입된 이메일입니다.',
		'auth/invalid-email': '유효하지 않은 이메일입니다.',
		'auth/wrong-password': '잘못된 비밀번호 입니다.',
		'auth/user-not-found': '해당 계정을 찾을 수 없습니다.',
	};

	const onChange = (e) => {
		const {
			target: { name, value },
		} = e;
		if (name === 'email') {
			setEmail(value.trim());
		} else if (name === 'password') {
			setPassword(value.trim());
		} else if (name === 'password2') {
			setPassword2(value.trim());
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (newMember) {
			if (!password2 || password !== password2)
				return setError('비밀번호를 동일하게 입력하세요.');
		}

		try {
			let data;
			if (newMember) {
				// create account
				data = await createUserWithEmailAndPassword(
					authService,
					email,
					password
				);
			} else {
				// log in
				data = await signInWithEmailAndPassword(authService, email, password);
			}
			console.log(data);
		} catch (e) {
			const error = e.code;
			if (error) {
				const errorValue = authError[error];
				setError(errorValue);
			}
		}
	};

	const toggleAccount = () => {
		setNewMember((prev) => !prev);
		setEmail('');
		setPassword('');
		setPassword2('');
		setError('');
	};

	return (
		<>
			<FormBox onSubmit={onSubmit}>
				<input
					type='email'
					name='email'
					value={email}
					placeholder='이메일을 입력하세요'
					required
					onChange={onChange}
				/>
				<input
					type='password'
					name='password'
					value={password}
					placeholder='비밀번호를 입력하세요'
					required
					onChange={onChange}
				/>
				{newMember && (
					<input
						type='password'
						name='password2'
						value={password2}
						placeholder='비밀번호를 재입력하세요'
						required
						onChange={onChange}
					/>
				)}
				<p className='error'>{error}</p>
				<input type='submit' value={newMember ? '가입하기' : '로그인'} />
			</FormBox>

			<ToggleBox>
				<span>
					{newMember ? '이미 크위터에 가입하셨나요?' : '계정이 없으신가요?'}
				</span>
				<span className='toggle' onClick={toggleAccount}>
					{newMember ? '로그인' : '가입하기'}
				</span>
			</ToggleBox>
		</>
	);
};

export default AuthForm;
