import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import Icon from '@material-ui/core/Icon';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import NewPlayerForm from './new_yefes_form';
import CircularProgress from '@material-ui/core/CircularProgress';
import PlayersInfoTable from './players'

const styles = theme => ({
  root: {
    width: '100%',
    overflow: 'auto'
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 3,
    right: theme.spacing.unit * 3,
  },
  loading: {
    width: '100%',
    marginTop: theme.spacing.unit * 10,
    textAlign: 'center',
  },
  dialog: {
    width: '88%',
    margin: theme.spacing.unit
  }
});

class PlayersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      players: [],
      open: false,
      valid_form: false
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  handleSend = () => {
    this.setState({ open: !this.state.valid_form });
    this.fetchPlayers();
  }

  handleFormChange = (is_valid) => {
    this.setState({valid_form: is_valid});
  };

  fetchPlayers() {
    fetch("/yefes")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            players: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  componentDidMount = () => {
    this.fetchPlayers();
  }

  render() {
    const { classes } = this.props;
    const { expanded, error, isLoaded, players } = this.state;
    
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      );
    } else {

      return (
        <div className={classes.root}>
          <PlayersInfoTable players={players} />
          <Button onClick={this.handleClickOpen} variant="fab" color="primary" aria-label="Add" className={classes.fab}>
            <AddIcon />
          </Button>
          <Dialog
            classes={{
              paper: classes.dialog,
            }}
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Add a Yefes</DialogTitle>
            <DialogContent>
              <NewPlayerForm formId="yefes_form" onChange={this.handleFormChange}/>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" form="yefes_form" onClick={this.handleSend} color="primary">
                Send
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
  }
}

PlayersTable.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(PlayersTable);