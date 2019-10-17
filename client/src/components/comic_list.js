import React from 'react';
import { Redirect } from 'react-router-dom';
import LazyLoad from 'react-lazyload'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import ProgressBar from '../util/ProgressBar'
import MaterialTable, { MTableToolbar } from 'material-table';
/* import RedirectMe from '../util/RedirectMe' */
import axios from 'axios'

const styles = theme => ({
    root: {

    },
    empty: {
        padding: "2em"
    }
});

class ComicStrips extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        console.log(this.props.match.path)
        this.fetchComics()
    }

    fetchComics = async (alias) => {
        console.log("fetchComics")
        return axios.get(`/api/comic`)
            .then(response => response.data)
            .then(data => this.setState({ comics: data }))
            .then(() => console.log(`comics`, this.state.comics))
    }

    render() {
        const { classes, match } = this.props
        const { state } = this
        const comicsPerPage = 50
        if(state.redirect) return <Redirect to={state.redirect} />
        if (!state.comics) return <ProgressBar />
        return (
            <MaterialTable
                title={`Comics (${state.comics.length})`}
                columns={[
                    {
                        title: 'Avatar',
                        //field: 'strips[0].path',
                        render: rowData =>
                            <img src={rowData.strips[0].path_xs} style={{ width: 40, minHeight: 40, borderRadius: '35%' }} />
                    },
                    { title: 'Name', field: 'name' },
                    {
                        title: 'Last Strip',
                        field: 'last_url',
                        disableClick: true,
                        render: rowData => <a href={rowData.last_url} target="_blank" >{rowData.last_url}</a>
                    },
                    { title: 'Strips', field: 'strips.length', type: 'numeric' },
                    {
                        title: 'Last parse',
                        field: 'strips[0].updatedAt',
                        type: "datetime",
                        disableClick: true
                    },
                ]}
                data={state.comics}
                options={{
                    paging: state.comics.length > comicsPerPage,
                    pageSize: state.comics.length < comicsPerPage ? state.comics.length : comicsPerPage,
                    pageSizeOptions: [comicsPerPage, comicsPerPage * 2, comicsPerPage * 5, comicsPerPage * 20],
                    //paginationType: "stepped"
                }}
                onRowClick={(event, row, smt) => {console.log(row, row.path);
                    this.setState({ redirect: `${this.props.match.path}/${row.alias}`  })}}
            /*  data={[
                 { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63, imageUrl: 'https://avatars0.githubusercontent.com/u/7895451?s=460&v=4' },
                 { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34, imageUrl: 'https://avatars0.githubusercontent.com/u/7895451?s=460&v=4' },
             ]} */
            />
        )

    }
}

export default withStyles(styles)(ComicStrips);