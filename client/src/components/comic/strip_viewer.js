import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PortalNavigation from '../portal_navigation'
import Strip from './strip'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import PrevIcon from '@material-ui/icons/ChevronLeftRounded'
import NextIcon from '@material-ui/icons/ChevronRightRounded'
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
            comic: props.comic,
            strips: [],
            prev: null,
            next: null,

        };
    }

    componentDidMount() {
        console.log(this.props.match.params)
        console.log(this.state)

        this.changeStrip(this.props.match.params.order)

        window.addEventListener('keyup', (e) => {
            if (e.keyCode === 37 && this.state.prev) {
                this.setState({ redirect: this.state.prev })
                this.changeStrip(this.state.prev)

            }
            else if (e.keyCode === 39 && this.state.next) {
                this.setState({ redirect: this.state.next })
                this.changeStrip(this.state.next)
            }

        })
    }

    changeStrip(order) {
        if (!order) return false

        let [min, max] = order.split("-").map(nr => parseInt(nr) || 0)
        console.log(min, max)
        if (!min) return this.setState({ redirect: `../${this.state.comic.alias}` })
        if (!max) max = min
        const cstrips = this.state.comic.strips
        const strips = cstrips.filter(s => s.order >= min && s.order <= max)

        const diff = max - min
        let pMin = min - diff <= 1 ? 1 : min - diff - 1;
        let pMax = max === min ? '' : `-${pMin + diff}`;
        let nMin = max + 1
        let nMax = max === min ? '' : `-${max + 1 + diff}`
        //this.state.comic.strips.some(s => s.order > max)
        this.setState({
            prev: cstrips.some(s => s.order < min) ? `${pMin}${pMax}` : null,
            next: cstrips.some(s => s.order > max) ? `${nMin}${nMax}` : null,
            strips: strips,
            redirect: null
        });

        return true



    }

    Navigation = () => {
        return (
            <Box display="flex"
                justifyContent="space-between"
                className={this.props.classes.root}>
                {this.state.prev &&
                    <Button onClick={() => this.changeStrip(this.state.prev)}
                        component={Link}
                        to={this.state.prev}
                        variant="outlined"
                        color="secondary"
                    >
                        <PrevIcon fontSize="small" color="primary" />
                        {this.state.prev}
                    </Button>}
                <Typography variant="h5"></Typography>
                {this.state.next &&
                    <Button onClick={() => this.changeStrip(this.state.next)}
                        component={Link}
                        to={this.state.next}
                        variant="outlined"
                        color="secondary"
                    >

                        {this.state.next}
                        <NextIcon fontSize="small" color="primary" />
                    </Button>}
            </Box >
        )
    }

    ChangeLimit = () => {
        const counts = [1, 20, 50, 100];
        const [order, o2] = this.props.match.params.order.split("-").map(s => parseInt(s))
        return (
            <Box display="flex" justifyContent="center">
                <Breadcrumbs itemsAfterCollapse={2} title="Strips to show">

                    {counts.map(c => (
                        <Button color="inherit" key={c}
                            component={Link}
                            to={`${order}-${order + c - 1}`}
                            onClick={() => this.changeStrip(`${order}-${order + c - 1}`)}
                        > {c} </Button>
                    ))}
                </Breadcrumbs>
            </Box>
        )

    }

    render() {
        const { classes, match, comic } = this.props
        const { state, Navigation, ChangeLimit } = this

        const comicNoStrips = { ...comic, strips: comic.strips.length }

        if (state.redirect) return <Redirect to={state.redirect} />

        return (<Box>
            <ChangeLimit />
            <Navigation />
            {state.strips.map(strip =>
                <Strip key={strip.id} {...strip}
                    comic={comicNoStrips} />)}

            <Navigation />
            <ChangeLimit />
        </Box>)

    }
}

export default withStyles(styles)(StripBrowser);