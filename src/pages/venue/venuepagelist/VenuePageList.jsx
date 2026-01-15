
import {
    Input,
    InputGroup,
    Table,
    DOMHelper,
    Stack,
    Pagination,
    IconButton,

} from 'rsuite';


import { useEffect, useState } from "react";
import SearchIcon from '@rsuite/icons/Search';
import PlusIcon from '@rsuite/icons/Plus';
// import { ActionCell } from './Cells';
import { ActionCell } from './Cells.jsx';
import Link from '../../../components/Link.jsx';
import { authApi } from '../../../utils/request/apiRequest.js';

export default function VenuePageList() {

    const { Column, HeaderCell, Cell } = Table;
    const { getHeight } = DOMHelper;

    const [data, setData] = useState([])
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [loading, setLoading] = useState(false);

    const [count, setCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [toggleRender, setToggleRender] = useState(false);


    //This useEffect will run and check for the local storage data if availabe then assing to the state else it will create the new on local stroage
    useEffect(() => {

        //Check if local storage is available
        if (localStorage.getItem("venue-page")) {

            let data = localStorage.getItem("venue-page")
            const { pg_no, limit, searchKeyword } = JSON.parse(data)

            setPage(pg_no);
            setLimit(limit)
            setSearchKeyword(searchKeyword)
        }
        else {
            //If not available 
            localStorage.setItem("venue-page", JSON.stringify({ pg_no: page, limit: limit, searchKeyword: searchKeyword }))

        }
    }, [])


    useEffect(() => {

        try {

            async function getData() {

                setLoading(true)

                
                const url = `/api/venue/page/list?limit=${limit}&pg=${page}&search=${searchKeyword}`

                let {data} = await authApi.get(url);
                // console.log(data)
                if (data.success) {
                    setData(data.data.venuePages)
                    setCount(data.data.count)
                    setLoading(false);
                }
                else {
                    setLoading(false)
                }


            }

            getData();

            localStorage.setItem("venue-page", JSON.stringify({ pg_no: page, limit: limit, searchKeyword: searchKeyword }))


        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    }, [page, limit, searchKeyword, toggleRender])


    const magicSearchFunction = (fn, d) => {
        let timmer;

        return function (value) {
            clearTimeout(timmer);

            timmer = setTimeout(() => {
                fn(value)
            }, d);
        }
    }

    const handleInputKeyword = magicSearchFunction(setSearchKeyword, null);

    const handleSortColumn = (sortColumn, sortType) => {
        setSortColumn(sortColumn);
        setSortType(sortType);
    };

    const filteredData = () => {
        // const filtered = data.filter(item => {
        //     if (!item.name.includes(searchKeyword)) {
        //         return false;
        //     }

        //     if (rating && item.rating !== rating) {
        //         return false;
        //     }

        //     return true;
        // });

        if (sortColumn && sortType) {
            return data.sort((a, b) => {
                let x = a[sortColumn];
                let y = b[sortColumn];

                if (typeof x === 'string') {
                    x = x.charCodeAt(0);
                }
                if (typeof y === 'string') {
                    y = y.charCodeAt(0);
                }

                if (sortType === 'asc') {
                    return x - y;
                } else {
                    return y - x;
                }
            });
        }
        return data;
    };


    const handleChangeLimit = dataKey => {
        setPage(1);
        setLimit(dataKey);
    };


    //handleDelete
    const handleDelete = async (_id) => {
        const choice = window.confirm("Are you sure ?")
        if(!choice){
            return;
        }
        try {

            const url = `/api/venue/page/delete/${_id}`
            const {data} = await authApi.delete(url);

            if (data.success) {
                // console.log(data)
                setToggleRender(!toggleRender)
            }

        } catch (error) {
            console.log("Error from handleDelete" + error)

        }
    }





    return (

        <>
            <Stack className="table-toolbar" justifyContent="space-between">

                <IconButton icon={<PlusIcon />} as={Link} href={"/venue-page/create"} appearance="primary">Add</IconButton>



                <Stack spacing={6}>

                    <InputGroup inside>
                        <Input placeholder="Search" value={searchKeyword} onChange={value => handleInputKeyword(value)} />
                        <InputGroup.Addon>
                            <SearchIcon />
                        </InputGroup.Addon>
                    </InputGroup>

                </Stack>


            </Stack>



            <Table
                // virtualized
                height={Math.max(getHeight(window) - 300, 450)}
                data={filteredData()}
                loading={loading}
                sortColumn={sortColumn}
                sortType={sortType}
                onSortColumn={handleSortColumn}
            >
                <Column width={100} align="center" sortable>
                    <HeaderCell>Id</HeaderCell>
                    <Cell dataKey="_id" />
                </Column>

                <Column width={250} resizable sortable>
                    <HeaderCell>URL</HeaderCell>
                    <Cell dataKey='url' />
                    {/* <NameCell dataKey="name" /> */}
                </Column>

                <Column sortable width={150}>
                    <HeaderCell>Category</HeaderCell>
                    <Cell dataKey='category' />
                    {/* <NameCell dataKey="name" /> */}
                </Column>
                <Column sortable width={150}>
                    <HeaderCell>City</HeaderCell>
                    <Cell dataKey='city' />
                    {/* <NameCell dataKey="name" /> */}
                </Column>
                <Column sortable width={150}>
                    <HeaderCell>Locality</HeaderCell>
                    <Cell dataKey='location' />
                    {/* <NameCell dataKey="name" /> */}
                </Column>

                <Column width={120} align='center'>
                    <HeaderCell>
                        Action
                    </HeaderCell>
                    <ActionCell dataKey="id" handleDelete={handleDelete}/>
                </Column>
            </Table>



            <div style={{ padding: "10px 20px", }}>
                <Pagination
                    prev
                    next
                    first
                    last
                    ellipsis
                    boundaryLinks
                    maxButtons={5}
                    size="xs"
                    layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                    total={count}
                    limitOptions={[10, 30, 50]}
                    limit={limit}
                    activePage={page}
                    onChangePage={setPage}
                    onChangeLimit={handleChangeLimit}
                />
            </div>


 


        </>

    )


}