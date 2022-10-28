import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTwitter } from 'react-icons/fa';
import { BsPerson } from 'react-icons/bs';

const Navigation = () => {
	const activeStyle = {
		color: 'hotpink',
		bacgroundColor: '#333',
		border: '1px solid #333',
		borderRadius: '50%',
	};
	return (
		<nav>
			<ul>
				<li>
					<NavLink exact to='/' activeStyle={activeStyle}>
						<FaTwitter />
					</NavLink>
				</li>

				<li>
					<NavLink to='/profile' activeStyle={activeStyle}>
						<BsPerson />
					</NavLink>
				</li>
			</ul>
		</nav>
	);
};

export default Navigation;
