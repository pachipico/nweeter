import { dbService, storageService } from "fbase";
import React, { useState } from "react";

function Nweet({ nweetObj, isOwner }) {
	const [editing, setEditing] = useState(false);
	const [newNweet, setNewNweet] = useState(nweetObj.text);
	const onDelete = async () => {
		const ok = window.confirm("Are you sure you want to delete?");
		if (ok) {
			await dbService.doc(`nweets/${nweetObj.id}`).delete();
			await storageService.refFromURL(nweetObj.attachmentUrl).delete();
		}
	};

	const toggleEditing = () => {
		setEditing((prev) => !prev);
	};

	const onSubmit = async () => {
		await dbService.doc(`nweets/${nweetObj.id}`).update({ text: newNweet });
		setEditing(false);
	};
	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setNewNweet(value);
	};
	return (
		<div>
			{editing ? (
				<>
					{nweetObj.attachmentUrl && (
						<img
							style={{ width: "150px", height: "150px" }}
							src={nweetObj.attachmentUrl}
							alt={nweetObj.text}
						/>
					)}
					<form onSubmit={onSubmit} type='submit'>
						<input onChange={onChange} value={newNweet} required />
						<input type='submit' value='Edit' />
						<button onClick={toggleEditing}>Cancle</button>
					</form>
				</>
			) : (
				<>
					<h4>{nweetObj.text}</h4>
					{nweetObj.attachmentUrl && (
						<img
							style={{ width: "150px", height: "150px" }}
							src={nweetObj.attachmentUrl}
							alt={nweetObj.text}
						/>
					)}
					{isOwner && (
						<>
							<button onClick={toggleEditing}>Edit</button>
							<button onClick={onDelete}>Delete</button>
						</>
					)}
				</>
			)}
		</div>
	);
}

export default Nweet;
