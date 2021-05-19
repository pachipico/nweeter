import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

const AppRouter = ({ isLoggedIn, userObj, refreshUserObj }) => {
	return (
		<Router>
			{isLoggedIn && <Navigation userObj={userObj}></Navigation>}
			<Switch>
				{isLoggedIn ? (
					<>
						<Route exact path='/'>
							<Home userObj={userObj} />
						</Route>
						<Route exact path='/profile'>
							<Profile refreshUserObj={refreshUserObj} userObj={userObj} />
						</Route>
					</>
				) : (
					<>
						<Route exact path='/'>
							<Auth />
						</Route>
					</>
				)}
			</Switch>
		</Router>
	);
};
export default AppRouter;
