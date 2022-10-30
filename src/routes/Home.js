import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { dbService } from 'fbase';
import Write from 'components/Write';
import Kweet from 'components/Kweet';
import styled from 'styled-components';

const Wrapper = styled.section`
	margin-top: 50px;
	margin-left: 30vw;
`;

const Home = ({ userObj }) => {
	const [kweets, setKweets] = useState([]);

	useEffect(() => {
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
	}, []);

	return (
		<Wrapper>
			<Write userObj={userObj} />
			<div>
				{kweets.map((kweet) => (
					<Kweet
						key={kweet.id}
						kweetObj={kweet}
						isOwner={kweet.creatorId === userObj.uid}
					/>
				))}
			</div>
		</Wrapper>
	);
};

export default Home;
