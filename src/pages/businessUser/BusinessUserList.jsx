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
    DateRangePicker,
    SelectPicker,
    Modal,
    List,
    Button
} from 'rsuite';

import { useEffect, useState } from "react";
import SearchIcon from '@rsuite/icons/Search';
import ReloadIcon from '@rsuite/icons/Reload';
import { ActionCell } from './Cells.jsx';
import formatDate from '../../utils/formatDate.js';
import { authApi } from '../../utils/request/apiRequest.js';


export default function BusinessUserList() {

    const { Column, HeaderCell, Cell } = Table;
    const { getHeight } = DOMHelper;

    const [data, setData] = useState([]);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [loading, setLoading] = useState(false);

    const [count, setCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [range, setRange] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [toggleRender, setToggleRender] = useState(false);
    const [filterVerified, setFilterVerified] = useState('');

    const [viewModal, setViewModal] = useState(false);
    const [viewUser, setViewUser] = useState(null);

    const handleView = (user) => {
        setViewUser(user);
        setViewModal(true);
    };

    const handleViewClose = () => {
        setViewModal(false);
        setViewUser(null);
    };

    useEffect(() => {
        try {
            async function getData() {
                setLoading(true);

                let url = `/api/businessUser/list?limit=${limit}&pg=${page}&search=${searchKeyword}&range=${range}`;
                if (filterVerified !== '') {
                    url += `&isVerified=${filterVerified}`;
                }

                let { data } = await authApi(url);

                if (data.success) {
                    setData(data.data.users || data.data);
                    setCount(data.data.count || 0);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            }

            getData();
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }, [page, limit, searchKeyword, range, toggleRender, filterVerified]);

    const magicSearchFunction = (fn, d) => {
        let timmer;
        return function (value) {
            clearTimeout(timmer);
            timmer = setTimeout(() => {
                fn(value);
            }, d);
        };
    };

    const handleInputKeyword = magicSearchFunction(setSearchKeyword, 500);

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

    return (
        <>
            <Stack className="table-toolbar" justifyContent="space-between">
                <ButtonToolbar>
                    <IconButton icon={<ReloadIcon />} title={"refresh"} size="sm" onClick={() => setToggleRender(!toggleRender)} />
                    <DateRangePicker onChange={value => value ? setRange(value) : setRange("")} placeholder="Select date range" />
                </ButtonToolbar>

                <Stack spacing={6}>
                    <SelectPicker
                        data={[
                            { label: 'Verified', value: true },
                            { label: 'Unverified', value: false }
                        ]}
                        placeholder="Filter by Verified"
                        style={{ width: 170 }}
                        value={filterVerified}
                        onChange={value => setFilterVerified(value !== null ? value : '')}
                        searchable={false}
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
                height={Math.max(getHeight(window) - 300, 450)}
                data={filteredData()}
                loading={loading}
                sortColumn={sortColumn}
                sortType={sortType}
                onSortColumn={handleSortColumn}
            >
                <Column align="center" sortable width={80}>
                    <HeaderCell>Id</HeaderCell>
                    <Cell dataKey="_id" />
                </Column>

                <Column width={150} sortable>
                    <HeaderCell>Date</HeaderCell>
                    <Cell>
                        {rowData => (
                            <span>{formatDate(rowData.createdAt)}</span>
                        )}
                    </Cell>
                </Column>

                <Column width={150} resizable sortable>
                    <HeaderCell>Business Name</HeaderCell>
                    <Cell dataKey='businessName' />
                </Column>

                <Column width={120} resizable sortable>
                    <HeaderCell>Business Type</HeaderCell>
                    <Cell dataKey='businessType' />
                </Column>

                <Column width={120} resizable sortable>
                    <HeaderCell>Category</HeaderCell>
                    <Cell dataKey='category' />
                </Column>

                <Column width={130} resizable sortable>
                    <HeaderCell>Owner Name</HeaderCell>
                    <Cell dataKey='ownerName' />
                </Column>

                <Column width={120} resizable sortable>
                    <HeaderCell>Phone</HeaderCell>
                    <Cell dataKey='phone' />
                </Column>

                <Column width={180} resizable sortable>
                    <HeaderCell>Email</HeaderCell>
                    <Cell dataKey='email' />
                </Column>

                <Column width={100} resizable sortable>
                    <HeaderCell>City</HeaderCell>
                    <Cell dataKey='city' />
                </Column>

                <Column width={100} resizable sortable align='center'>
                    <HeaderCell>Verified</HeaderCell>
                    <Cell>
                        {rowData => (
                            <Tag color={rowData.isVerified ? "green" : "red"}>
                                {rowData.isVerified ? "Verified" : "Unverified"}
                            </Tag>
                        )}
                    </Cell>
                </Column>

                <Column width={100} align='center'>
                    <HeaderCell>Action</HeaderCell>
                    <ActionCell
                        dataKey="id"
                        handleView={handleView}
                    />
                </Column>
            </Table>

            <div style={{ padding: "10px 20px" }}>
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

            {/* View Business User Modal */}
            <Modal open={viewModal} onClose={handleViewClose} size="sm">
                <Modal.Header>
                    <Modal.Title>Business User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {viewUser && (
                        <List bordered>
                            <List.Item>
                                <strong>ID:</strong> {viewUser._id}
                            </List.Item>
                            <List.Item>
                                <strong>Business Name:</strong> {viewUser.businessName || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Business Type:</strong> {viewUser.businessType || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Category:</strong> {viewUser.category || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Owner Name:</strong> {viewUser.ownerName || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Phone:</strong> {viewUser.phone || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Email:</strong> {viewUser.email || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>City:</strong> {viewUser.city || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Address:</strong> {viewUser.address || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Verified:</strong>{' '}
                                <Tag color={viewUser.isVerified ? "green" : "red"}>
                                    {viewUser.isVerified ? "Verified" : "Unverified"}
                                </Tag>
                            </List.Item>
                            <List.Item>
                                <strong>Created At:</strong> {viewUser.createdAt ? formatDate(viewUser.createdAt) : '--'}
                            </List.Item>
                        </List>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleViewClose} appearance="primary">
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
