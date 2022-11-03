import Routers from 'components/Routers';
import React, { useState, useEffect } from 'react';
import { authService } from 'fbase';
import { onAuthStateChanged } from 'firebase/auth';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from 'themes';
import { MdWbSunny, MdNightlightRound } from 'react-icons/md';

const GlobalStyle = createGlobalStyle`
	html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
* {
box-sizing: border-box;
font-family: 'Josefin Sans', sans-serif;
}

body {
  line-height: 1;
  width: 100%;
  height: 100vh;
  background: ${({ theme }) => theme.bg};
	font-family: 'Josefin Sans', sans-serif;
}
menu, ol, ul, li {
  list-style: none;
	text-decoration: none;

}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
`;

const ThemeBtn = styled.button`
	position: fixed;
	bottom: 30px;
	left: 10px;
	z-index: 5;

	width: 40px;
	height: 40px;
	color: ${({ theme }) => theme.bg};
	font-size: 26px;
	border: none;
	border-radius: 50%;
	outline: none;
	background: rgb(29, 155, 240);
	cursor: pointer;
	transform: rotate(-45deg);
	transition: 0.5s;

	display: flex;
	justify-content: center;
	align-items: center;

	&:hover {
		transform: rotate(-60deg) scale(1.2);
	}
`;

function App() {
	const getDark = () => {
		const mode = localStorage.getItem('mode');
		if (mode) {
			return JSON.parse(mode);
		} else {
			return 'light';
		}
	};
	const [theme, setTheme] = useState(getDark());
	const isDarkMode = theme === 'dark';

	const onDark = () => {
		setTheme(isDarkMode ? 'light' : 'dark');
	};

	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userObj, setUserObj] = useState(null);

	useEffect(() => {
		onAuthStateChanged(authService, (user) => {
			if (user) {
				setIsLoggedIn(true);
				// displayName, photoURL 받아오기
				if (user.displayName === null) {
					const name = user.email.split('@')[0];
					user.displayName = name;
				}
				if (user.photoURL === null) {
					const defaultURL = process.env.PUBLIC_URL + '/img/default.jpg';
					user.photoURL = defaultURL;
				}
				setUserObj(user);
			} else {
				setIsLoggedIn(false);
				setUserObj(null);
			}
			setInit(true);
		});
	}, [userObj]);

	useEffect(() => {
		localStorage.setItem('mode', JSON.stringify(theme));
	}, [theme]);

	const refreshUser = () => {
		const user = authService.currentUser;
		setUserObj({ ...user });
	};

	return (
		<ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
			<GlobalStyle />
			{init ? (
				<Routers
					isLoggedIn={isLoggedIn}
					userObj={userObj}
					refreshUser={refreshUser}
				/>
			) : (
				'Initializing...'
			)}
			<ThemeBtn onClick={() => onDark()}>
				{isDarkMode ? <MdWbSunny /> : <MdNightlightRound />}
			</ThemeBtn>
		</ThemeProvider>
	);
}

export default App;
