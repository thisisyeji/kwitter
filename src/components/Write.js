import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { dbService } from 'fbase';

const Write = ({ userObj }) => {
	const [kweet, setKweet] = useState('');

	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setKweet(value);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		};
		let createdDate = new Date().toLocaleString('ko-KR', options);
		await addDoc(collection(dbService, 'kweets'), {
			text: kweet,
			createdAt: Date.now(),
			createdDate: createdDate,
			creatorId: userObj.uid,
			creatorName: userObj.displayName,
			profile: userObj.photoURL,
		});
		setKweet('');
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
