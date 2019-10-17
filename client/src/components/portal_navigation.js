import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import PrevIcon from '@material-ui/icons/ChevronLeftRounded'
import NextIcon from '@material-ui/icons/ChevronRightRounded'

const styles = theme => ({
    root: {
        width: "100%",
        marginBottom: "2em"
    },
    hidden: {
        visibility: "hidden"
    }
});


const PortalNavigation = ({ classes, navigate, current, previous, next }) => {
    if (!current) return null;
    const today = new Date().toLocaleDateString(global.config.locale)
    const hidden = current.toLocaleDateString(global.config.locale) >= today
    const next_str = next.toLocaleDateString(global.config.locale);
    const prev_str = previous.toLocaleDateString(global.config.locale)
    
    return (
        <Box display="flex"
            justifyContent="space-between"
            className={classes.root}>
            <Button onClick={() => navigate(prev_str)}
                variant="outlined"
                color="secondary"
            >
                <PrevIcon fontSize="small" color="primary" />
                {prev_str}
            </Button>
            <Typography variant="h5">{current.toLocaleDateString(global.config.locale)}</Typography>

            <Button onClick={() => navigate(next_str)}
                variant="outlined"
                color="primary"
                disabled={hidden}
            >
                {next_str}
                <NextIcon fontSize="small" color="secondary" />
            </Button>

        </Box>)
}
export default withStyles(styles)(PortalNavigation);