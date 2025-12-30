
import {
    Input,
    InputGroup,
    Table,
    DOMHelper,
    Stack,
    Pagination,
    IconButton,
    Badge,

} from 'rsuite';

import { useEffect, useState } from "react";
import SearchIcon from '@rsuite/icons/Search';
import PlusIcon from '@rsuite/icons/Plus';
import Link from '../../../components/Link.jsx';
// import MoreIcon from '@rsuite/icons/legacy/More';

import { ActionCell, CustomCell, ToggleCell } from './Cells.jsx';

export default function VenueList() {



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
        if (localStorage.getItem("venues")) {

            let data = localStorage.getItem("venues")
            const { pg_no, limit, searchKeyword } = JSON.parse(data)

            setPage(pg_no);
            setLimit(limit)
            setSearchKeyword(searchKeyword)
        }
        else {
            //If not available 
            localStorage.setItem("venues", JSON.stringify({ pg_no: page, limit: limit, searchKeyword: searchKeyword }))

        }
    }, [])



    //This is the main useEffect which will fetch the venuelist based on the page limit search
    useEffect(() => {
        try {

            async function getData() {

                setLoading(true)


                const url = `/api/venue/list?limit=${limit}&pg=${page}&search=${searchKeyword}`
                // console.log(url)

                let response = await fetch(url);
                response = await response.json();

                // console.log(response)

                if (response.success) {
                    setData(response.data.venues)
                    setCount(response.data.count)
                    setLoading(false);
                }
                else {
                    setLoading(false)
                }


            }

            getData();

            // ====================================

             localStorage.setItem("venues", JSON.stringify({ pg_no: page, limit: limit, searchKeyword: searchKeyword }))

            // =======================================

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


    // console.log("Search value " + searchKeyword)

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

    //toggleHandler
    const handleToggle = async (isChecked, name, _id) => {

        try {

            const url = `/api/venue/update/${_id}`

            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ [name]: isChecked })
            })

            response = await response.json();

            if (response.success) {
                // console.log(response)
                setToggleRender(!toggleRender)
            }

        } catch (error) {
            console.log("Error from handeToggle" + error)

        }
    }

    //handleDelete
    const handleDelete = async (_id) => {
        
        const choice = window.confirm("Are you sure ?")
        if(!choice){
            return;
        }

        try {

            const url = `/api/venue/delete/${_id}`

            let response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json"
                },

            })

            response = await response.json();

            if (response.success) {
                // console.log(response)
                setToggleRender(!toggleRender)
            }

        } catch (error) {
            console.log("Error from handleDelete" + error)

        }
    }



    return (

        <>
            <Stack className="table-toolbar" justifyContent="space-between">

                <IconButton icon={<PlusIcon />} appearance="primary" href="/venue/add" as={Link}>Add</IconButton>



                <Stack spacing={6}>
                    {/* <SelectPicker
                    label="Rating"
                    data={ratingList}
                    searchable={false}
                    value={rating}
                    onChange={setRating}
                /> */}



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
                <Column align="center" sortable>
                    <HeaderCell>Id</HeaderCell>
                    <Cell dataKey="_id" />
                </Column>

                <Column width={250} resizable sortable>
                    <HeaderCell>Name</HeaderCell>
                    <Cell dataKey='name' />
                    {/* <NameCell dataKey="name" /> */}
                </Column>

                <Column sortable width={120}>
                    <HeaderCell>Phone</HeaderCell>
                    <Cell dataKey='phone' />
                    {/* <NameCell dataKey="name" /> */}
                </Column>

                <Column sortable >
                    <HeaderCell>City</HeaderCell>
                    <Cell dataKey='city_name'/>
                    {/* <CustomCell dataKey='city_id' /> */}
                </Column>

                <Column sortable >
                    <HeaderCell>Locality</HeaderCell>
                    <Cell dataKey='location_name'/>

                    {/* <CustomCell dataKey='location_id' /> */}
                </Column>

                <Column>
                    <HeaderCell>Status</HeaderCell>
                    <ToggleCell dataKey={'status'} handleToggle={handleToggle} />
                </Column>


                <Column>
                    <HeaderCell>Premium</HeaderCell>
                    <ToggleCell dataKey={'premium'} handleToggle={handleToggle} />
                </Column>

                <Column>
                    <HeaderCell>Popular</HeaderCell>
                    <ToggleCell dataKey={'popular'} handleToggle={handleToggle} />
                </Column>

                <Column width={80}>
                    <HeaderCell>Images</HeaderCell>
                    <Cell>
                        {(rowData) => {
                            return <Badge color={rowData.images?.length > 0 ? "green" : "red"}></Badge>
                        }}
                    </Cell>
                </Column>


                <Column width={120} align='center'>
                    <HeaderCell>
                        Action
                    </HeaderCell>
                    <ActionCell dataKey="id" handleDelete={handleDelete} />
                </Column>
            </Table>
            {/* <Toggle/> */}

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


