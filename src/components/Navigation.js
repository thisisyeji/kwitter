import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTwitter, FaSearch, FaEnvelope, FaBell } from 'react-icons/fa';
import { BsFillPersonFill } from 'react-icons/bs';
import styled from 'styled-components';

const Nav = styled.nav`
	width: 25vw;
	height: 100vh;
	position: fixed;
	top: 0;
	border-right: 1px solid ${(props) => props.theme.border};
	padding-top: 30px;
	z-index: 3;

	ul {
		margin-left: 7vw;
	}

	@media screen and (max-width: 1000px) {
		ul {
			margin-left: 4vw;
		}
	}

	@media screen and (max-width: 768px) {
		width: 60px;

		ul {
			margin-left: 0;
			padding: 3px;
		}
	}
`;

const List = styled.li`
	font-style: none;
	font-size: 26px;
	color: ${(props) => props.theme.text};
	border-radius: 30px;
	cursor: pointer;
	margin-right: 20px;
	margin-bottom: 20px;
	padding: 12px;
	transition: 0.5s;

	display: flex;
	justify-content: flex-start;
	align-items: center;

	a {
		text-decoration: none;
		color: ${(props) => props.theme.text};
		display: flex;
		justify-content: center;
		align-items: center;
	}

	svg {
		margin-right: 10px;
	}

	span {
		font-size: 20px;
		transform: translateY(2px);
	}

	&:hover {
		background-color: rgba(214, 213, 213, 0.2);
		color: rgb(29, 155, 240);
		font-weight: 700;

		svg,
		span {
			color: rgb(29, 155, 240);
		}
	}

	@media screen and (max-width: 768px) {
		color: ${(props) => props.theme.text};
		display: flex;
		justify-content: center;
		margin-right: 0;

		svg {
			margin-right: 0;
		}
		span {
			display: none;
		}
	}
`;

const Navigation = () => {
	const activeStyle = {
		color: 'rgb(29, 155, 240)',
		fontWeight: '700',
	};
	return (
		<Nav>
			<ul>
				<List>
					<NavLink exact to='/' activeStyle={activeStyle}>
						<FaTwitter className='logo' />
						<span>홈</span>
					</NavLink>
				</List>

				<List>
					<NavLink to='/profile' activeStyle={activeStyle}>
						<BsFillPersonFill style={{ fontSize: '30px' }} />
						<span>프로필</span>
					</NavLink>
				</List>

				<List>
					<FaSearch /> <span>검색하기</span>
				</List>

				<List>
					<FaBell /> <span>알림</span>
				</List>

				<List>
					<FaEnvelope /> <span>쪽지</span>
				</List>
			</ul>
		</Nav>
	);
};

export default Navigation;
