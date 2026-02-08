
import {
    Input,
    InputGroup,
    Table,
    DOMHelper,
    Stack,
    Pagination,
    IconButton,
    Tag,
    Badge,
    DateRangePicker

} from 'rsuite';


import { useEffect, useState } from "react";
import SearchIcon from '@rsuite/icons/Search';
import MobileIcon from '@rsuite/icons/Mobile';
import PcIcon from '@rsuite/icons/Pc';
import ReloadIcon from '@rsuite/icons/Reload';
import formatDate from '../../utils/formatDate.js';
import {authApi} from '../../utils/request/apiRequest.js';

export default function ConversionList() {

    const { Column, HeaderCell, Cell } = Table;
    const { getHeight } = DOMHelper;

    const [data, setData] = useState([])
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [loading, setLoading] = useState(false);

    const [count, setCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [range,setRange] = useState([])
    const [searchKeyword, setSearchKeyword] = useState('');
    const [toggleRender, setToggleRender] = useState(false);



    useEffect(() => {

        try {

            async function getData() {

                setLoading(true)


                const {data} = await authApi(`/api/conversion/getAll?limit=${limit}&pg=${page}&search=${searchKeyword}&range=${range}`)


                if (data.success) {
                    setData(data?.data.conversions)
                    setCount(data?.data.count)
                    setLoading(false);
                }
                else {
                    setLoading(false)
                }
            }

            getData();

        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    }, [page, limit, searchKeyword,range, toggleRender])

    const magicSearchFunction = (fn, d) => {
        let timmer;

        return function (value) {
            clearTimeout(timmer);

            timmer = setTimeout(() => {
                fn(value)
            }, d);
        }
    }

    const handleInputKeyword = magicSearchFunction(setSearchKeyword, 500);

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





    // console.log(filteredData())

    return (

        <>
            <Stack className="table-toolbar" justifyContent="space-between">
                <Stack spacing={12}> 
                    <IconButton icon={<ReloadIcon />} title={"refresh"} size="sm" onClick={() => setToggleRender(!toggleRender)} />

                    <DateRangePicker onChange={value=> value ? setRange(value) : setRange("")} placeholder="Select date range"/>
                </Stack>

                <Stack spacing={6}>

                    <InputGroup inside>
                        <Input placeholder="Search" onChange={value => handleInputKeyword(value)} />
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
                <Column align="center" sortable width={100}>
                    <HeaderCell>Id</HeaderCell>
                    <Cell dataKey="_id" />
                </Column>


                <Column width={250} resizable sortable>
                    <HeaderCell>url</HeaderCell>
                    <Cell dataKey='url' />
                </Column>

                <Column sortable width={150}>
                    <HeaderCell>Date</HeaderCell>
                    <Cell>
                        {rowData => (
                            <span>{formatDate(rowData.updatedAt)}</span>
                        )}
                    </Cell>
                </Column>

                <Column width={200} resizable sortable>
                    <HeaderCell>slug</HeaderCell>
                    <Cell>
                        {rowData => (<Stack spacing={12}>
                       
                            <Badge content={rowData.count} maxCount={1000}></Badge>
                            <span>{rowData.slug}</span>
                        </Stack>)}
                    </Cell>

                </Column>

                <Column width={100} resizable >
                    <HeaderCell>By</HeaderCell>
                    <Cell>
                        {
                            (rowData) => {
                                return (<Tag color={rowData.conversion_by === "form" ? "green" : "blue"}>{rowData.conversion_by}</Tag>)
                            }

                        }

                    </Cell>
                </Column>
                <Column width={100} >
                    <HeaderCell>source</HeaderCell>
                    <Cell>
                        {
                            (rowData) => {
                                return (<Tag color={rowData.source === "form" ? "green" : "blue"}>{rowData.source}</Tag>)
                            }

                        }

                    </Cell>
                </Column>
                <Column width={100} align='center'>
                    <HeaderCell>Platform</HeaderCell>
                    <Cell>
                       {
                        (rowData ) => (
                            rowData.platform === "des" ? <PcIcon/> : <MobileIcon/>
                        )
                       }
                    </Cell>
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