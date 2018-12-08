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
  numInput: {
    width: 200,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}


function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

const integer_fields = [
  {
    field_name: 'place',
    label: '# Place',
    default_value: ''
  },
  {
    field_name: 'cities',
    label: 'Cities',
    default_value: ''
  },
  {
    field_name: 'settlements',
    label: 'Settlements',
    default_value: 2
  },
  {
    field_name: 'roads_in_a_row',
    label: 'Roads in a row',
    default_value: -1
  },
  {
    field_name: 'knights',
    label: 'Knights',
    default_value: -1
  },
  {
    field_name: 'victory_points',
    label: 'Victory points',
    default_value: -1
  },
  {
    field_name: 'yops',
    label: 'Years of planty',
    default_value: -1
  },
  {
    field_name: 'road_builds',
    label: 'Road buildings',
    default_value: -1
  },
  {
    field_name: 'monopolies',
    label: 'Monopolies',
    default_value: -1
  },
];

class StatsForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      error: null,
      isLoaded: false,
      yafasim: [],
      games: [],
      
      yefes_id_error: false,
      game_id_error: false,
      form_valid: false,

      stats: this.get_default_stats(),      
    };
  }

  get_default_stats() {
    var stats = {
      yefes_id: [],
      game_id: '',
      longest_road: false,
      longest_army: false,  
    };

    for (var int_field in integer_fields) {
      stats[int_field.field_name] = int_field.default_value;
    }

    return stats;
  }

  componentDidMount() {
    fetch("/existing")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            games: result.games,
            yafasim: result.yafasim,
            stats: this.get_default_stats(),
            yefes_id_error: false,
            game_id_error: false,
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

  validate_form = (color) => {
    const yefes_error = this.state.stats.yefes_id == '';
    const game_error = this.state.stats.game_id === '';
    const form_valid = !yefes_error && !game_error;
    if (color) {
      this.setState({
        yefes_id_error: yefes_error,
        game_id_error:  game_error,
        form_valid: form_valid
      });
    } else {
      this.setState({
        form_valid: form_valid
      });
    }
    this.props.onChange(form_valid);
  }

  handleNameChange = name => value => {
    var stats = this.state.stats;
    stats[name] = value;
    this.setState({
      stats: stats,
      [`${name}_error`]: false,
    });
    this.validate_form(false);
  }

  handleChange = event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    var stats = this.state.stats;
    stats[event.target.name] = value;
    this.setState({
      stats: stats,
      [`${event.target.name}_error`]: false,
    });
    this.validate_form(false);
  };

  handleSubmit(event) {
    event.preventDefault();
    this.validate_form(true);

    if (!this.state.form_valid) {
      return;
    }

    var stats = this.state.stats;
    stats.yefes_id = stats.yefes_id.value;

    fetch('/new_game_stat', {
      method: 'POST',
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
          "Content-Type": "application/json; charset=utf-8",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client  
      body: JSON.stringify(stats),
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

    const yafasim_suggestions = this.state.yafasim.map((y) => ({label: y.name, value: y.id}));
    const games_suggestions = this.state.games.map((g) => (
      <MenuItem value={g.id} key={g.id}>{`#${g.id}  ${g.location}, ${g.date}`}</MenuItem>
    ));

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    const integer_fields_inputs = integer_fields.map((int_field) => (
      <TextField
        className={classes.numInput}
        id="standard-number"
        label={int_field.label}
        value={this.state.stats[int_field.field_name]}
        name={int_field.field_name}
        onChange={this.handleChange}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
      />
    ));

    return (
      <form method='POST' className={classes.formRoot} onSubmit={this.handleSubmit} id={this.props.formId}>
        <NoSsr>
          <FormGroup className={classes.formGroup}>
            <ReactSelect
              classes={classes}
              className={classes.selectYefes}
              styles={selectStyles}
              options={yafasim_suggestions}
              components={components}
              value={this.state.stats.yefes_id}
              onChange={this.handleNameChange("yefes_id")}
              placeholder="Your name, yefes!"
              textFieldProps={{required: true, error: this.state.yefes_id_error}}
            />
            
            <div className={classes.divider} />

            <FormControl className={classes.formControl}>
              <MaterialSelect
                value={this.state.stats.game_id}
                onChange={this.handleChange}
                name='game_id'
                displayEmpty
                className={classes.selectEmpty}
                required
                error={this.state.game_id_error}
              >
                <MenuItem value=''>
                  <em>Choose a game</em>
                </MenuItem>
                {games_suggestions}
              </MaterialSelect>
            </FormControl>
            <div className={classes.divider} />
            <FormGroup row>
              {integer_fields_inputs}
            </FormGroup>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox 
                    icon={<DirectionsOutlinedIcon />} 
                    checkedIcon={<DirectionsIcon />} 
                    onChange={this.handleChange}
                    name="longest_road"
                    value="longest_road"
                    classes={{
                      root: classes.checkboxRoadRoot,
                      checked: classes.checkedRoad,
                    }} />
                }
                label="Longest road"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    icon={<VerifiedUserOutlinedIcon />} 
                    checkedIcon={<VerifiedUserIcon />} 
                    onChange={this.handleChange}
                    name="longest_road"
                    value="longest_road"
                    classes={{
                      root: classes.checkboxArmyRoot,
                      checked: classes.checkedArmy,
                    }} />
                }
                label="Longest army"
              />
            </FormGroup>
          </FormGroup>
        </NoSsr>
      </form>
    );
  }
}

export default withStyles(styles, { withTheme: true })(StatsForm);
