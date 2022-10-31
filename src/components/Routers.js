import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Home from 'routes/Home';
import Auth from 'routes/Auth';
import Profile from 'routes/Profile';
import Navigation from './Navigation';

const Routers = ({ refreshUser, isLoggedIn, userObj }) => {
	return (
		<Router>
			<Switch>
				{isLoggedIn ? (
					<>
						<Navigation />
						<Route exact path='/' render={() => <Home userObj={userObj} />} />
						<Route
							exact
							path='/profile'
							render={() => (
								<Profile userObj={userObj} refreshUser={refreshUser} />
							)}
						/>
					</>
				) : (
					<Route exact path='/' component={Auth} />
				)}
			</Switch>
		</Router>
	);
};

export default Routers;
