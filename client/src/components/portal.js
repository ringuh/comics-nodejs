import React from 'react';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PortalNavigation from './portal_navigation'
import Strip from './comic/strip'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import ProgressBar from '../util/ProgressBar'
/* import RedirectMe from '../util/RedirectMe' */
import axios from 'axios'

const styles = theme => ({
    root: {

    },
    empty: {
        padding: "2em"
    }
});

class Portal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            strips: null,
            redirect: null,
        };
    }

    componentDidMount() {
        this.changeDate(this.props.match.params.date)
    }


    changeDate = (changedDate) => {
        // converting missing :date(yyyy-mm-dd) to a date object
        const timestamp = Date.parse(changedDate)
        let date = isNaN(timestamp) ? new Date() : new Date(timestamp)
        const dateStr = date.toLocaleDateString(global.config.locale)

        if (dateStr !== this.props.match.params.date) {
            this.setState({ redirect: dateStr })
        }
        
        this.fetchDate(date)
    }

    fetchDate = async (date) => {
        const yesterday = new Date(date)
        const tomorrow = new Date(date)
        const date_str = date.toLocaleDateString(global.config.locale)

        yesterday.setDate(date.getDate() - 1)
        tomorrow.setDate(date.getDate() + 1)

        document.title = `${date_str} comics`
        this.setState({
            yesterday: yesterday,
            today: date,
            tomorrow: tomorrow,
            strips: null,
        })

        return axios.get(`/api/${date_str}`)
            .then(response => response.data)
            .then(data => this.setState({ strips: data, redirect: null }))
            .then(() => console.log(`strips ${date_str}`, this.state.strips))

    }
    render() {
        const { classes, match } = this.props
        const { state } = this

        if (state.redirect) return <Redirect to={state.redirect} />

        if (!state.strips) return <ProgressBar />
        if (state.strips.length === 0) return (
            <Box>
                <PortalNavigation
                    navigate={this.changeDate}
                    previous={state.yesterday}
                    next={state.tomorrow}
                    current={state.today} />

                <Typography className={classes.empty} variant="body2" component={Paper}>
                    No chapters today
                </Typography>
            </Box>
        )
        return (
            <Box>
                <PortalNavigation
                    navigate={this.changeDate}
                    previous={state.yesterday}
                    next={state.tomorrow}
                    current={state.today} />

                {state.strips.map(strip => <Strip key={strip.id} {...strip} />)}




            </Box>
        )
    }
}

export default withStyles(styles)(Portal);