import ResponsiveDrawer from './nav';
import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';

class MyApp extends React.Component {

	render() {
	  return (
	    <React.Fragment>
	      <CssBaseline />
	      <ResponsiveDrawer/>
	    </React.Fragment>
	  );
	}
}

ReactDOM.render(
  <MyApp/>,
  document.getElementById('main')
);