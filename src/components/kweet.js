import React from 'react';

const Kweet = ({ kweetObj }) => {
	return (
		<div>
			<img src={kweetObj.profile} alt='userImage' />
			<h4>{kweetObj.text}</h4>
			<p>{kweetObj.creatorName}</p>
			<span>{kweetObj.createdDate}</span>
		</div>
	);
};

export default Kweet;
