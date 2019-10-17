import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import HomeIcon from '@material-ui/icons/HomeOutlined'
import ExitIcon from '@material-ui/icons/ExitToApp'
import FavouriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import ImageIcon from '@material-ui/icons/ImageOutlined'
import ListAltIcon from '@material-ui/icons/ListAlt'
import SettingsIcon from '@material-ui/icons/SettingsApplicationsOutlined'

import Login from './login'

const styles = theme => ({
    root: {
        maxWidth: theme.breakpoints.values.lg,
        margin: "auto",
        marginBottom: theme.spacing(2),
        "& .MuiToolbar-root": {
            justifyContent: "space-between",
        },
        "& a": {
            textDecoration: "none"
        }
    },
});


const Header = (props) => {
    const { classes, location } = props
    if (location.pathname.match(/\/comic\/.*\/chapter/gi))
        return (<div className={classes.root}></div>)

    // not logged
    if (!global.user)
        return (
            <AppBar className={classes.root} color="default" position="static">
                <ToolBar>
                    <Breadcrumbs separator="">
                        <a href="/">
                            <HomeIcon color="secondary" />
                        </a>
                    </Breadcrumbs>
                    <Breadcrumbs separator="">
                        <Login />
                    </Breadcrumbs>
                </ToolBar>


            </AppBar >
        )

    // logged in
    return (
        <AppBar className={classes.root} color="default" position="static">
            <ToolBar>
                <Breadcrumbs separator="">
                    <a href="/">
                        <HomeIcon color="secondary" />
                        <Typography color="secondary">
                            Home
                        </Typography>
                    </a>
                    <a href="/comic">
                        <ImageIcon color="secondary" />
                        <Typography color="secondary">
                            Comics
                        </Typography>
                    </a>
                    <a href="/favourites">
                        <FavouriteBorderIcon color="secondary" />
                        <Typography color="secondary">
                            Favourites
                        </Typography>
                    </a>
                    <a href="/log">
                        <ListAltIcon color="secondary" />
                        <Typography color="secondary">
                            Log
                        </Typography>
                    </a>
                </Breadcrumbs>
                <Breadcrumbs separator="">
                    <Button component={Link} to="/settings">
                        <SettingsIcon color="secondary" />
                    </Button>
                    <Button component={Link} to="/logout">
                        Log out <ExitIcon color="secondary" />
                    </Button>

                </Breadcrumbs>
            </ToolBar>
        </AppBar >
    )
}

export default withRouter(withStyles(styles)(Header));