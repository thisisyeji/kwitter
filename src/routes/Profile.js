import React, { useEffect, useState, useCallback } from 'react';
import { signOut } from 'firebase/auth';
import { authService } from 'fbase';
import { useHistory } from 'react-router-dom';
import { dbService } from 'fbase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import styled from 'styled-components';
import Kweet from '../components/Kweet';

const Wrapper = styled.section`
	margin-top: 50px;
	margin-left: 30vw;
`;

const Profile = ({ userObj }) => {
	const history = useHistory();
	const [myKweets, setMyKweets] = useState([]);

	const onLogOutClick = () => {
		signOut(authService);
		history.push('/');
	};

	const getMyNweets = useCallback(async () => {
		const q = query(
			collection(dbService, 'kweets'),
			where('creatorId', '==', `${userObj.uid}`),
			orderBy('createdAt', 'desc')
		);

		const querySnapshot = await getDocs(q);
		const kweetArray = querySnapshot.docs.map((doc) => ({
			...doc.data(),
		}));
		setMyKweets(kweetArray);
	}, [userObj.uid]);

	useEffect(() => {
		getMyNweets();
	}, [getMyNweets]);

	return (
		<Wrapper>
			<button onClick={onLogOutClick}>로그아웃</button>
			{myKweets &&
				myKweets.map((kweet, idx) => (
					<Kweet
						key={idx}
						kweetObj={kweet}
						isOwner={kweet.creatorId === userObj.uid}
					/>
				))}
		</Wrapper>
	);
};

export default Profile;
