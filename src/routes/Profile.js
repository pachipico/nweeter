import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import { useHistory } from "react-router-dom";

const Profile = ({ userObj, refreshUserObj }) => {
	const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
	const [isUpdating, setIsUpdating] = useState(false);
	const getMyNweets = async () => {
		const nweets = await dbService
			.collection("nweets")
			.where("creatorId", "==", userObj.uid)
			.orderBy("createdAt")
			.get();

		console.log(nweets.docs.map((doc) => doc.data()));
	};

	useEffect(() => {
		getMyNweets();
	}, []);

	const history = useHistory();
	const signOut = (e) => {
		authService.signOut();
		history.push("/");
	};

	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setNewDisplayName(value);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (userObj.displayName !== newDisplayName) {
			await userObj.updateProfile({ displayName: newDisplayName });
			refreshUserObj();
		}
		setIsUpdating((prev) => !prev);
	};

	const toggleUpdate = () => {
		setIsUpdating((prev) => !prev);
	};

	return (
		<>
			{isUpdating ? (
				<>
					<form onSubmit={onSubmit}>
						<input
							value={newDisplayName}
							onChange={onChange}
							type='text'
							placeholder='Display Name'
						/>

						<input type='submit' value='Confirm' />
					</form>
				</>
			) : (
				<button onClick={toggleUpdate}>Edit Profile</button>
			)}
			<button onClick={signOut}>Log Out</button>
		</>
	);
};
export default Profile;
