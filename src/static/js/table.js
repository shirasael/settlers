import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  paper: {
    width: '100%',
    overflow: 'auto'
  },
  table: {
    minWidth: 700,
  },
  tableContainer: {
    overflowX: 'auto',
  },
});


function InfoTable(props) {
	const { classes, headers, rows } = props;

  return (
    <Paper className={classes.paper}>
    	<div className={classes.tableContainer}>
	      <Table className={classes.table}>
	        <TableHead>
	          <TableRow>
	            {headers}
	          </TableRow>
	        </TableHead>
	        <TableBody>
	          {rows}
	        </TableBody>
	      </Table>
      </div>
    </Paper>
  );
}

InfoTable.propTypes = {
  classes: PropTypes.object.isRequired,
  headers: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
};


export default withStyles(styles)(InfoTable);