import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'


const styles = theme => ({
    root: {

    },
    guide: {
        padding: "2em"
    }
});

class Portal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { classes } = this.props

        return (
            <Box> mainpage



            </Box>
        )
    }
}

export default withStyles(styles)(Portal);