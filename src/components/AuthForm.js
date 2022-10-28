import React, { useState } from 'react';

const AuthForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [password2, setPassword2] = useState('');
	const [newMember, setNewMember] = useState(false);

	const onChange = (e) => {
		const {
			target: { name, value },
		} = e;
		if (name === 'email') {
			setEmail(value);
		} else if (name === 'password') {
			setPassword(value);
		} else if (name === 'password2') {
			setPassword2(value);
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		// try {
		// let data;
		// if(newMember) {
		// data = await createUserWithEmailAndPassword(

		//   )
		// }
		// }
	};

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
			</form>
			<p>{newMember ? '이미 크위터에 가입하셨나요?' : '계정이 없으신가요?'}</p>
			<span>{newMember ? '로그인' : '가입하기'}</span>
		</>
	);
};

export default AuthForm;
