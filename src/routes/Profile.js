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

const Profile = () => {
	const history = useHistory();

	// const q = query(collection(dbService, 'kweets').where(user.uid));

	const onLogOutClick = () => {
		signOut(authService);
		history.push('/');
	};
	return (
		<>
			<button onClick={onLogOutClick}>로그아웃</button>
		</>
	);
};

export default Profile;
