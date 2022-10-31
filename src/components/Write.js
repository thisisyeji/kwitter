import React, { useState, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { dbService, storageService } from 'fbase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { IoImageOutline } from 'react-icons/io5';
import { TiDelete } from 'react-icons/ti';
import styled from 'styled-components';

const WriteBox = styled.section`
	display: flex;
	border-bottom: 1px solid #efefef;
	padding: 20px;
	padding-top: 0;
`;

const UserImg = styled.img`
	width: 50px;
	height: 50px;
	border-radius: 50%;
	margin-right: 20px;
`;

const WriteText = styled.textarea`
	width: 100%;
	max-width: 500px;
	min-height: 100px;
	font-size: 20px;
	resize: none;
	outline: none;
	border: none;
	border-bottom: 1px solid #efefef;
	margin-bottom: 20px;
	padding: 10px;
`;

const FileLabel = styled.label`
	font-size: 20px;
	cursor: pointer;
	color: rgb(29, 155, 240);
	padding: 10px;
	position: relative;

	::after {
		content: '';
		display: block;
		clear: both;
		width: 35px;
		height: 35px;
		background: transparent;
		border-radius: 50%;
		transition: 0.5s;

		position: absolute;
		top: 2.5px;
		left: 2.5px;
	}

	&:hover {
		::after {
			background: rgba(29, 155, 240, 0.1);
		}
	}
`;

const Btns = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const FileInput = styled.input`
	width: 1px;
	height: 1px;
	color: transparent;
`;

const SubmitInput = styled.input`
	font-size: 16px;
	font-weight: 600;
	border: none;
	border-radius: 30px;
	padding: 10px 20px;
	cursor: pointer;
	transition: 0.5s;

	&:disabled {
		color: none;
		background: none;
		border: 1px solid #cfcfcf;
	}

	&:enabled {
		color: #fff;
		background: rgb(29, 155, 240);
		border: 1px solid none;
	}

	&:hover {
		background: rgb(29, 134, 201);
		color: #fff;
	}
`;

const AttachmentBox = styled.div`
	border-bottom: 1px solid #efefef;
	margin-bottom: 15px;
	position: relative;

	img {
		width: 100px;
		height: auto;
	}

	button {
		position: absolute;
		top: 0;
		background: none;
		border: none;
		cursor: pointer;

		svg {
			width: 25px;
			height: 25px;
			color: #777;
		}
	}
`;

const Write = ({ userObj }) => {
	const [kweet, setKweet] = useState('');
	const [active, setActive] = useState('');
	const [attachment, setAttachment] = useState('');
	const fileInput = useRef();

	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setKweet(value.trim());
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
		<WriteBox>
			<UserImg src={userObj?.photoURL} alt='userImage' />
			<form onSubmit={onSubmit}>
				<WriteText
					cols='100'
					rows='5'
					placeholder='무슨 일이 일어나고 있나요?'
					value={kweet}
					onChange={onChange}></WriteText>

				{attachment && (
					<AttachmentBox>
						<img src={attachment} alt='attachment' />
						<button onClick={onClearAttachment}>
							<TiDelete />
						</button>
					</AttachmentBox>
				)}

				<Btns>
					<FileLabel htmlFor='file'>
						<IoImageOutline />
					</FileLabel>
					<FileInput
						id='file'
						type='file'
						accept='image/*'
						onChange={onFileChange}
						ref={fileInput}
					/>
					<SubmitInput type='submit' value='크윗하기' disabled={!active} />
				</Btns>
			</form>
		</WriteBox>
	);
};

export default Write;
