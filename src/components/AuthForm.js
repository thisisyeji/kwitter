import React, { useState } from 'react';
import { authService } from 'fbase';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth';

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
			console.log(error);
			if (error) {
				const errorValue = authError[error];
				setError(errorValue);
			}
		}
	};

	const toggleAccount = () => setNewMember((prev) => !prev);

	return (
		<>
			<form onSubmit={onSubmit}>
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
						placeholder='비밀번호를 재 입력하세요'
						required
						onChange={onChange}
					/>
				)}
				<button type='submit'>{newMember ? '가입하기' : '로그인'}</button>
				<p>{error}</p>
			</form>
			<div>
				<span>
					{newMember ? '이미 크위터에 가입하셨나요?' : '계정이 없으신가요?'}
				</span>
				<span onClick={toggleAccount}>{newMember ? '로그인' : '가입하기'}</span>
			</div>
		</>
	);
};

export default AuthForm;
