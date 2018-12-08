import React from 'react';
import InfoTable from './table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

function GamesInfoTable(props) {
	const { classes, players, className } = props;

	const headers = [
		<TableCell key={1}>Yefes Name</TableCell>,
	  <TableCell numeric key={2}>Points</TableCell>,
	  <TableCell numeric key={3}>Victory Points</TableCell>,
	  <TableCell numeric key={4}>Knights</TableCell>,
	  <TableCell numeric key={5}>Roads in a Row</TableCell>,
	];

	var orderedPlayers = players.sort( (p1, p2) => {
		return p1.place > p2.place;
	});

	const rows = orderedPlayers.map(
		yefes => {
    return (
      <TableRow key={yefes.yefes_id}>
        <TableCell component="th" scope="row">
          {yefes.yefes_info.name}
        </TableCell>
        <TableCell numeric>{yefes.points}</TableCell>
        <TableCell numeric>{yefes.victory_points}</TableCell>
        <TableCell numeric>{yefes.knights}</TableCell>
        <TableCell numeric>{yefes.roads_in_a_row}</TableCell>
      </TableRow>
    );
  });

  return <InfoTable className={className} classes={classes} headers={headers} rows={rows} />;
}

export default GamesInfoTable;