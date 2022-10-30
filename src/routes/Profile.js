import React from 'react';
import { signOut } from 'firebase/auth';
import { authService } from 'fbase';
import { useHistory } from 'react-router-dom';
import { dbService } from 'fbase';
import {
	collection,
	query,
	where,
	onSnapshot,
	getDoc,
} from 'firebase/firestore';
import styled from 'styled-components';

const Wrapper = styled.section`
	margin-top: 50px;
	margin-left: 30vw;
`;

const Profile = () => {
	const history = useHistory();

	// const q = query(collection(dbService, 'kweets').where(user.uid));

	const onLogOutClick = () => {
		signOut(authService);
		history.push('/');
	};
	return (
		<Wrapper>
			<button onClick={onLogOutClick}>로그아웃</button>
		</Wrapper>
	);
};

export default Profile;
