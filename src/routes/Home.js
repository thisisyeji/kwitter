import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { dbService } from 'fbase';
import Write from '../components/Write';

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
		<div>
			<Write userObj={userObj} />
			<div>
				{kweets.map((kweet) => (
					<div key={kweet.id}>
						<h4>{kweet.text}</h4>
						<p>{kweet.creatorName}</p>
						<span>{kweet.createdDate}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default Home;
