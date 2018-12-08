import React from 'react';
import InfoTable from './table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

function PlayersInfoTable(props) {
	const { classes, players } = props;

	const headers = [
		<TableCell key={1}>Yefes Name</TableCell>,
    <TableCell numeric key={2}>Games Played</TableCell>,
	  <TableCell numeric key={3}>Wins</TableCell>,
	  <TableCell numeric key={4}>Avg. Knights</TableCell>,
	  <TableCell numeric key={5}>Avg. Roads</TableCell>,
	  <TableCell numeric key={6}>Avg. Dev Cards</TableCell>,
	];

	const rows = players.map(
		yefes => {
    return (
      <TableRow key={yefes.id}>
        <TableCell component="th" scope="row">
          {yefes.name}
        </TableCell>
        <TableCell numeric>{yefes.games_played}</TableCell>
        <TableCell numeric>{yefes.wins}</TableCell>
        <TableCell numeric>{yefes.avg_knights}</TableCell>
        <TableCell numeric>{yefes.avg_roads}</TableCell>
        <TableCell numeric>{yefes.avg_dev_cards}</TableCell>
      </TableRow>
    );
  });

  return <InfoTable classes={classes} headers={headers} rows={rows} />;
}

export default PlayersInfoTable;