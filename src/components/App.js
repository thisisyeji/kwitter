import Routers from 'components/Routers';
import React, { useState } from 'react';
import { authService } from 'fbase';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
	return (
		<>
			<Routers isLoggedIn={isLoggedIn} />
			<footer></footer>
		</>
	);
}

export default App;
