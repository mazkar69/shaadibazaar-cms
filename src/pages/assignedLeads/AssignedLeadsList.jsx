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
    Textarea,
    Whisper,
    Tooltip
} from 'rsuite';
import InfoOutlineIcon from '@rsuite/icons/InfoOutline';


import { useEffect, useState } from "react";
import SearchIcon from '@rsuite/icons/Search';
import PlusIcon from '@rsuite/icons/Plus';
import ReloadIcon from '@rsuite/icons/Reload';
import { ActionCell } from './Cells.jsx';
import formatDate from '../../utils/formatDate.js';
import api, { authApi } from '../../utils/request/apiRequest.js';


export default function AssignedLeadList() {

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


    useEffect(() => {

        try {

            async function getData() {

                setLoading(true)


                const url = `/api/leads/assignedLeads/?limit=${limit}&pg=${page}&search=${searchKeyword}&range=${range}`

                let { data } = await authApi(url)

                if (data.success) {
                    setData(data.data)
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


                <Column width={80} resizable sortable>
                    <HeaderCell>Count</HeaderCell>
                    <Cell dataKey='submissionCount' />
                </Column>



                <Column width={80} resizable sortable>
                    <HeaderCell>Status</HeaderCell>
                    <Cell>
                        {
                            (rowData) => {
                                return (<Tag color={rowData.status === "resolve" ? "green" : rowData.status === "pending" ? "blue" : "red"}>{rowData.status}</Tag>)
                            }

                        }

                    </Cell>
                </Column>

                <Column width={120} resizable sortable align='center'>
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
                    <HeaderCell>
                        Action
                    </HeaderCell>
                    <ActionCell dataKey="id" handleDelete={handleDelete} handleUpdateStatus={handleUpdateStatus} handleOpen={handleOpen} />
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
                                    <Form.Control name="phone" type="number" style={{ width: 200 }} disabled={modalType === "Update"} />
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
                            <Form.Group controlId="remark">
                                <Form.Label>Remark</Form.Label>
                                <Form.Control
                                    name="remark"
                                    rows={4}
                                    accepter={Textarea}
                                    placeholder="Enter remarks"
                                />
                            </Form.Group>


                        </Form.Stack>
                    </Form>
                </Drawer.Body>

            </Drawer>


        </>

    )


}