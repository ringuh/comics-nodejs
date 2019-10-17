import React from 'react';
import { Redirect } from 'react-router-dom';
import LazyLoad from 'react-lazyload'
import { withStyles } from '@material-ui/core/styles';
import PortalNavigation from './portal_navigation'
import Strip from './strip'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import ProgressBar from '../util/ProgressBar'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PublicIcon from '@material-ui/icons/PublicOutlined';
import axios from 'axios'

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    heading: {
        justifyContent: "space-between",
        width: "100%"
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

class ComicStrips extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        console.log(this.props.match.path)
        this.fetchComic(this.props.match.params.alias)
    }

    fetchComic = async (alias) => {
        return axios.get(`/api/comic/${alias}`)
            .then(response => response.data)
            .then(data => this.setState({ ...data }))
            .then(() => console.log(`comic`, this.state))
    }

    render() {
        const { classes, match } = this.props
        const { state } = this

        if (!state.id) return <ProgressBar />

        return (<Box display="flex" className={classes.root}>
            <Box display="flex" className={classes.heading}>
                {/* <IconButton><StarBorderIcon /></IconButton> */}
                <Typography variant="h3" color="textSecondary" gutterBottom>
                    {state.name} ({state.strips.length})
                </Typography>
                <IconButton component="a" href={state.url}><PublicIcon color="primary" fontSize="medium" /></IconButton>
            </Box>
            <GridList cellHeight={180} cols={2} spacing={8} className={classes.gridList}>
                {state.strips.map(strip => (

                    <GridListTile key={strip.id} cols={1} rows={1}>
                        <LazyLoad height={180} once>
                            <a href={`${match.url}/${strip.order}`}>
                                <img src={strip.path_xs} alt={strip.title} />
                            </a>
                            <GridListTileBar className={classes.titleBar}
                                title={`#${strip.order} ${strip.title ? strip.title : ''}`}
                                titlePosition="top"
                                actionIcon={
                                    <IconButton className={classes.icon}>
                                        <StarBorderIcon />
                                    </IconButton>
                                }
                                actionPosition="right"
                            //subtitle="subs"

                            />
                        </LazyLoad>
                    </GridListTile>

                ))}
            </GridList>
        </Box>)

    }
}

export default withStyles(styles)(ComicStrips);