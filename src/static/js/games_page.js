import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import StarIcon from '@material-ui/icons/star';
import Icon from '@material-ui/core/Icon';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import AssessIcon from '@material-ui/icons/Assessment';
import GamesIcon from '@material-ui/icons/Games';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import StatsForm from './stats_form';
import NewGameForm from './new_game_form';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import GamesInfoTable from './games';
import colors from './colors';

const styles = theme => ({
  root: {
    width: '100%',
    overflow: 'auto'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
    paddingLeft: theme.typography.pxToRem(10),
    paddingTop: theme.typography.pxToRem(6),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
    paddingTop: theme.typography.pxToRem(8),
  },
  fabDiv: {
    position: 'fixed',
    bottom: theme.spacing.unit * 3,
    right: theme.spacing.unit * 3,
  	width: '9rem',
  },
  fab: {
  	width: '9rem',
  	marginTop: theme.spacing.unit * 2
  },
  loading: {
  	width: '100%',
  	marginTop: theme.spacing.unit * 10,
  	textAlign: 'center',
  },
  icon0: {
  	backgroundColor: colors[0],
  },
  icon1: {
  	backgroundColor: colors[1],
  },
  icon2: {
  	backgroundColor: colors[2],
  },
  icon3: {
  	backgroundColor: colors[3],
  },
  icon4: {
  	backgroundColor: colors[4],
  },
  icon5: {
  	backgroundColor: colors[5],
  },
});

function GameItem(props) {
	const { classes, gameData, onChange, expanded, index } = props;
	const { winner, location, date, players } = gameData;

	return (
		<ExpansionPanel expanded={expanded} onChange={onChange}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
	      <Avatar className={classes[`icon${index % colors.length}`]}>
	        <StarIcon/>
	      </Avatar>
        <Typography className={classes.heading}>{winner.name}</Typography>
        <Typography className={classes.secondaryHeading}>{date + " at " + location}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <GamesInfoTable players={players}/>
      </ExpansionPanelDetails>
    </ExpansionPanel>
	);
}

GameItem.propTypes = {
  expanded: PropTypes.bool,
};

class GamesExpansionPanels extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      games: [],
    	expanded: null,
		  stats_open: false,
		  game_open: false,
		  valid_stats_form: false,
		  valid_game_form: false
  	};
  }

  handleStatClickOpen = () => {
    this.setState({ stats_open: true });
  }

  handleStatClose = () => {
    this.setState({ stats_open: false });
  }

  handleStatSend = () => {
  	this.setState({ stats_open: !this.state.valid_stats_form });
  	this.fetchGames();
  }

  handleStatFormChange = (is_valid) => {
  	this.setState({valid_stats_form: is_valid});
  }

  handleGameClickOpen = () => {
    this.setState({ game_open: true });
  }

  handleGameClose = () => {
    this.setState({ game_open: false });
  }

  handleGameSend = () => {
  	this.setState({ game_open: !this.state.valid_game_form });
  	this.fetchGames();
  }

  handleGameFormChange = (is_valid) => {
  	this.setState({valid_game_form: is_valid});
  }

  fetchGames() {
  	fetch("/games")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            games: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  componentDidMount = () => {
    this.fetchGames();
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  }

  getContents() {
  	if (this.state.games) {
  		return this.state.games.map((game) =>
			  <GameItem 
			  	classes={this.props.classes}
			  	expanded={this.state.expanded === game.id}
			  	onChange={this.handleChange(game.id)}
			  	gameData={game}
			  	index={game.id}
			  	key={game.id}/>
			);
  	} else {
  		return <Typography>No games yet! Click below to add one.</Typography>
  	}
  }

  actions = () => {
  	return {
		  new_game: {
		  	button: (<Button className={this.props.classes.fab} onClick={this.handleGameClickOpen} variant="extendedFab" color="secondary" aria-label="Add">
					          <GamesIcon />
					          Add New Game
					        </Button>),
		  	action: (<Dialog
				        	open={this.state.game_open}
				          onClose={this.handleStatClose}
				          aria-labelledby="form-dialog-title"
				        >
				          <DialogTitle id="form-dialog-title">Add a New Game</DialogTitle>
				          <DialogContent>
				            <NewGameForm formId="game_form" onChange={this.handleGameFormChange}/>
				          </DialogContent>
				          <DialogActions>
				            <Button onClick={this.handleGameClose} color="primary">
				              Cancel
				            </Button>
				            <Button type="submit" form="game_form" onClick={this.handleGameSend} color="primary">
				              Send
				            </Button>
				          </DialogActions>
				        </Dialog>)
		  },
		  new_stat: {
		  	button: (<Button className={this.props.classes.fab} onClick={this.handleStatClickOpen} variant="extendedFab" color="primary" aria-label="Add">
				          <AssessIcon />
				          Add Game Data
				        </Button>),
		  	action: (<Dialog
				        	fullScreen={this.props.fullScreen}
				          open={this.state.stats_open}
				          onClose={this.handleStatClose}
				          aria-labelledby="form-dialog-title"
				        >
				          <DialogTitle id="form-dialog-title">Add game statistics</DialogTitle>
				          <DialogContent>
				            <StatsForm formId="stats_form" onChange={this.handleStatFormChange}/>
				          </DialogContent>
				          <DialogActions>
				            <Button onClick={this.handleStatClose} color="primary">
				              Cancel
				            </Button>
				            <Button type="submit" form="stats_form" onClick={this.handleStatSend} color="primary">
				              Send
				            </Button>
				          </DialogActions>
				        </Dialog>)
		  }
		}
  }

  render() {
    const { classes } = this.props;
    const { expanded, error, isLoaded, games } = this.state;
		
		if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return (
      	<div className={classes.loading}>
      		<CircularProgress />
      	</div>
      );
    } else {
	    const renderedGames = this.getContents();
	    const actions = this.actions();

	    var stats_button = <div/>;
	    var stats_action = <div/>;
	    if (this.state.games.length > 0) {
	    	stats_button = actions.new_stat.button;
	    	stats_action = actions.new_stat.action;
	    }
	    
	    return (
	      <div className={classes.root}>
	        {renderedGames}
	        <div className={classes.fabDiv}>
		        {actions.new_game.button}
		        {stats_button}
	        </div>
        	{actions.new_game.action}
        	{stats_action}
	      </div>
	    );
	  }
  }
}

GamesExpansionPanels.propTypes = {
  classes: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool.isRequired,
};



export default withMobileDialog()(withStyles(styles)(GamesExpansionPanels));