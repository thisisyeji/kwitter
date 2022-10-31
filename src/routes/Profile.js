import React, { useEffect, useState, useCallback } from 'react';
import { signOut } from 'firebase/auth';
import { authService } from 'fbase';
import { updateProfile } from 'firebase/auth';
import { useHistory } from 'react-router-dom';
import { dbService } from 'fbase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import styled from 'styled-components';
import Kweet from '../components/Kweet';

const Wrapper = styled.section`
	border-right: 1px solid #efefef;
	margin: 0 20vw 0 30vw;
	margin-top: 50px;
`;

const TotalKweets = styled.div`
	position: fixed;
	top: 0;
	width: 100%;
	height: 50px;
	background-color: rgba(255, 255, 255, 0.9);
	z-index: 2;
	padding-left: 20px;

	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: 10px;

	h1 {
		font-size: 22px;
		font-weight: 800;
	}

	span {
		margin: 5px;
		color: #777;
	}
`;

const UserProfile = styled.div`
	border-bottom: 1px solid #efefef;
	padding: 30px 50px;

	position: relative;

	img {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		margin-bottom: 20px;
	}

	h2 {
		font-size: 24px;
		letter-spacing: 1px;
		margin-bottom: 20px;
	}

	p {
		color: #555;
		margin-left: 10px;
		margin-bottom: 15px;
	}

	.btns {
		position: absolute;
		top: 30px;
		right: 10px;

		display: flex;
		flex-direction: column;
		gap: 10px;

		button {
			font-size: 16px;
			font-weight: 700;
			border: 1px solid #d8d8d8;
			border-radius: 30px;
			background: none;
			padding: 10px 15px;
			cursor: pointer;
			transition: 0.5s;

			&:hover {
				background-color: #efefef;
				color: rgb(29, 155, 240);
			}
		}
	}
`;

const EditForm = styled.form`
	border: 1px solid #e4e4e4;
	border-radius: 10px;
	padding: 20px;

	label {
		font-size: 14px;
		color: #888;
		display: block;
		margin-bottom: 10px;
	}

	input#edit {
		width: 70%;
		font-size: 24px;
		outline: none;
		border: none;
		border-bottom: 2px solid #999;
		margin-bottom: 15px;
		margin-right: 10px;
		padding: 5px 10px;
	}

	input[type='submit'] {
		font-weight: 600;
		background: #333;
		color: #fff;
		border: none;
		border-radius: 20px;
		cursor: pointer;
		transition: 0.5s;
		padding: 10px 20px;

		&:hover {
			background: rgb(29, 155, 240);
		}
	}
`;

const Profile = ({ refreshUser, userObj }) => {
	const history = useHistory();
	const [myKweets, setMyKweets] = useState([]);
	const [newName, setNewName] = useState(userObj.displayName);
	const [edit, setEdit] = useState(false);

	const onLogOutClick = () => {
		const confirmCheck = window.confirm('크위터에서 로그아웃 할까요?');
		if (confirmCheck) {
			signOut(authService);
			history.push('/');
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (userObj.displayName !== newName) {
			if (!newName) return alert('닉네임을 수정하세요.');

			await updateProfile(authService.currentUser, {
				displayName: newName,
			});
			refreshUser();
		}
		setEdit(false);
	};

	const onChange = (e) => {
		const {
			target: { value },
		} = e;

		setNewName(value);
	};

	const getMyNweets = useCallback(async () => {
		const q = query(
			collection(dbService, 'kweets'),
			where('creatorId', '==', `${userObj.uid}`),
			orderBy('createdAt', 'desc')
		);

		const querySnapshot = await getDocs(q);
		const kweetArray = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		setMyKweets(kweetArray);
	}, [userObj.uid]);

	useEffect(() => {
		let isMounted = true;
		getMyNweets();

		return () => {
			isMounted = false;
		};
	}, [getMyNweets]);

	return (
		<Wrapper>
			<TotalKweets>
				<h1>프로필</h1> &middot; <span>{myKweets.length} 크윗</span>
			</TotalKweets>

			<UserProfile>
				<img src={userObj.photoURL} alt='userProfileImage' />
				{edit ? (
					<EditForm onSubmit={onSubmit}>
						<label htmlFor='edit'>닉네임</label>
						<input
							id='edit'
							type='text'
							placeholder={userObj.displayName}
							value={newName}
							onChange={onChange}
						/>

						<input type='submit' value='저장' />
					</EditForm>
				) : (
					<>
						<h2>@{newName}</h2>
						<p>{userObj.email}</p>
						<p>
							<strong>{myKweets.length}</strong> 크윗
						</p>
						<div className='btns'>
							<button onClick={() => setEdit(true)}>프로필 수정</button>
							<button onClick={onLogOutClick}>로그아웃</button>
						</div>
					</>
				)}
			</UserProfile>
			<>
				{myKweets &&
					myKweets.map((kweet) => (
						<Kweet
							key={kweet.id}
							kweetObj={kweet}
							isOwner={kweet.creatorId === userObj.uid}
						/>
					))}
			</>
		</Wrapper>
	);
};

export default Profile;
