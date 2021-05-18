import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
	const [nweet, setNweet] = useState("");
	const [nweets, setNweets] = useState([]);
	const [attachment, setAttachment] = useState("");

	useEffect(() => {
		dbService.collection("nweets").onSnapshot((snapshot) => {
			const nweetArray = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setNweets(nweetArray);
		});
	}, []);

	const onSubmit = async (e) => {
		e.preventDefault();
		let attachmentUrl = "";
		if (attachment !== "") {
			const attachmentRef = storageService
				.ref()
				.child(`${userObj.uid}/${uuidv4()}`);
			const response = await attachmentRef.putString(attachment, "data_url");
			attachmentUrl = await response.ref.getDownloadURL();
		}
		const nweetObj = {
			text: nweet,
			createdAt: Date.now(),
			creatorId: userObj.uid,
			attachmentUrl,
		};
		await dbService.collection("nweets").add(nweetObj);

		setNweet("");
		setAttachment("");
	};
	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setNweet(value);
	};
	const onFileChange = (e) => {
		const {
			target: { files },
		} = e;
		const theFile = files[0];
		const reader = new FileReader();
		reader.onloadend = (finishedEvent) => {
			const {
				currentTarget: { result },
			} = finishedEvent;
			setAttachment(result);
		};

		reader.readAsDataURL(theFile);
	};
	const clearPreviewClick = () => {
		setAttachment(null);
	};
	return (
		<div>
			<form onSubmit={onSubmit}>
				<input
					onChange={onChange}
					type='text'
					placeholder="What's on your mind?"
					value={nweet}
					maxLength={120}
				/>
				<input type='file' accept='image/*' onChange={onFileChange} />
				<input type='submit' value='Nweet' />
				{attachment && (
					<>
						<div>
							<img
								alt={attachment}
								src={attachment}
								style={{ width: "50px", height: "50px" }}
							/>
							<button onClick={clearPreviewClick}>Clear</button>
						</div>
					</>
				)}
			</form>
			<div>
				<ul>
					{nweets.map((nweet) => {
						return (
							<Nweet
								dataUrl
								isOwner={nweet.creatorId === userObj.uid}
								key={nweet.id}
								nweetObj={nweet}
							/>
						);
					})}
				</ul>
			</div>
		</div>
	);
};
export default Home;
