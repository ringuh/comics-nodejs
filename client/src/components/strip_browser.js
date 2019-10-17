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

class StripBrowser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            strips: null,
            redirect: null,
        };
    }

    componentDidMount() {
       console.log(this.props.match.path)
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

    fetchStrips = async (strips) => {
       

        /* return axios.get(`/api/${date_str}`)
            .then(response => response.data)
            .then(data => this.setState({ strips: data, redirect: null }))
            .then(() => console.log(`strips ${date_str}`, this.state.strips))
 */
    }
    render() {
        const { classes, match } = this.props
        const { state } = this

        return(<Box>returning this</Box>)
        
    }
}

export default withStyles(styles)(StripBrowser);