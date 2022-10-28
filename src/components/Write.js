import React, { useState } from 'react';

const Write = () => {
	const [kweet, setKweet] = useState('');

	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setKweet(value);
	};
	const onSubmit = (e) => {
		e.preventDefault();
	};
	return (
		<form onSubmit={onSubmit}>
			<input
				type='text'
				placeholder='무슨 일이 일어나고 있나요?'
				maxLength={120}
				value={kweet}
				onChange={onChange}
			/>
			<input type='submit' value='크윗하기' />
		</form>
	);
};

export default Write;
