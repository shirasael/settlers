import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ResponsiveContainer, PieChart, Pie, Sector, Cell }  from 'recharts';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import colors from './colors'

const styles = theme => ({
  root: {
    width: '100%',  
  },
  loading: {
    width: '100%',
    marginTop: theme.spacing.unit * 10,
    textAlign: 'center',
  },
  pieChart: {
    fontWeight: 100,
    fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"],
    overflowX: "hidden",
    width: "100%"
  },
  pie: {
    width: "100%"
  }
});



const RADIAN = Math.PI / 180;                    

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const x = ex + (cos >= 0 ? 1 : -1) * 12;
  const y = ey;
 
  const fill = colors[index % colors.length];
  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke={fill}/>
      
      <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'}  dominantBaseline="central">
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  );
};

function SimplePieChart(props) {
  const {classes, data, onPieEnter } = props;
	return (
    <ResponsiveContainer width="100%" height={400}>
    	<PieChart className={classes.pieChart} onMouseEnter={onPieEnter}>
        <Pie
          data={data} 
          cx="50%"  
          innerRadius={60}
          outerRadius={80} 
          fill="#8884d8"
          paddingAngle={1}
          dataKey="value" 
          nameKey="name"
          label={renderCustomizedLabel}
          className={classes.pie}
        >
        	{
          	data.map((entry, index) => <Cell key={index} fill={colors[index % colors.length]}/>)
          }
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

class StatsPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      yafasim: [],
      stats: null,
    };
  }

  componentDidMount() {
    fetch("/stats")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            yafasim: result.yafasim,
            stats: result.stats
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

  render() {
    const { classes } = this.props;

    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>;
    } else if (!this.state.isLoaded) {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      );
    }
    var data = [];
    for (var yefes of this.state.yafasim) {
      if (yefes.wins > 0) {
        data.push({name: yefes.name, value: yefes.wins});
      }
    }

    var stats_view = []
    for (var stat in this.state.stats) {
      const title = stat.split('_')
                        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(' ');
      stats_view.push(<Typography variant="body1" key={stat}>{title}: {this.state.stats[stat]}</Typography>);
    }

    return (
      <div className={classes.root}>
        <SimplePieChart classes={classes} onPieEnter={() => {return;}} data={data}/>
        {stats_view}
      </div>
    )
  }

}

export default withStyles(styles)(StatsPage);