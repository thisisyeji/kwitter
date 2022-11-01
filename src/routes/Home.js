import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { dbService } from 'fbase';
import Write from 'components/Write';
import Kweet from 'components/Kweet';
import styled from 'styled-components';

const Wrapper = styled.main`
	border-right: 1px solid #efefef;
	margin: 0 20vw 0 25vw;

	@media screen and (max-width: 768px) {
		margin: 0;
		margin-left: 60px;
	}
`;

const Title = styled.h1`
	font-size: 22px;
	font-weight: 800;
	padding: 20px;
`;

const Home = ({ userObj }) => {
	const [kweets, setKweets] = useState([]);
	const [loading, setLoading] = useState(false);

	const getKweets = () => {
		setLoading(true);

		const q = query(
			collection(dbService, 'kweets'),
			orderBy('createdAt', 'desc')
		);
		onSnapshot(q, (snapshot) => {
			const kweetArray = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setKweets(kweetArray);
		});
	};

	useEffect(() => {
		getKweets();
		return () => {
			setLoading(false);
		};
	}, []);

	return (
		<Wrapper>
			<Title>홈</Title>

			<Write userObj={userObj} />
			<section>
				{kweets.map((kweet) => (
					<Kweet
						key={kweet.id}
						kweetObj={kweet}
						isOwner={kweet.creatorId === userObj.uid}
					/>
				))}
			</section>
		</Wrapper>
	);
};

export default Home;
