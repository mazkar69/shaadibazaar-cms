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
    Whisper,
    Tooltip,
    Modal,
    List,
    Button
} from 'rsuite';
import InfoOutlineIcon from '@rsuite/icons/InfoOutline';

import { useEffect, useState } from "react";
import SearchIcon from '@rsuite/icons/Search';
import ReloadIcon from '@rsuite/icons/Reload';
import { ActionCell } from './Cells.jsx';
import formatDate from '../../utils/formatDate.js';
import { authApi } from '../../utils/request/apiRequest.js';


export default function ContactUsList() {

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

    const [viewModal, setViewModal] = useState(false);
    const [viewContact, setViewContact] = useState(null);

    const handleView = (contact) => {
        setViewContact(contact);
        setViewModal(true);
    };

    const handleViewClose = () => {
        setViewModal(false);
        setViewContact(null);
    };

    useEffect(() => {
        try {
            async function getData() {
                setLoading(true);

                const url = `/api/contactus/list?limit=${limit}&pg=${page}&search=${searchKeyword}&range=${range}`;

                let { data } = await authApi(url);

                if (data.success) {
                    setData(data.data.contacts || data.data);
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
    }, [page, limit, searchKeyword, range, toggleRender]);

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

    // Update status
    const handleUpdateStatus = async (_id, status) => {
        try {
            const url = `/api/contactus/update/${_id}`;
            const { data } = await authApi.post(url, { status });

            if (data.success) {
                setToggleRender(!toggleRender);
            }
        } catch (error) {
            console.log("Error from handleUpdateStatus: " + error);
        }
    };

    return (
        <>
            <Stack className="table-toolbar" justifyContent="space-between">
                <ButtonToolbar>
                    <IconButton icon={<ReloadIcon />} title={"refresh"} size="sm" onClick={() => setToggleRender(!toggleRender)} />
                    <DateRangePicker onChange={value => value ? setRange(value) : setRange("")} placeholder="Select date range" />
                </ButtonToolbar>

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
                    <HeaderCell>Name</HeaderCell>
                    <Cell dataKey='name' />
                </Column>

                <Column width={200} resizable sortable>
                    <HeaderCell>Email</HeaderCell>
                    <Cell dataKey='email' />
                </Column>

                <Column width={200} resizable sortable>
                    <HeaderCell>Subject</HeaderCell>
                    <Cell dataKey='subject' />
                </Column>

                <Column width={200} resizable>
                    <HeaderCell>Message</HeaderCell>
                    <Cell>
                        {rowData => (
                            rowData?.message ? (
                                <Whisper
                                    trigger="click"
                                    placement="auto"
                                    speaker={
                                        <Tooltip>
                                            {rowData.message}
                                        </Tooltip>
                                    }
                                >
                                    <IconButton
                                        icon={<InfoOutlineIcon />}
                                        appearance="subtle"
                                        size="xs"
                                        color="blue"
                                    />
                                </Whisper>
                            ) : (
                                <span>--</span>
                            )
                        )}
                    </Cell>
                </Column>

                <Column width={100} resizable sortable align='center'>
                    <HeaderCell>Status</HeaderCell>
                    <Cell>
                        {rowData => (
                            <Tag color={rowData.status === "resolved" ? "green" : rowData.status === "reviewed" ? "orange" : "blue"}>
                                {rowData.status}
                            </Tag>
                        )}
                    </Cell>
                </Column>

                <Column width={150} align='center'>
                    <HeaderCell>Action</HeaderCell>
                    <ActionCell
                        dataKey="id"
                        handleUpdateStatus={handleUpdateStatus}
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

            {/* View Contact Modal */}
            <Modal open={viewModal} onClose={handleViewClose} size="sm">
                <Modal.Header>
                    <Modal.Title>Contact Us Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {viewContact && (
                        <List bordered>
                            <List.Item>
                                <strong>ID:</strong> {viewContact._id}
                            </List.Item>
                            <List.Item>
                                <strong>Name:</strong> {viewContact.name || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Email:</strong> {viewContact.email || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Subject:</strong> {viewContact.subject || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Message:</strong> {viewContact.message || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Status:</strong>{' '}
                                <Tag color={viewContact.status === "resolved" ? "green" : viewContact.status === "reviewed" ? "orange" : "blue"}>
                                    {viewContact.status}
                                </Tag>
                            </List.Item>
                            <List.Item>
                                <strong>Created At:</strong> {viewContact.createdAt ? formatDate(viewContact.createdAt) : '--'}
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
