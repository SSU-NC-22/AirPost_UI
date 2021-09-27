import React, { useState, createContext, useCallback} from 'react';
import { BrowserRouter as Router, Route, Switch, BrowserRouter, Link } from 'react-router-dom';
import Nav from './Navigation';
import NodeManagement from './ManagementComponents/NodeManagement';
import Dashboard from './KibanaDashboard';
import Visualize from './KibanaVisualize';
import Main from './Home';
import SinkManagement from './ManagementComponents/SinkManagement';
import TopicManagement from './KafkaComponents/Topic/TopicManagement';

import RegisterDelivery from './DeliveryManagement/RegisterDelivery'
import TrackingDelivery from './DeliveryManagement/TrackingDelivery'
import DeliveryConfirm from './DeliveryManagement/DeliveryConfirm';
import {signIn} from './LoginInfo/auth.js'
import AuthRoute from './LoginInfo/AuthRoute.js'
import LoginForm from './LoginInfo/LoginForm.js'
import Logoutbutton from './LoginInfo/LogoutButton'
import NotFound from './NotFound';

/* 
App
- Routing
- Show navigation bar (Nav)
- Alert alarm service
*/


function App(){
	const [user, setUser] = useState(null);
  	const authenticated = user != null;

  	const login = ({ email, password }) => setUser(signIn({ email, password }));
  	const logout = () => setUser(null);

	return (
		<BrowserRouter>
		<div>
			<Router>
				<div>
					<Nav></Nav>
					{/* <AlertAlarm /> */}
					<div className="container pt-4 mt-4">
						<Switch>
							<Route exact path="/" render={Main} />
							{/*
							<AuthRoute
								authenticated={authenticated}
								component
            					path="/sensor"
								render={props => <SensorManagement user={user} {...props} />}
							  />
							*/}
							<AuthRoute
								authenticated={authenticated}
								component = {NodeManagement}
            					path="/node"
								render={props => <NodeManagement user={user} {...props} />}
          					/>
							<AuthRoute
								authenticated={authenticated}
								component = {SinkManagement}
            					path="/sink"
								render={props => <SinkManagement user={user} {...props} />}
          					/>
							<AuthRoute
								authenticated={authenticated}
								component = {TopicManagement}
            					path="/topic"
								render={props => <TopicManagement user={user} {...props} />}
          					/>
							  {/*
							<AuthRoute
								authenticated={authenticated}
								component
            					path="/logicCore"
								render={props => <LogicCoreManagement user={user} {...props} />}
							  />
							  
							<AuthRoute
								authenticated={authenticated}
								component
            					path="/registerLogic"
								render={props => <RegisterLogic user={user} {...props} />}
							  />
							  */}
							<AuthRoute
								authenticated={authenticated}
            					path="/visualize"
								render={props => <Visualize user={user} {...props} />}
          					/>  
							<AuthRoute
								authenticated={authenticated}
            					path="/dashboard"
								render={props => <Dashboard user={user} {...props} />}
          					/> 
							<Route path="/confirm" component={DeliveryConfirm} />           
							<Route path="/delivery" component={RegisterDelivery} />
							<Route path="/tracking" component={TrackingDelivery} />
							<Route path="/login"
            					render={props => (
              					<LoginForm authenticated={authenticated} login={login} {...props} />
            					)}
          					/>
							<Route component={NotFound} />
						</Switch>
					</div>
				</div>
			</Router>
		</div>
		</BrowserRouter>
	);
}
export default App;
