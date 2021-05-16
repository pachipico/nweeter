import React from "react";
import { authService } from "fbase";

const Home = () => (
	<span>
		Home <button onClick={() => authService.signOut()}>log out</button>
	</span>
);
export default Home;
