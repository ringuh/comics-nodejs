import React from 'react';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import LazyLoad from 'react-lazyload'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box'
import axios from 'axios'
import FavoriteIcon from '@material-ui/icons/FavoriteRounded'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorderRounded'
import ThumbDownIcon from '@material-ui/icons/ThumbDownOutlined'
import ThumbUpIcon from '@material-ui/icons/ThumbUpOutlined'
import PublicIcon from '@material-ui/icons/PublicOutlined'

const styles = theme => ({
    root: {
        width: "100%",
        margin: "2em auto",
        "& img": {
            maxWidth: "100%"
        }
    },
    title: {
        textAlign: "left",
        "& :nth-child(2)": {
            marginLeft: "1em"
        },
        "& :nth-child(3)": {
            float: "right",
            marginLeft: "1em"
        }
    }
});


class Strip extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {}
    }

    componentDidMount() {
        console.log()

    }


    fetchDate = async (date) => {


    }
    render() {
        const { classes, raw_src, order, page_url, path, comic, title } = this.props
        const { state } = this

        return (
            <Card className={classes.root}>
                <LazyLoad height={300}  once>
                    <CardActionArea>
                        <CardContent className={classes.title}>
                            <Typography gutterBottom variant="h6" component="span">
                                <Button component={Link} to={`/comic/${comic.alias}/${order}`}>
                                    {comic.name} - {order}
                                </Button>
                            </Typography>
                            <Typography gutterBottom variant="body2" color="textSecondary" component="span">
                                {title}
                            </Typography>
                            <Button component="a"
                                variant="outlined"
                                color="default"
                                target="_blank"
                                href={page_url}>
                                <PublicIcon color="primary" />
                            </Button>
                        </CardContent>
                        <img src={path} />
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary">
                            <ThumbUpIcon color="inherit" />
                        </Button>
                        <Button size="small" color="primary">
                            <ThumbDownIcon color="inherit" />
                        </Button>
                        <Button size="small" color="primary">
                            <FavoriteBorderIcon color="inherit" />
                        </Button>
                        <Button size="small" color="primary">
                            <FavoriteBorderIcon color="inherit" />
                        </Button>
                    </CardActions>
                </LazyLoad>
            </Card>
        )
    }
}

export default withStyles(styles)(Strip);