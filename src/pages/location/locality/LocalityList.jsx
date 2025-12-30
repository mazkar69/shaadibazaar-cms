
import {
    Input,
    InputGroup,
    Table,
    DOMHelper,
    Stack,
    Pagination,
    IconButton,
    Modal,
    Row,
    Col,
    Button,
    Checkbox,
    SelectPicker,

} from 'rsuite';


import { useEffect, useMemo, useState } from "react";
import SearchIcon from '@rsuite/icons/Search';
import PlusIcon from '@rsuite/icons/Plus';
import { ActionCell, ToggleCell } from './Cells';
import getCities from '../../../utils/request/getCities';
import getLocalities from '../../../utils/request/getLocalities';


export default function LocalityList() {

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
    const [modalType,setModalType] = useState("Add")

    //model state
    const [openModal, setOpenModal] = useState(false);
    



    const [cities, setCities] = useState([])
    const [localities, setLocalities] = useState([])

    //input field
    const [cityId, setCityId] = useState();
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [id, setId] = useState(null)
    const [isGroup, setIsGroup] = useState(false);
    const [localityList, setLocalityList] = useState([])         //If group then list of selected locality


    //update the slug
    useEffect(()=>{

        // Convert spaces to dashes and update the slug
        const newSlug = name.toLowerCase().replace(/\s+/g, '-');
        setSlug(newSlug);

    },[name])

    const cityPickerData = useMemo(() => {
        return cities.map(item => ({ label: item.name, value: item._id }));
    }, [cities])



        //CAlling this handle open function on add btn as well as on edit button, that's why here we are passing the value in the handle open function
        //WE initialize cityid=cityId because we want that when the user select a city and next time if he again the modal then the previous city selected
        //isGroup=false  => will make false when the modal open.
        //localitylist=localityList => this is for group localtion. If a locality is group then it contains the selected locality slug
        const handleOpen = (id=null,name="",slug="",cityid=cityId,isgroup = false,localitylist=localityList,modalType="Add") => {

            setId(id)           //only for update
            setName(name)
            setSlug(slug);
            setCityId(cityid)
            setIsGroup(isgroup)
            setModalType(modalType)
            setLocalityList(localitylist)
    
            //open the modal
            setOpenModal(true);
        }
        const handleClose = () => setOpenModal(false);


    // // This is will the city list
    useEffect(() => {
        const fetchCities = async () => {
            const data = await getCities();
            // console.log(data)
            setCities(data);
        }

        fetchCities();
    }, [])



    //This will fetch the locality when the city_id change
    //We are calling this function when the modal will open or close , Reason is when a user create new locality and again open modal then the previous location should be updated.
    useEffect(() => {

        //Checking if cityId is valid, first time it will be undefined because we are not initializing the cityId in useState
        if(cityId){
            const fetchLocalities = async () => {
                const data = await getLocalities(cityId);
                // console.log(data)
                setLocalities(data)
            }
            fetchLocalities();
    

        }
      
        
    }, [cityId,openModal])




    useEffect(() => {

        try {

            async function getData() {

                setLoading(true)


                const url = `/api/location/list?limit=${limit}&pg=${page}&search=${searchKeyword}`

                let response = await fetch(url);
                response = await response.json();
                // console.log(response)
                if (response.success) {
                    setData(response.data.locations)
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
        const choice = window.confirm("Are you sure ?")
        if(!choice){
            return;
        }
        try {

            const url = `/api/location/delete/${_id}`

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

    const handleCreateLocation = async () => {
        try {

            const url = `/api/location/create`

            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ city_id:cityId, name, slug,is_group:isGroup,locality_ids:localityList })

            })

            response = await response.json();
            // console.log(response)
            if (response.success) {
                // console.log(response)
                setToggleRender(!toggleRender)
                setOpenModal(false);
            }

        } catch (error) {
            console.log("Error from handleCreateLoction" + error)

        }
    }


    //toggleHandler  will update the status of localities.
    const handleToggle = async (isChecked, name, _id) => {

        try {

            const url = `/api/location/update/${_id}`

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

    //handle checkbox for isGroup
    const handleIsGroup = (value, checked) => {
        // console.log(checked)
        setIsGroup(checked)
    }


    // This Function is a handler function when the user select any filter item then we are setting that item to the list array use setList method.
    const handleCheckChange = (value, checked) => {


        if (checked && !localityList.includes(value)) {


            setLocalityList(prev => [...prev, value]);

        } else if (!checked && localityList.includes(value)) {

            setLocalityList(prev => prev.filter(loc => loc !== value));
        }

    };


    const handleUpdateLocation = async()=>{
        try {

            const url = `/api/location/update/${id}`

            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ city_id:cityId, name, slug,is_group:isGroup,locality_ids:localityList })

            })

            response = await response.json();

            if (response.success) {
                // console.log(response)
                setToggleRender(!toggleRender)
                setOpenModal(false);
            }

        } catch (error) {
            console.log("Error from handleUpdate" + error)

        }
    }
    return (

        <>
            <Stack className="table-toolbar" justifyContent="space-between">

                <IconButton icon={<PlusIcon />} appearance="primary" onClick={handleOpen}>Add</IconButton>


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

                <Column width={250} resizable sortable>
                    <HeaderCell>Name</HeaderCell>
                    <Cell dataKey='name' />
                    {/* <NameCell dataKey="name" /> */}
                </Column>

                <Column sortable width={250}>
                    <HeaderCell>Slug</HeaderCell>
                    <Cell dataKey='slug' />
                    {/* <NameCell dataKey="name" /> */}
                </Column>

                <Column>
                    <HeaderCell>City Name</HeaderCell>
                    <Cell>
                        {(rowData)=>{
                            return(
                                <span>{rowData.city_id.name}</span>
                            )
                        }}
                    </Cell>
                    {/* <Cell dataKey='city_id'/> */}
                    
                </Column>
                <Column>
                    <HeaderCell>status</HeaderCell>
                    <ToggleCell dataKey={'status'} handleToggle={handleToggle} />
                </Column>

                <Column width={120} align='center'>
                    <HeaderCell>
                        Action
                    </HeaderCell>
                    <ActionCell dataKey="id" handleDelete={handleDelete} handleOpen={handleOpen}/>
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


            <Modal open={openModal} onClose={handleClose} backdrop={false} size={"md"}>
                <Modal.Header>
                    <Modal.Title>{modalType} Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="show-grid" style={{ maxWidth: "100%" }}>
                        <Col xs={8}>
                            <SelectPicker block defaultValue={cityId}  data={cityPickerData} placeholder={"Select City"} onSelect={setCityId}></SelectPicker>
                        </Col>
                        <Col xs={8}>
                            <InputGroup>
                                <Input placeholder='Name' value={name} onChange={e => setName(e)} autoComplete={false}></Input>
                            </InputGroup>
                        </Col>
                        <Col xs={8}>
                            <InputGroup>
                                <Input placeholder='Slug' value={slug} disabled></Input>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Checkbox checked={isGroup} onChange={handleIsGroup}> Is Group ?</Checkbox>

                    {
                        isGroup && (
                            <Row style={{ marginTop: "3rem", width: "100%" }}>

                                {
                                    localities.map((item, i) => {
                                        return (
                                            <Col xs={6} key={i}>
                                                <Checkbox value={item._id} checked={localityList.includes(item._id)} onChange={handleCheckChange}>{item.name}</Checkbox>
                                            </Col>
                                        )
                                    })
                                }


                            </Row>
                        )
                    }


                    {/* <Placeholder.Paragraph /> */}

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={modalType==="Add" ? handleCreateLocation : handleUpdateLocation} appearance="primary">
                        {modalType}
                    </Button>
                    <Button onClick={handleClose} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

        </>

    )


}