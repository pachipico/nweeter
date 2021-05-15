import React, { useState } from "react";
import { authService } from "fbase";

const Auth = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [newAccount, setNewAccount] = useState(true);
	const [error, setError] = useState("");

	const onChange = (e) => {
		const {
			target: { name, value },
		} = e;
		if (name === "email") setEmail(value);
		else if (name === "password") setPassword(value);
	};
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			let data;
			if (newAccount) {
				data = await authService.createUserWithEmailAndPassword(
					email,
					password
				);
			} else {
				data = await authService.signInWithEmailAndPassword(email, password);
			}
			console.log(data);
		} catch (err) {
			setError(err.message);
		}
	};
	const toggleAccount = () => setNewAccount((prev) => !prev);
	return (
		<div>
			<form onSubmit={onSubmit}>
				<input
					name='email'
					type='email'
					placeholder='Email'
					onChange={onChange}
					value={email}
					required
				/>
				<input
					name='password'
					type='password'
					placeholder='Password'
					onChange={onChange}
					value={password}
					required
				/>
				<input
					type='submit'
					value={newAccount ? "Create New Account" : "Sign In"}
				/>
				{error}
			</form>
			<span onClick={toggleAccount}>
				{newAccount ? "Sign In" : "Create Account"}
			</span>
			<div>
				<button>Continue with Google</button>
				<button>Continue with GitHub</button>
			</div>
		</div>
	);
};

export default Auth;
