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


export default function SiteUserList() {

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
    const [filterActive, setFilterActive] = useState('');

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

                let url = `/api/siteUser/list?limit=${limit}&pg=${page}&search=${searchKeyword}&range=${range}`;
                if (filterActive !== '') {
                    url += `&isActive=${filterActive}`;
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
    }, [page, limit, searchKeyword, range, toggleRender, filterActive]);

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
                            { label: 'Active', value: true },
                            { label: 'Inactive', value: false }
                        ]}
                        placeholder="Filter by Status"
                        style={{ width: 160 }}
                        value={filterActive}
                        onChange={value => setFilterActive(value !== null ? value : '')}
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
                    <HeaderCell>Full Name</HeaderCell>
                    <Cell dataKey='fullName' />
                </Column>

                <Column width={200} resizable sortable>
                    <HeaderCell>Email</HeaderCell>
                    <Cell dataKey='email' />
                </Column>

                <Column width={120} resizable sortable>
                    <HeaderCell>Phone</HeaderCell>
                    <Cell dataKey='phone' />
                </Column>

                <Column width={100} resizable sortable>
                    <HeaderCell>Gender</HeaderCell>
                    <Cell dataKey='gender' />
                </Column>

                <Column width={100} resizable sortable>
                    <HeaderCell>City</HeaderCell>
                    <Cell dataKey='city' />
                </Column>

                <Column width={100} resizable sortable align='center'>
                    <HeaderCell>Active</HeaderCell>
                    <Cell>
                        {rowData => (
                            <Tag color={rowData.isActive ? "green" : "red"}>
                                {rowData.isActive ? "Active" : "Inactive"}
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

            {/* View Site User Modal */}
            <Modal open={viewModal} onClose={handleViewClose} size="sm">
                <Modal.Header>
                    <Modal.Title>Site User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {viewUser && (
                        <List bordered>
                            <List.Item>
                                <strong>ID:</strong> {viewUser._id}
                            </List.Item>
                            <List.Item>
                                <strong>Full Name:</strong> {viewUser.fullName || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Email:</strong> {viewUser.email || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Phone:</strong> {viewUser.phone || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Date of Birth:</strong> {viewUser.dateOfBirth || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Gender:</strong> {viewUser.gender || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>City:</strong> {viewUser.city || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Date of Marriage:</strong> {viewUser.dateOfMarriage || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Active:</strong>{' '}
                                <Tag color={viewUser.isActive ? "green" : "red"}>
                                    {viewUser.isActive ? "Active" : "Inactive"}
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
