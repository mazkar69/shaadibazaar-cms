
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
    DateRangePicker

} from 'rsuite';


import { useEffect, useState } from "react";
import SearchIcon from '@rsuite/icons/Search';
import PlusIcon from '@rsuite/icons/Plus';
import ReloadIcon from '@rsuite/icons/Reload';
import { ActionCell } from './Cells.jsx';
import formatDate from '../../utils/formatDate.js';


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
    const [range,setRange] = useState([])

    const [searchKeyword, setSearchKeyword] = useState('');
    const [toggleRender, setToggleRender] = useState(false);

    const [openModal, setOpenModal] = useState(false);


    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        event_date: null,
        no_of_guest: 0,
        city: "",
        location: ""
    })
    const [id, setId] = useState()       //use to update the lead
    const [modalType, setModalType] = useState("Add")



    const handleOpen = (id = null, name = "", phone = "", event_date = null, no_of_guest = 0, city = "", location = "", type = "Add") => {

        setId(id);
        setFormData({
            name, phone, event_date, no_of_guest, city, location
        })
        setModalType(type);

        setOpenModal(true);
    }

    const handleClose = () => setOpenModal(false);


    useEffect(() => {

        try {

            async function getData() {

                setLoading(true)


                const url = `/api/lead/list?limit=${limit}&pg=${page}&search=${searchKeyword}&range=${range}`

                let response = await fetch(url);
                response = await response.json();

                if (response.success) {
                    setData(response.data.leads)
                    setCount(response.data.count)
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
    }, [page, limit, searchKeyword, range,toggleRender])

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


    //handleDelete
    const handleDelete = async (_id) => {

        try {

            const url = `/api/lead/delete/${_id}`

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

    //handleUpdate
    const handleUpdateStatus = async (_id, status) => {
        try {

            const url = `/api/lead/update/${_id}`

            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ status })

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

    const handleAddLead = async () => {
        try {
            // console.log(formData)
            if (!formData.phone || formData.phone.length !== 10) {
                // console.log("Inside if")
                return;
            }

            const url = `/api/lead/create/`

            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(formData)

            })

            response = await response.json();

            if (response.success) {
                // console.log(response)
                setToggleRender(!toggleRender)      //Refresh the data
                setFormData({       //Resert the form
                    name: "",
                    phone: "",
                    event_date: null,
                    no_of_guest: 0,
                    city: "",
                    location: ""
                })
                handleClose();      //Close the form
            }

        } catch (error) {
            console.log("Error from handleCreateLead" + error)
            alert("Something went wroung")

        }
    }

    // console.log(filteredData())

    return (

        <>
            <Stack className="table-toolbar" justifyContent="space-between">

                <ButtonToolbar>
                    <IconButton icon={<PlusIcon />} appearance="primary" onClick={e => handleOpen(true)}>Add</IconButton>
                    <IconButton icon={<ReloadIcon />} title={"refresh"} size="sm" onClick={() => setToggleRender(!toggleRender)} />
                    <DateRangePicker onChange={value=> value ? setRange(value) : setRange("")} placeholder="Select date range"/>

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
                <Column align="center" sortable>
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



                <Column width={100} resizable sortable>
                    <HeaderCell>Phone</HeaderCell>
                    <Cell dataKey='phone' />
                </Column>

                <Column width={120} resizable sortable>
                    <HeaderCell>Name</HeaderCell>
                    <Cell dataKey='name' />
                    {/* <NameCell dataKey="name" /> */}
                </Column>

                <Column width={100} resizable sortable>
                    <HeaderCell>Event Date</HeaderCell>
                    <Cell>
                        {rowData => (
                            <span>{formatDate(rowData.event_date)?.slice(0,11)}</span>
                        )}
                    </Cell>
                    {/* <Cell dataKey='preference' /> */}
                   
                </Column>


                <Column width={200} resizable sortable>
                    <HeaderCell>preference</HeaderCell>
                    <Cell dataKey='preference' />
                    {/* <NameCell dataKey="name" /> */}
                </Column>

                <Column width={100} resizable sortable>
                    <HeaderCell>City</HeaderCell>
                    <Cell dataKey='city' />
                    {/* <NameCell dataKey="name" /> */}
                </Column>

                <Column width={80} resizable sortable>
                    <HeaderCell>Count</HeaderCell>
                    <Cell dataKey='submissionCount' />
                    {/* <NameCell dataKey="name" /> */}
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
                    {/* <NameCell dataKey="name" /> */}
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
                        <Stack justifyContent="space-between" style={{ marginBottom: 20 }}>
                            <Form.Group controlId='name'>
                                <Form.ControlLabel>Name</Form.ControlLabel>
                                <Form.Control name="name" style={{ width: 200 }} />
                                <Form.HelpText>Name is required</Form.HelpText>
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Phone</Form.ControlLabel>
                                <Form.Control name="phone" type='number' style={{ width: 200 }} />
                                <Form.HelpText>Phone is required</Form.HelpText>

                            </Form.Group>
                        </Stack>

                        <Stack justifyContent="space-between" style={{ marginBottom: 20 }}>
                            <Form.Group>
                                <Form.ControlLabel>Event Date</Form.ControlLabel>
                                <Form.Control name="event_date" oneTap format="dd.MM.yyyy" style={{ width: 200 }} accepter={DatePicker} />
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Total Guest </Form.ControlLabel>
                                <Form.Control name="no_of_guest" type='number' style={{ width: 200 }} />

                            </Form.Group>
                        </Stack>
                        <Stack justifyContent="space-between" style={{ marginBottom: 20 }}>
                            <Form.Group>
                                <Form.ControlLabel>City</Form.ControlLabel>
                                <Form.Control name="city" style={{ width: 200 }} />
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Location</Form.ControlLabel>
                                <Form.Control name="location" style={{ width: 200 }} />

                            </Form.Group>
                        </Stack>


                        {/* 
                        <Form.Group>
                            <Form.ControlLabel>Rating</Form.ControlLabel>
                            <Form.Control name="rating" accepter={Rate} />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>Skill Proficiency</Form.ControlLabel>
                            <Form.Control name="skill" accepter={Slider} progress />
                        </Form.Group> */}
                    </Form>
                </Drawer.Body>

            </Drawer>

        </>

    )


}