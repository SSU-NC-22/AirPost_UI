import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, BrowserRouter, Link } from 'react-router-dom';
import Nav from './Navigation';
import SensorManagement from './ManagementComponents/SensorManagement';
import NodeManagement from './ManagementComponents/NodeManagement';
import ActuatorManagement from './ManagementComponents/ActuatorManagement';
import Dashboard from './KibanaDashboard';
import Visualize from './KibanaVisualize';
import Main from './Home';
import LogicCoreManagement from './LogicCoreComponents/LogicCoreManagement';
import RegisterLogic from './LogicCoreComponents/RegisterLogic';
import SinkManagement from './ManagementComponents/SinkManagement';
//import AlertAlarm from './ManagementComponents/AlertAlarm';
import TopicManagement from './KafkaComponents/Topic/TopicManagement';

import RegisterDelivery from './RegisterDelivery';
import TrackingDelivery from './TrackingDelivery'
import {signIn} from './auth.js'
import AuthRoute from './AuthRoute.js'
import LoginForm from './LoginForm.js'
import Logoutbutton from './LogoutButton'
import NotFound from './NotFound.js'

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
							<AuthRoute
								authenticated={authenticated}
								component
            					path="/sensor"
								render={props => <SensorManagement user={user} {...props} />}
          					/>
							<AuthRoute
								authenticated={authenticated}
								component
            					path="/actuator"
								render={props => <ActuatorManagement user={user} {...props} />}
          					/>
							<AuthRoute
								authenticated={authenticated}
								component
            					path="/node"
								render={props => <NodeManagement user={user} {...props} />}
          					/>
							<AuthRoute
								authenticated={authenticated}
								component
            					path="/sink"
								render={props => <SinkManagement user={user} {...props} />}
          					/>
							<AuthRoute
								authenticated={authenticated}
								component
            					path="/topic"
								render={props => <TopicManagement user={user} {...props} />}
          					/>
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
							<AuthRoute
								authenticated={authenticated}
								component
            					path="/visualize"
								render={props => <Visualize user={user} {...props} />}
          					/>  
							<AuthRoute
								authenticated={authenticated}
								component
            					path="/dashboard"
								render={props => <Dashboard user={user} {...props} />}
          					/>              
							<Route path="/delivery" component={RegisterDelivery} />
							<Route path="/tracking" component={TrackingDelivery} />
							<Route path="/login"
            					render={props => (
              					<LoginForm authenticated={authenticated} login={login} {...props} />
            					)}
          					/>
							<Route component={NotFound} />
						>
						</Switch>
					</div>
				</div>
			</Router>
		</div>
		</BrowserRouter>
	);
}
export default App;
