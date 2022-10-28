import React, { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { dbService } from 'fbase';

const Kweet = ({ kweetObj, isOwner }) => {
	const [editing, setEditing] = useState(false);
	const [newKweet, setNewKweet] = useState(kweetObj.text);

	const kweetRef = doc(dbService, 'kweets', `${kweetObj.id}`);

	const onDeleteClick = async () => {
		const confirmCheck = window.confirm('트윗을 삭제할까요?');
		if (confirmCheck) {
			await deleteDoc(kweetRef);
		}
	};

	const toggleEditing = () => {
		setEditing((prev) => !prev);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (!newKweet) return alert('수정할 내용을 입력하세요.');

		await updateDoc(kweetRef, {
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
			<img src={kweetObj.profileImg} alt='userImage' />
			{editing ? (
				<>
					<form onSubmit={onSubmit}>
						<input type='text' value={newKweet} onChange={onChange} />
						<input type='submit' value='확인' />
					</form>
					<button onClick={toggleEditing}>취소</button>
				</>
			) : (
				<h4>{kweetObj.text}</h4>
			)}

			{isOwner && (
				<div>
					<button onClick={onDeleteClick}>삭제하기</button>
					<button onClick={toggleEditing}>수정하기</button>
				</div>
			)}

			<p>{kweetObj.creatorName}</p>
			<span>{kweetObj.createdDate}</span>
		</div>
	);
};

export default Kweet;
