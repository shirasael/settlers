import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactSelect from 'react-select';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import DirectionsIcon from '@material-ui/icons/Directions';
import DirectionsOutlinedIcon from '@material-ui/icons/DirectionsOutlined';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MaterialSelect from '@material-ui/core/Select';

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
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
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
  checkboxRoadRoot: {
    color: theme.palette.grey[400],
    '&$checkedRoad': {
      color: green[500],
    },
  },
  checkedRoad: {},
  checkboxArmyRoot: {
    color: theme.palette.grey[400],
    '&$checkedArmy': {
      color: red[500],
    },
  },
  checkedArmy: {},
  formControl: {
    margin: theme.spacing.unit,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
    minWidth: theme.typography.pxToRem(120),
  },
  selectYefes: {
    minWidth: theme.typography.pxToRem(120),
  },
  formGroup: {
    width: "100%",
  },
});

const NAME_LABEL = "Your name, yefes!";
const NAME_TAKEN_LABEL = "Sorry, this yefes already exists";

class NewPlayerForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      error: null,
      isLoaded: false,
      yafasim: [],
      
      yefes_name_error: false,
      form_valid: false,

      yefes_name: '',
      yefes_name_label: NAME_LABEL   
    };
  }

  componentDidMount() {
    fetch("/existing/yafasim")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            yafasim: this.getYafasimNames(result),
            yefes_name: '',
            yefes_name_error: false,
            yefes_name_label: NAME_LABEL,
            form_valid: false
          });
          this.validate_form(false);
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  getYafasimNames = (yafasim) => {
    return yafasim.map(yefes => yefes.name);    
  }

  name_taken = (input_name, existing_names) => {
    if (!input_name) {
      return false;
    }
    const norm_name = input_name.trim().toLowerCase();    
    for (const name of existing_names) {
      if (name.trim().toLowerCase() === norm_name) {
        return true;   
      }      
    }
    return false;
  }

  validate_form = (color, new_name) => {
    const empty_name = new_name == '';
    const taken_name = this.name_taken(new_name, this.state.yafasim);
    const yefes_name_error = empty_name || taken_name;
    const form_valid = !yefes_name_error;
    if (color) {
      this.setState({
        yefes_name_error: yefes_name_error,
        yefes_name_label: taken_name ? NAME_TAKEN_LABEL : NAME_LABEL,
        form_valid: form_valid
      });
    } else {
      this.setState({
        yefes_name_error: taken_name,
        yefes_name_label: taken_name ? NAME_TAKEN_LABEL : NAME_LABEL,
        form_valid: form_valid
      });
    }
    this.props.onChange(form_valid);
  }

  handleChange = event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      [`${event.target.name}`]: value,
      [`${event.target.name}_error`]: false,
    });
    this.validate_form(false, value);
  };

  handleSubmit(event) {
    event.preventDefault();
    this.validate_form(true, this.state.yefes_name);

    if (!this.state.form_valid) {
      return;
    }

    fetch('/new_yefes', {
      method: 'POST',
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
          "Content-Type": "application/json; charset=utf-8",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client  
      body: JSON.stringify({'name' : this.state.yefes_name.trim()}),
      processData: false
    })
    .catch(error => this.setState({error}));
  }

  render() {
    const { classes, theme } = this.props;
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>;
    } else if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    }

    return (
      <form method='POST' className={classes.formRoot} onSubmit={this.handleSubmit} id={this.props.formId}>
        <NoSsr>
          <FormGroup className={classes.formGroup}>
            <TextField
              error={this.state.yefes_name_error}
              onChange={this.handleChange}
              id="standard-error"
              label={this.state.yefes_name_label}
              className={classes.textField}
              margin="normal"
              value={this.state.yefes_name}
              name='yefes_name'
            />
            
            <div className={classes.divider} />
          </FormGroup>
        </NoSsr>
      </form>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NewPlayerForm);
