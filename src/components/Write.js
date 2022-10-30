import React, { useState, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { dbService, storageService } from 'fbase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const Write = ({ userObj }) => {
	const [kweet, setKweet] = useState('');
	const [active, setActive] = useState('');
	const [attachment, setAttachment] = useState('');
	const fileInput = useRef();

	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setKweet(value);
		setActive(value);
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		let attachmentUrl = '';
		if (attachment !== '') {
			const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
			const response = await uploadString(
				attachmentRef,
				attachment,
				'data_url'
			);
			attachmentUrl = await getDownloadURL(response.ref);
		}

		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		};

		let createdDate = new Date().toLocaleString('ko-KR', options);

		const kweetObj = {
			text: kweet,
			createdAt: Date.now(),
			createdDate: createdDate,
			creatorId: userObj.uid,
			creatorName: userObj.displayName,
			profileImg: userObj.photoURL,
			attachmentUrl,
		};

		await addDoc(collection(dbService, 'kweets'), kweetObj);
		setKweet('');
		setActive('');
		setAttachment('');
		fileInput.current.value = '';
	};

	const onFileChange = (e) => {
		const {
			target: { files },
		} = e;
		const theFile = files[0];
		const reader = new FileReader();
		reader.onloadend = (finishedEvent) => {
			const {
				currentTarget: { result },
			} = finishedEvent;
			setAttachment(result);
		};
		reader.readAsDataURL(theFile);
	};

	const onClearAttachment = () => {
		setAttachment('');
		fileInput.current.value = '';
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
			<input
				type='file'
				accept='image/*'
				onChange={onFileChange}
				ref={fileInput}
			/>
			<input type='submit' value='크윗하기' disabled={!active} />
			{attachment && (
				<div>
					<img src={attachment} alt='attachment' width='50px' height='50px' />
					<button onClick={onClearAttachment}>X</button>
				</div>
			)}
		</form>
	);
};

export default Write;
