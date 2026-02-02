
import {
    Input,
    InputGroup,
    Table,
    DOMHelper,
    Stack,
    Pagination,
    IconButton,
    Tag,
    ButtonToolbar,
    SelectPicker,

} from 'rsuite';

import formatDate from '../../utils/formatDate.js';
import { useEffect, useState } from "react";
import SearchIcon from '@rsuite/icons/Search';
import PlusIcon from '@rsuite/icons/Plus';
import { ActionCell } from './Cells';
import PaginationComp from '../../components/common/PaginationComp';
import AddUserModal from './AddUserModal';
import toast from 'react-hot-toast';
import { authApi } from '../../utils/request/apiRequest';
import UpdateUserModal from './UpdateUserModal';



export default function UserList() {

    const role = [
        { label: "SuperAdmin", value: "superAdmin" },
        { label: "Admin", value: "admin" },
        { label: "Sales", value: "sales" },
    ]

    const [opanAddUserModal, setOpenAddUserModal] = useState(false);
    const [opanUpdateUserModal, setOpenUpdateUserModal] = useState(false);
    const [updateUserData, setUpdateUserData] = useState({})

    const { Column, HeaderCell, Cell } = Table;
    const { getHeight } = DOMHelper;

    const [data, setData] = useState([])
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [loading, setLoading] = useState(false);

    const [count, setCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    const [searchRole, setSearchRole] = useState("");
    const [searchKeyword, setSearchKeyword] = useState('');
    const [toggleRender, setToggleRender] = useState(false);
    const refetch = () => setToggleRender(!toggleRender);

    useEffect(() => {

        try {

            async function getData() {

                setLoading(true)

                // const url = `${import.meta}/api/venue/page/list?limit=${limit}&pg=${page}&search=${searchKeyword}`


                const { data } = await authApi(`/api/adminUser/read-all?search=${searchKeyword}&limit=${limit}&pg=${page}&role=${searchRole || ""}`)

                if (data.success) {
                    setData(data.users)
                    setCount(data.count || 0)
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
    }, [page, limit, searchKeyword, toggleRender, searchRole])


    const magicSearchFunction = (fn, d) => {
        let timmer;

        return function (value) {
            clearTimeout(timmer);

            timmer = setTimeout(() => {
                fn(value)
            }, d);
        }
    }

    const handleInputKeyword = magicSearchFunction(setSearchKeyword, 300);

    const handleSortColumn = (sortColumn, sortType) => {
        setSortColumn(sortColumn);
        setSortType(sortType);
    };

    const filteredData = () => {

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
        if (!choice) {
            return;
        }
        try {

            const url = `/user/${_id}`

            const { data } = await authApi.delete(url);

            if (data.success) {
                toast.success(data.message)
                setToggleRender(!toggleRender)
            }

        } catch (error) {
            console.log("Error from handleDelete" + error)
            toast.error(error.message)


        }
    }


    const handleClose = () => {
        setOpenAddUserModal(false);
        setOpenUpdateUserModal(false)
    }

    //update active inactive
    const updateStatus = async (_id, status) => {
        try {

            const url = `/user/${_id}`;

            const { data } = await authApi.put(url, {
                status
            })

            if (data.success) {
                toast.success("Status updated")
                refetch();
            }
            else {
                toast.error("Something went wround")
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
    }

    const updateUser = (data) => {
        console.log(data)
        setUpdateUserData(data);
        setOpenUpdateUserModal(true);
    }

    return (

        <>
            <Stack className="table-toolbar" justifyContent="space-between">

                <ButtonToolbar>
                    <IconButton icon={<PlusIcon />} appearance="primary" onClick={e => setOpenAddUserModal(true)}>Create User</IconButton>
                    {/* <IconButton icon={<ReloadIcon />} onClick={e => setToggleRender(!toggleRender)} /> */}

                </ButtonToolbar>


                <Stack spacing={6}>

                    <SelectPicker
                        data={role}
                        searchable={false}
                        placeholder="Select Role"
                        value={searchRole}
                        onChange={(value) => setSearchRole(value)}
                    />

                    <InputGroup inside>
                        <Input placeholder="Search" onChange={value => handleInputKeyword(value)} />
                        <InputGroup.Addon>
                            <SearchIcon />
                        </InputGroup.Addon>
                    </InputGroup>
                </Stack>


            </Stack>

            <Table
                virtualized
                height={Math.max(getHeight(window) - 300, 450)}
                data={filteredData()}
                loading={loading}
                sortColumn={sortColumn}
                sortType={sortType}
                onSortColumn={handleSortColumn}

            >
               
                <Column sortable width={150}>
                    <HeaderCell>Role</HeaderCell>
                    <Cell dataKey='role' />
                </Column>
                <Column sortable width={200}>
                    <HeaderCell>Name</HeaderCell>
                    <Cell dataKey="name" />
                </Column>
                <Column sortable width={150}>
                    <HeaderCell>Phone</HeaderCell>
                    <Cell dataKey='phone' />
                </Column>
                <Column sortable width={200}>
                    <HeaderCell>Email</HeaderCell>
                    <Cell dataKey='email' />
                </Column>
                <Column width={150} sortable>
                    <HeaderCell>Last Login</HeaderCell>
                    <Cell>
                        {rowData => {
                            const lastLoginArray = rowData?.lastLogin;
                            const lastLogin = lastLoginArray?.length > 0
                                ? lastLoginArray[lastLoginArray.length - 1]
                                : null;
                            return (
                                <span>{lastLogin ? formatDate(lastLogin) : '--'}</span>
                            );
                        }}
                    </Cell>
                </Column>

                <Column sortable >
                    <HeaderCell>Status</HeaderCell>
                    <Cell>
                        {(rowData) => {
                            return (<Tag color={`${rowData.status === "active" ? "green" : "red"}`}>{rowData.status}</Tag>)
                        }}
                    </Cell>
                </Column>




                <Column width={120} align='center'>
                    <HeaderCell>
                        Action
                    </HeaderCell>
                    <ActionCell handleDelete={handleDelete} updateStatus={updateStatus} updateUser={updateUser} />
                    {/* <Cell><MoreIcon /></Cell> */}
                    {/* <ActionCell dataKey="id" handleDelete={handleDelete}/> */}
                </Column>
            </Table>

            <PaginationComp {...{ count, limit, page, setPage, handleChangeLimit }} />

            {/* Modal */}
            <AddUserModal handleClose={handleClose} open={opanAddUserModal} refetch={refetch} />
            <UpdateUserModal handleClose={handleClose} open={opanUpdateUserModal} refetch={refetch} updateUserData={updateUserData} />
        </>

    )


}


