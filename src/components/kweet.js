import React, { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { dbService } from 'fbase';
import { storageService } from 'fbase';
import { deleteObject, ref } from 'firebase/storage';

const Kweet = ({ kweetObj, isOwner }) => {
	const [editing, setEditing] = useState(false);
	const [newKweet, setNewKweet] = useState(kweetObj.text);

	const kweetTextRef = doc(dbService, 'kweets', `${kweetObj.id}`);

	const onDeleteClick = async () => {
		const confirmCheck = window.confirm('트윗을 삭제할까요?');
		if (confirmCheck) {
			await deleteDoc(kweetTextRef);
			if (kweetObj.attachmentUrl) {
				await deleteObject(ref(storageService, kweetObj.attachmentUrl));
			}
		}
	};

	const toggleEditing = () => {
		setEditing((prev) => !prev);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (!newKweet) return alert('수정할 내용을 입력하세요.');

		await updateDoc(kweetTextRef, {
			text: newKweet,
		});
		setEditing(false);
	};

	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setNewKweet(value);
	};

	return (
		<div>
			{editing ? (
				<>
					<form onSubmit={onSubmit}>
						<input type='text' value={newKweet} onChange={onChange} />
						<input type='submit' value='확인' />
					</form>
					<button onClick={toggleEditing}>취소</button>
				</>
			) : (
				<>
					{kweetObj.attachmentUrl && (
						<img
							src={kweetObj.attachmentUrl}
							alt='uploaded img'
							width='200px'
							height='200px'
						/>
					)}
					<h4>{kweetObj.text}</h4>

					<img src={kweetObj.profileImg} alt='userImage' />
					<p>{kweetObj.creatorName}</p>
					<span>{kweetObj.createdDate}</span>

					{isOwner && (
						<div>
							<button onClick={toggleEditing}>수정하기</button>
							<button onClick={onDeleteClick}>삭제하기</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Kweet;
