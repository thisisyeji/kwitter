import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../routes/Home';
import Auth from '../routes/Auth';
import Profile from '../routes/Profile';
import Navigation from './Navigation';

const Routers = ({ isLoggedIn }) => {
	return (
		<Router>
			{isLoggedIn && <Navigation />}
			<Switch>
				{isLoggedIn ? (
					<>
						<Route exact path='/' component={Home} />
						<Route exact path='/profile' component={Profile} />
					</>
				) : (
					<Route exact path='/' component={Auth} />
				)}
			</Switch>
		</Router>
	);
};

export default Routers;
