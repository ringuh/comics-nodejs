import React from 'react';
import { Redirect, Route, Switch, BrowserRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import ComicsStrips from './comics_strips'
import StripViewer from './strip_viewer'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import ProgressBar from '../../util/ProgressBar'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import WarningIcon from '@material-ui/icons/Warning';
import axios from 'axios'

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    noChapters: {
        margin: "2em auto",
        "& .MuiSvgIcon-root": {
            position: "relative",
            top: "7px",
            marginRight: "1em"
        }
    },
    gridList: {
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    titleBar: {
        textAlign: "left",
        background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    icon: {
        color: 'white',
    },
});

class ComicIndex extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            comic: {},
        };
    }

    componentDidMount() {
        console.log(this.props.match)
        this.fetchComic(this.props.match.params.alias)
    }

    fetchComic = async (alias) => {
        return axios.get(`/api/comic/${alias}`)
            .then(response => response.data)
            .then(data => this.setState({ comic: data }))
            .then(() => console.log(`comic`, this.state))
            .catch(err => {
                console.log(err.message)
                if (err.response.status === 525) {
                    console.log("Comic not found")
                    this.setState({ redirect: "/comic" })
                }


            })
    }

    render() {
        const { classes, match } = this.props
        const { state } = this

        if (state.redirect) return <Redirect to={state.redirect} />
        if (!state.comic.id) return <ProgressBar />
        if (!state.comic.strips.length)
            return (<Typography className={classes.noChapters} variant="h5" color="textSecondary">
                <WarningIcon fontSize="large" color="secondary" />
                    {state.comic.name} has no strips
                </Typography>)

        return (
            <Box>
                <Switch>
                    <Route path={`${match.path}/:order`}
                        render={(props) => <StripViewer {...props} comic={state.comic} />} />

                    <Route exact path={`${match.path}`}
                        render={(props) => <ComicsStrips {...props} comic={state.comic} />} />
                </Switch>
            </Box>
        )

    }
}

export default withStyles(styles)(ComicIndex);