import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../routes/Home';
import Auth from '../routes/Auth';
import Profile from '../routes/Profile';

const Routers = ({ isLoggedIn }) => {
	return (
		<Router>
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
