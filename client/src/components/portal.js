import React from 'react';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PortalNavigation from './portal_navigation'
import Strip from './strip'
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

    componentWillReceiveProps(newProps) {
        console.log("component will receive props", this.props, newProps)
        
        setTimeout(() => this.changeDate(newProps.match.params.date), 100)
    }

    changeDate(dateStr) {
        this.setState({ redirect: null, strips: null })
        console.log(dateStr, this.state.redirect)
        const timestamp = Date.parse(dateStr)
        let date = isNaN(timestamp) ? new Date() : new Date(timestamp)
        if (dateStr !== date.toLocaleDateString(global.config.locale))
            return this.setState({ redirect: dateStr })
        this.fetchDate(date)
    }

    fetchDate = async (date) => {

        const yesterday = new Date(date)
        const tomorrow = new Date(date)
        const date_str = date.toLocaleDateString(global.config.locale)

        if (date_str !== this.props.match.params.date)
            return this.setState({ redirect: date_str })
        

        yesterday.setDate(date.getDate() - 1)
        tomorrow.setDate(date.getDate() + 1)

        document.title = `${date_str} comics`
        this.setState({
            yesterday: yesterday,
            today: date,
            tomorrow: tomorrow,
            redirect: false,
        })

        return axios.get(`/api/${date_str}`)
            .then(response => response.data)
            .then(data => this.setState({ strips: data }))
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
                    navigate={this.fetchDate}
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
                    navigate={this.fetchDate}
                    previous={state.yesterday}
                    next={state.tomorrow}
                    current={state.today} />

                {state.strips.map(strip => <Strip key={strip.id} {...strip} />)}




            </Box>
        )
    }
}

export default withStyles(styles)(Portal);