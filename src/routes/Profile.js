import React, { useEffect, useState, useCallback, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { dbService, authService, storageService } from 'fbase';
import { updateProfile } from 'firebase/auth';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useHistory } from 'react-router-dom';
import {
	collection,
	query,
	where,
	orderBy,
	onSnapshot,
	// getDocs,
} from 'firebase/firestore';
import styled from 'styled-components';
import Kweet from 'components/Kweet';
import { TbCameraPlus } from 'react-icons/tb';
import { TiDelete } from 'react-icons/ti';

const Wrapper = styled.section`
	border-right: 1px solid ${(props) => props.theme.border};
	margin: 0 20vw 0 25vw;
	margin-top: 50px;

	@media screen and (max-width: 768px) {
		margin: 0;
		margin-top: 50px;
		margin-left: 60px;
	}
`;

const TotalKweets = styled.article`
	position: fixed;
	top: 0;
	width: 100%;
	height: 50px;
	color: ${(props) => props.theme.text};
	background: ${(props) => props.theme.total};
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

const UserProfile = styled.article`
	border-bottom: 1px solid ${(props) => props.theme.border};
	padding: 30px 50px;

	position: relative;

	img {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		margin-bottom: 20px;
	}

	h2 {
		color: ${(props) => props.theme.userName};
		font-size: 24px;
		letter-spacing: 1px;
		margin-left: 20px;
		margin-bottom: 10px;
	}

	p {
		color: #666;
		margin-left: 20px;
		margin-bottom: 15px;
	}

	p.email {
		font-size: 20px;
		margin-bottom: 30px;
	}

	.bio {
		margin-bottom: 50px;
		font-weight: 600;
	}

	.btns {
		position: absolute;
		top: 50px;
		right: 20px;

		display: flex;
		flex-direction: column;
		gap: 10px;

		button {
			color: ${(props) => props.theme.text};
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

	@media screen and (max-width: 430px) {
		padding: 30px;

		img {
			width: 100px;
			height: 100px;
		}

		h2 {
			font-size: 20px;
		}

		.btns {
			right: 10px;

			button {
				font-size: 14px;
				padding: 10px;
			}
		}
	}
`;

const EditForm = styled.form`
	position: relative;
	max-width: 500px;
	border: 1px solid #999;
	border-radius: 10px;
	padding: 20px;

	.title {
		font-size: 20px;
		font-weight: 700;
		color: ${(props) => props.theme.text};
	}

	input[type='submit'] {
		position: absolute;
		top: 20px;
		right: 20px;
		width: 80px;
		height: 40px;
		font-weight: 600;
		background: #999;
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

const Text = styled.div`
	label {
		font-size: 14px;
		color: #888;
		display: block;
		margin-bottom: 10px;
	}

	input {
		width: 70%;
		font-size: 20px;
		color: ${(props) => props.theme.text};
		background: ${(props) => props.theme.bg};
		outline: none;
		border: none;
		border-bottom: 2px solid #999;
		margin-bottom: 15px;
		margin-right: 10px;
		padding: 5px 10px;
	}

	@media screen and (max-width: 768px) {
		input {
			width: 90%;
			font-size: 16px;
		}
	}
`;

const Avatar = styled.div`
	display: flex;
	flex-wrap: wrap;

	.title {
		width: 100%;
		font-size: 14px;
		color: #888;
		margin: 0;
		margin-bottom: 10px;
	}

	.btn {
		width: 50px;
		height: 50px;
		background: #999;
		border-radius: 50%;
		margin-right: 20px;
		margin-bottom: 20px;

		display: flex;
		justify-content: center;
		align-items: center;

		label {
			font-size: 35px;
			color: #fff;
			cursor: pointer;
			margin: 0;

			display: flex;
			justify-content: center;
			align-items: center;
		}

		input {
			width: 1px;
			height: 1px;
			position: absolute;
			top: -9999px;
			left: -9999px;
		}
	}

	.newImg {
		width: 50px;
		height: 50px;
		position: relative;

		img {
			width: 100%;
			height: 100%;
		}

		button {
			position: absolute;
			top: -10px;
			right: -15px;
			background: none;
			border: none;
			color: #888;
			font-size: 22px;
			cursor: pointer;
		}
	}
`;

const Profile = ({ refreshUser, userObj }) => {
	const history = useHistory();
	const [myKweets, setMyKweets] = useState([]);
	const [newName, setNewName] = useState(userObj.displayName);
	const [edit, setEdit] = useState(false);
	const [loading, setLoading] = useState(false);
	const [newAvatar, setNewAvatar] = useState(userObj.photoURL);
	const [profile, setProfile] = useState();
	// const [myBio, setMyBio] = useState('');
	const avatarInput = useRef();

	const onLogOutClick = () => {
		const confirmCheck = window.confirm('크위터에서 로그아웃 할까요?');
		if (confirmCheck) {
			signOut(authService);
			history.push('/');
		}
	};

	const onChange = (e) => {
		const {
			target: { name, value },
		} = e;
		if (name === 'userName') {
			setNewName(value);
		}
		// else if (name === 'userBio') {
		// 	setMyBio(value);
		// }
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		let photoURL = userObj.photoURL;
		if (photoURL !== newAvatar) {
			const photoRef = ref(storageService, `${userObj.uid}/profile/photo`);
			const response = await uploadString(photoRef, newAvatar, 'data_url');
			photoURL = await getDownloadURL(response.ref);
		}

		if (userObj.displayName !== newName || userObj.photoURL !== newAvatar) {
			if (!newName) return alert('닉네임을 수정하세요.');

			await updateProfile(authService.currentUser, {
				displayName: newName,
				photoURL,
			});

			let profileInfo = {
				creatorName: newName,
				profileImg: newAvatar,
			};

			setNewAvatar(photoURL);
			setProfile(profileInfo);
			// console.log(profile);
			refreshUser();
		}

		setEdit(false);
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
			setNewAvatar(result);
		};
		reader.readAsDataURL(theFile);
	};

	const getMyKweets = useCallback(async () => {
		setLoading(true);

		const q = query(
			collection(dbService, 'kweets'),
			where('creatorId', '==', `${userObj.uid}`),
			orderBy('createdAt', 'desc')
		);
		onSnapshot(q, (snapshot) => {
			const kweetArray = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setMyKweets(kweetArray);
		});
		// if (q) {
		// 	const querySnapshot = await getDocs(q);
		// 	const kweetArray = querySnapshot.docs.map((doc) => ({
		// 		id: doc.id,
		// 		...doc.data(),
		// 	}));

		// 	setMyKweets(kweetArray);
		// }
	}, [userObj.uid]);

	const onClearAvatar = () => {
		setNewAvatar(userObj.photoURL);
		avatarInput.current.value = '';
	};

	useEffect(() => {
		getMyKweets();
		return () => {
			setLoading(false);
		};
	}, []);

	return (
		<Wrapper>
			<TotalKweets>
				<h1>프로필</h1> &middot; <span>{myKweets.length} 크윗</span>
			</TotalKweets>

			<UserProfile>
				<img src={userObj?.photoURL} alt='userAvatar' />
				{edit ? (
					<EditForm onSubmit={onSubmit}>
						<p className='title'>프로필</p>
						<Avatar>
							<div className='btn'>
								<label htmlFor='newAvatar'>
									<TbCameraPlus />
								</label>
								<input
									type='file'
									id='newAvatar'
									accept='image/*'
									onChange={onFileChange}
								/>
							</div>

							<div className='newImg'>
								<img src={newAvatar} alt='newAvatar' />
								<button onClick={onClearAvatar}>
									<TiDelete />
								</button>
							</div>
						</Avatar>

						<Text>
							<label htmlFor='userName'>닉네임</label>
							<input
								id='userName'
								name='userName'
								type='text'
								placeholder={userObj.displayName}
								value={newName}
								onChange={onChange}
								ref={avatarInput}
								maxLength={15}
							/>
							{/*  
							<label htmlFor='userBio'>바이오</label>
							<input
								id='userBio'
								name='userBio'
								type='text'
								placeholder={myBio}
								value={myBio}
								onChange={onChange}
								maxLength={50}
							/>
							*/}
						</Text>

						<input type='submit' value='저장' />
					</EditForm>
				) : (
					<>
						<h2>{newName}</h2>
						<p className='email'>@{userObj.email.split('@')[0]}</p>
						{/* <p className='bio'>{myBio}</p> */}
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
							newAvatar={profile?.profileImg}
							newName={profile?.creatorName}
						/>
					))}
			</>
		</Wrapper>
	);
};

export default Profile;
