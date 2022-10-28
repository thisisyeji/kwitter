import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { dbService } from 'fbase';
import Write from '../components/Write';

const Home = () => {
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
			<Write />
			<div>
				{kweets.map((kweet) => (
					<div key={kweet.id}>
						<h4>{kweet.kweet}</h4>
					</div>
				))}
			</div>
		</div>
	);
};

export default Home;
