import React, { useState, useCallback, useEffect } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { dbService } from 'fbase';
import { storageService } from 'fbase';
import { deleteObject, ref } from 'firebase/storage';
import styled from 'styled-components';
import { RiDeleteBinLine, RiEditLine, RiCheckFill } from 'react-icons/ri';
import { MdClear } from 'react-icons/md';

const KweetBox = styled.article`
	border-bottom: 1px solid ${(props) => props.theme.border};
	padding: 20px;
`;

const UserBox = styled.div`
	display: flex;
	justify-content: flex-start;
	gap: 10px;

	img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		margin-right: 10px;
	}

	.userInfo {
		color: #666;
		padding-top: 10px;
		display: flex;
		flex-wrap: wrap;
		gap: 5px;

		p {
			font-weight: 700;
			color: ${(props) => props.theme.userName};
		}
	}

	@media screen and (max-width: 430px) {
		.userInfo {
			span {
				margin-bottom: 20px;
			}
		}
	}
`;

const KweetContent = styled.div`
	margin-left: 70px;
`;

const KweetImg = styled.img`
	width: 200px;
	height: 100%;

	@media screen and (max-width: 430px) {
		width: 150px;
	}
`;

const KweetText = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
	word-wrap: break-word;
	p {
		color: ${(props) => props.theme.text};
		height: 100%;
		line-height: 1.5;
		margin-bottom: 20px;
	}

	.btns {
		margin-top: 20px;
		display: flex;
		justify-content: flex-end;
		gap: 10px;

		button {
			width: 30px;
			height: 30px;
			font-size: 18px;
			color: ${(props) => props.theme.text};
			background: none;
			border: none;
			border-radius: 50%;
			cursor: pointer;
			transition: 0.5s;

			display: flex;
			justify-content: center;
			align-items: center;

			:hover {
				background: ${(props) => props.theme.hoverBg};

				border-radius: 50%;
			}
		}
	}
`;

const KweetEdit = styled.div`
	position: relative;

	textarea {
		width: 100%;
		line-height: 1.5;
		resize: none;
		outline: none;
		color: ${(props) => props.theme.text};
		background: ${(props) => props.theme.bg};
		border: 1px solid #999;
		border-radius: 10px;
		padding: 10px;
		margin-bottom: 20px;
	}

	label,
	button {
		font-size: 18px;
		color: ${(props) => props.theme.text};
		position: absolute;
		right: 40px;
		bottom: -5px;
		border-bottom: 2px solid transparent;
		cursor: pointer;
		transition: 0.5s;

		display: flex;
		justify-content: center;
		align-items: center;

		&:hover {
			color: rgb(29, 155, 240);
			border-bottom: 2px solid rgb(29, 155, 240);
		}
	}

	button {
		right: 5px;
		bottom: -5px;
		border: none;
		background: transparent;
		border-bottom: 2px solid transparent;
		padding: 0;
	}

	input {
		width: 1px;
		height: 1px;
		border: none;
		background: transparent;
		position: absolute;
		top: -9999px;
		left: -9999px;
	}
`;

const Kweet = ({ kweetObj, isOwner, newName, newAvatar }) => {
	const [editing, setEditing] = useState(false);
	const [newKweet, setNewKweet] = useState(kweetObj.text);

	const kweetTextRef = doc(dbService, 'kweets', `${kweetObj.id}`);

	const onDeleteClick = async () => {
		const confirmCheck = window.confirm('크윗을 삭제할까요?');
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

	const onSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			if (!newKweet) return alert('수정할 내용을 입력하세요.');

			await updateDoc(kweetTextRef, {
				text: newKweet.trim(),
			});
			setEditing(false);
		},
		[kweetTextRef, newKweet]
	);

	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setNewKweet(value);
	};

	useEffect(() => {
		let isMounted = true;
		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		updateDoc(kweetTextRef, {
			creatorName: newName ? newName : kweetObj?.creatorName,
			profileImg: newAvatar ? newAvatar : kweetObj?.profileImg,
			text: newKweet ? newKweet.trim() : kweetObj?.text,
		});
	}, [kweetTextRef]);

	return (
		<KweetBox>
			<UserBox>
				<img src={kweetObj?.profileImg} alt='userAvatar' />
				<div className='userInfo'>
					<p>{kweetObj.creatorName}</p>
					&middot;
					<span className='date'>{kweetObj.createdDate}</span>
				</div>
			</UserBox>

			<KweetContent>
				{editing ? (
					<KweetEdit>
						<form onSubmit={onSubmit}>
							<textarea
								cols='100'
								rows='5'
								value={newKweet}
								onChange={onChange}></textarea>

							<label htmlFor='submit'>
								<RiCheckFill />
							</label>
							<input id='submit' type='submit' value='확인' />
						</form>
						<button onClick={toggleEditing}>
							<MdClear />
						</button>
					</KweetEdit>
				) : (
					<KweetText>
						<p>{kweetObj.text}</p>

						{isOwner && (
							<div className='btns'>
								<button onClick={toggleEditing}>
									<RiEditLine />
								</button>
								<button onClick={onDeleteClick}>
									<RiDeleteBinLine />
								</button>
							</div>
						)}
					</KweetText>
				)}

				{kweetObj.attachmentUrl && (
					<KweetImg src={kweetObj.attachmentUrl} alt='uploaded img' />
				)}
			</KweetContent>
		</KweetBox>
	);
};

export default Kweet;
