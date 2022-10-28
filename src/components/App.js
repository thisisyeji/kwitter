import Routers from 'components/Routers';
import React, { useState, useEffect } from 'react';
import { authService } from 'fbase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userObj, setUserObj] = useState(null);

	useEffect(() => {
		onAuthStateChanged(authService, (user) => {
			if (user) {
				setIsLoggedIn(true);
				// displayName 받아올 수 있도록 수정
				if (user.displayName === null) {
					const name = user.email.split('@')[0];
					user.displayName = name;
				}
				setUserObj(user);
			} else {
				setIsLoggedIn(false);
			}
			setInit(true);
		});
	}, []);

	return (
		<>
			{init ? (
				<Routers isLoggedIn={isLoggedIn} userObj={userObj} />
			) : (
				'Initializing...'
			)}
			<footer></footer>
		</>
	);
}

export default App;
