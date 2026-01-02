import {
    Input,
    InputGroup,
    Table,
    DOMHelper,
    Stack,
    Pagination,
    IconButton,
    Tag,
    Drawer,
    Button,
    Form,
    DatePicker,
    ButtonToolbar,
    DateRangePicker,
    SelectPicker,
    Textarea,
    Whisper,
    Tooltip,
    Modal,
    List
} from 'rsuite';
import InfoOutlineIcon from '@rsuite/icons/InfoOutline';


import { useEffect, useState } from "react";
import SearchIcon from '@rsuite/icons/Search';
import PlusIcon from '@rsuite/icons/Plus';
import ReloadIcon from '@rsuite/icons/Reload';
import { ActionCell } from './Cells.jsx';
import formatDate from '../../utils/formatDate.js';
import api, { authApi } from '../../utils/request/apiRequest.js';


export default function LeadList() {

    const { Column, HeaderCell, Cell } = Table;
    const { getHeight } = DOMHelper;


    const [data, setData] = useState([])
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [loading, setLoading] = useState(false);

    const [count, setCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [range, setRange] = useState([])
    const [viewModal, setViewModal] = useState(false);
    const [viewLead, setViewLead] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [toggleRender, setToggleRender] = useState(false);
    const [filterAssignedTo, setFilterAssignedTo] = useState('');

    const [openModal, setOpenModal] = useState(false);
    const [users, setUsers] = useState([]);


    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        event_date: null,
        no_of_guest: 0,
        city: "",
        location: "",
        assigned_to: "",
        remark: ""
    })
    const [id, setId] = useState()       //use to update the lead
    const [modalType, setModalType] = useState("Add")



    const handleOpen = (id = null, name = "", phone = "", event_date = null, no_of_guest = 0, city = "", location = "", assigned_to = "", remark = "", type = "Add") => {

        setId(id);
        setFormData({
            name, phone, event_date, no_of_guest, city, location, assigned_to: assigned_to?._id || "", remark
        })
        setModalType(type);

        setOpenModal(true);
    }

    const handleClose = () => setOpenModal(false);

    const handleView = (lead) => {
        setViewLead(lead);
        setViewModal(true);
    }

    const handleViewClose = () => {
        setViewModal(false);
        setViewLead(null);
    }


    useEffect(() => {

        try {

            async function getData() {

                setLoading(true)


                const url = `/api/leads/allLeads?limit=${limit}&pg=${page}&search=${searchKeyword}&range=${range}&assigned_to=${filterAssignedTo}`

                let { data } = await authApi(url)

                if (data.success) {
                    setData(data.data.leads)
                    setCount(data.data.count)
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
    }, [page, limit, searchKeyword, range, toggleRender, filterAssignedTo])

    // Fetch users for assignment
    useEffect(() => {
        async function fetchUsers() {
            try {
                const { data } = await authApi('/api/adminUser/read-all?role=sales');
                if (data.success) {
                    setUsers(data.users.map(user => ({ label: user.name, value: user._id })));
                }
            } catch (error) {
                console.log('Error fetching users:', error);
            }
        }
        fetchUsers();
    }, [])

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

        try {

            const url = `/api/leads/delete/${_id}`

            const { data } = await authApi.delete(url)

            if (data.success) {
                setToggleRender(!toggleRender)
            }

        } catch (error) {
            console.log("Error from handleDelete" + error)

        }
    }

    //handleUpdate
    const handleUpdateStatus = async (_id, status) => {
        try {

            const url = `/api/leads/update/${_id}`

            const { data } = await authApi.put(url, { status })


            if (data.success) {
                // console.log(response)
                setToggleRender(!toggleRender)
            }

        } catch (error) {
            console.log("Error from handleDelete" + error)

        }
    }

    //Used in Add or Update Lead
    const handleAddLead = async () => {
        try {

            if (!formData.phone || formData.phone.length !== 10) {
                // console.log("Inside if")
                return;
            }

            if (modalType === "Update") {
                // console.log("Inside Update Lead")
                const url = `/api/leads/update/${id}`
                const { data } = await authApi.put(url, formData)
                if (data.success) {
                    setToggleRender(!toggleRender)      //Refresh the data
                    setFormData({       //Resert the form
                        name: "",
                        phone: "",
                        event_date: null,
                        no_of_guest: 0,
                        city: "",
                        location: "",
                        assigned_to: "",
                        remark: ""
                    })
                    handleClose();      //Close the form
                }
                return;
            }




            const { data } = await api.post('/api/leads/create/', formData)
            if (data.success) {
                // console.log(response)
                setToggleRender(!toggleRender)      //Refresh the data
                setFormData({       //Resert the form
                    name: "",
                    phone: "",
                    event_date: null,
                    no_of_guest: 0,
                    city: "",
                    location: "",
                    assigned_to: "",
                    remark: ""
                })
                handleClose();      //Close the form
            }

        } catch (error) {
            console.log("Error from handleCreateLead" + error)
            alert("Something went wroung")

        }
    }


    return (

        <>
            <Stack className="table-toolbar" justifyContent="space-between">

                <ButtonToolbar>
                    <IconButton icon={<PlusIcon />} appearance="primary" onClick={e => handleOpen(true)}>Add</IconButton>
                    <IconButton icon={<ReloadIcon />} title={"refresh"} size="sm" onClick={() => setToggleRender(!toggleRender)} />
                    <DateRangePicker onChange={value => value ? setRange(value) : setRange("")} placeholder="Select date range" />

                </ButtonToolbar>



                <Stack spacing={6}>
                    <SelectPicker
                        data={users}
                        placeholder="Filter by Assigned"
                        style={{ width: 180 }}
                        value={filterAssignedTo}
                        onChange={value => setFilterAssignedTo(value || '')}
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
                // virtualized
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
                            <span>{formatDate(rowData.updatedAt)}</span>
                        )}
                    </Cell>
                </Column>



                <Column width={120} resizable sortable>
                    <HeaderCell>Phone</HeaderCell>
                    <Cell dataKey='phone' />
                </Column>

                <Column width={120} resizable sortable>
                    <HeaderCell>Name</HeaderCell>
                    <Cell dataKey='name' />
                    {/* <NameCell dataKey="name" /> */}
                </Column>

                <Column width={200} resizable sortable>
                    <HeaderCell>preference</HeaderCell>
                    <Cell dataKey='preference' />
                    {/* <NameCell dataKey="name" /> */}
                </Column>


                <Column width={80} resizable sortable align='center'>
                    <HeaderCell>Count</HeaderCell>
                    <Cell dataKey='submissionCount' />
                </Column>

                <Column width={120} resizable sortable align='center'>
                    <HeaderCell>Assigned</HeaderCell>
                    <Cell >
                        {rowData => (
                            <span className='text-center'>{rowData?.assigned_to?.name || "--"}</span>
                        )}
                    </Cell>
                </Column>

                <Column width={100} resizable sortable align='center'>
                    <HeaderCell>Remark</HeaderCell>
                    <Cell>
                        {rowData => (
                            rowData?.remark ? (
                                <Whisper
                                    trigger="click"
                                    placement="auto"
                                    speaker={
                                        <Tooltip>
                                            {rowData.remark}
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



                <Column width={100} align='center'>
                    <HeaderCell>Action</HeaderCell>
                    <ActionCell
                        dataKey="id"
                        handleDelete={handleDelete}
                        handleUpdateStatus={handleUpdateStatus}
                        handleOpen={handleOpen}
                        handleView={handleView}
                    />
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


            <Drawer backdrop={"static"} open={openModal} onClose={handleClose}>
                <Drawer.Header>
                    <Drawer.Title>{modalType} Lead</Drawer.Title>
                    <Drawer.Actions>
                        <Button onClick={() => handleClose()}>Cancel</Button>
                        <Button appearance="primary" onClick={handleAddLead}>
                            {modalType} Leads
                        </Button>
                    </Drawer.Actions>
                </Drawer.Header>
                <Drawer.Body>
                    <Form fluid onChange={setFormData} formDefaultValue={formData}>
                        <Form.Stack spacing={20}>
                            <Stack justifyContent="space-between">
                                <Form.Group controlId="name">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control name="name" style={{ width: 200 }} />
                                    <Form.Text>Name is required</Form.Text>
                                </Form.Group>
                                <Form.Group controlId="phone">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control name="phone" type="number" style={{ width: 200 }} />
                                    <Form.Text>Phone is required</Form.Text>
                                </Form.Group>
                            </Stack>

                            <Stack justifyContent="space-between">
                                <Form.Group controlId="event_date">
                                    <Form.Label>Event Date</Form.Label>
                                    <Form.Control name="event_date" oneTap format="dd.MM.yyyy" style={{ width: 200 }} accepter={DatePicker} />
                                </Form.Group>
                                <Form.Group controlId="no_of_guest">
                                    <Form.Label>Total Guest</Form.Label>
                                    <Form.Control name="no_of_guest" type="number" style={{ width: 200 }} />
                                </Form.Group>
                            </Stack>

                            <Stack justifyContent="space-between">
                                <Form.Group controlId="city">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control name="city" style={{ width: 200 }} />
                                </Form.Group>
                                <Form.Group controlId="location">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control name="location" style={{ width: 200 }} />
                                </Form.Group>
                            </Stack>

                            {modalType === "Update" && (
                                <>
                                    <Form.Group controlId="assigned_to">
                                        <Form.Label>Assigned To</Form.Label>
                                        <Form.Control
                                            name="assigned_to"
                                            accepter={SelectPicker}
                                            data={users}
                                            style={{ width: 200 }}
                                            placeholder="Select user"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="remark">
                                        <Form.Label>Remark</Form.Label>
                                        <Form.Control
                                            name="remark"
                                            rows={4}
                                            accepter={Textarea}
                                            placeholder="Enter remarks"
                                        />
                                    </Form.Group>
                                </>
                            )}
                        </Form.Stack>
                    </Form>
                </Drawer.Body>

            </Drawer>



            {/* View Lead Modal */}
            <Modal open={viewModal} onClose={handleViewClose} size="sm">
                <Modal.Header>
                    <Modal.Title>Lead Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {viewLead && (
                        <List bordered>
                            <List.Item>
                                <strong>ID:</strong> {viewLead._id}
                            </List.Item>
                            <List.Item>
                                <strong>Name:</strong> {viewLead.name || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Phone:</strong> {viewLead.phone || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Email:</strong> {viewLead.email || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>City:</strong> {viewLead.city || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Location:</strong> {viewLead.location || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Preference:</strong> {viewLead.preference || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Event Date:</strong> {viewLead.event_date ? formatDate(viewLead.event_date) : '--'}
                            </List.Item>
                            <List.Item>
                                <strong>No. of Guests:</strong> {viewLead.no_of_guest || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Source:</strong> {viewLead.source || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>URL:</strong> {viewLead.url || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Submission Count:</strong> {viewLead.submissionCount || 1}
                            </List.Item>
                            <List.Item>
                                <strong>Status:</strong>{' '}
                                <Tag color={viewLead.status === "resolve" ? "green" : viewLead.status === "pending" ? "blue" : "red"}>
                                    {viewLead.status}
                                </Tag>
                            </List.Item>
                            <List.Item>
                                <strong>Stage:</strong>{' '}
                                <Tag color="violet">{viewLead.stage || 'level1'}</Tag>
                            </List.Item>
                            <List.Item>
                                <strong>Assigned To:</strong> {viewLead.assigned_to?.name || '--'}
                            </List.Item>
                            <List.Item>
                                <strong>Remark:</strong> {viewLead.remark || '--'}
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

    )


}