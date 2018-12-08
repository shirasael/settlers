import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import DatePicker from 'material-ui-pickers/DatePicker';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  formRoot: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  formGroup: {
    width: "100%",
  },
});

class NewPlayerForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      location_error: false,
      date_error: false,
      form_valid: false,

      location: '',
      date: new Date(),  
    };
  }

  validate_form = (color, value, name) => {
    const field_error = !value;
    const form_valid = this.state.location && this.state.date;
    if (color) {
      this.setState({
        [`${name}_error`]: field_error,
        form_valid: form_valid
      });
    } else {
      this.setState({
        form_valid: form_valid
      });
    }
    this.props.onChange(form_valid);
  }

  handleChange = event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const name = event.target.name;
    this.setState({
      [`${name}`]: value,
      [`${name}_error`]: false,
    });
    this.validate_form(false, value, name);
  }

  handleDateChange = (date) => {
    this.setState({ date: date });
    this.validate_form(false, date, 'date');    
  }

  handleSubmit(event) {
    event.preventDefault();
    this.validate_form(true, this.state.lcation, 'location');
    this.validate_form(true, this.state.date, 'date');

    if (!this.state.form_valid) {
      return;
    }

    fetch('/new_game', {
      method: 'POST',
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
          "Content-Type": "application/json; charset=utf-8",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client  
      body: JSON.stringify({'date' : this.state.date,
                            'location' : this.state.location}),
      processData: false
    })
    .catch(error => this.setState({error}));
  }

  render() {
    const { classes, theme } = this.props;

    return (
      <form method='POST' className={classes.formRoot} onSubmit={this.handleSubmit} id={this.props.formId}>
        <NoSsr>
          <FormGroup className={classes.formGroup}>
            <TextField
              error={this.state.location_error}
              onChange={this.handleChange}
              id="standard-error"
              label="Game location"
              className={classes.textField}
              margin="normal"
              value={this.state.location}
              name='location'
            />
            <div className={classes.divider} />

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                value={this.state.date}
                onChange={this.handleDateChange}
              />
            </MuiPickersUtilsProvider>
            
          </FormGroup>
        </NoSsr>
      </form>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NewPlayerForm);
