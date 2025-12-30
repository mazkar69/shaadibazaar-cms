
import {
    Input,
    InputGroup,
    Table,
    DOMHelper,
    Stack,
    Pagination,
    IconButton,
    Modal,
    Button,
    Row,
    Col,

} from 'rsuite';


import { useEffect, useState } from "react";
import SearchIcon from '@rsuite/icons/Search';
import PlusIcon from '@rsuite/icons/Plus';
import { ActionCell,ToggleCell } from './Cells';


export default function CityList() {

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

    //input field
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [id,setId] = useState() //for update the city
    const [modalType,setModalType] = useState("Add")


    //Add city modal
    const [openModal, setOpenModal] = useState(false);

    const handleOpen = (id=null,name="",slug="",type="Add") =>{

        setId(id);
        setName(name);
        setSlug(slug);
        setModalType(type);
        setOpenModal(true);

    }
    const handleClose = () => setOpenModal(false);




    //update the slug
    useEffect(()=>{

        // Convert spaces to dashes and update the slug
        const newSlug = name.toLowerCase().replace(/\s+/g, '-');
        setSlug(newSlug);

    },[name])


    useEffect(() => {

        try {

            async function getData() {

                setLoading(true)


                const url = `/api/city/list?limit=${limit}&pg=${page}&search=${searchKeyword}`

                let response = await fetch(url);
                response = await response.json();
                // console.log(response)
                if (response.success) {
                    setData(response.data.cities)
                    setCount(response.data.count)
                    setLoading(false);
                    // console.log("data saved")
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

            const url = `/api/city/delete/${_id}`

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

    const handleAddCity = async()=>{
        try {

            const url = `/api/city/create`

            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body:JSON.stringify({name,slug})

            })

            response = await response.json();

            if (response.success) {
                // console.log(response)
                setToggleRender(!toggleRender)
                setOpenModal(false);
                setName("")
                setSlug("")
            }

        } catch (error) {
            console.log("Error from handleCreateCity" + error)

        }
    }


    const handleUpdateCity = async()=>{
        try {

            const url = `/api/city/update/${id}`

            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body:JSON.stringify({name,slug})

            })

            response = await response.json();

            if (response.success) {
                // console.log(response)
                setToggleRender(!toggleRender)
                setOpenModal(false);
                setName("")
                setSlug("")
            }

        } catch (error) {
            console.log("Error from Error in updaing city" + error)

        }
    }


    //toggleHandler
    const handleToggle = async(isChecked,name,_id)=>{

        try {

            const url = `/api/city/update/${_id}`

            let response = await fetch(url,{
                method:"POST",
                headers:{
                    "Content-type": "application/json"
                },
                body:JSON.stringify({[name]:isChecked})
            })

            response = await response.json();

            if(response.success){
                // console.log(response)
                setToggleRender(!toggleRender)
            }
            
        } catch (error) {
            console.log("Error from handeToggle" + error)
            
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
                virtualized
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
                <HeaderCell>Status</HeaderCell>
                <ToggleCell dataKey={'status'} handleToggle={handleToggle}/>
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

            <Modal open={openModal} onClose={handleClose} backdrop={false}>
                <Modal.Header>
                    <Modal.Title>{modalType} City</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="show-grid" style={{maxWidth:"100%"}}>
                        <Col xs={12}>
                            <InputGroup>
                                <Input placeholder='Name' value={name} onChange={e=>setName(e)} autoComplete={false}></Input>
                            </InputGroup>
                        </Col>
                        <Col xs={12}>
                            <InputGroup>
                                <Input placeholder='Slug' value={slug} disabled></Input>
                            </InputGroup>
                        </Col>
                    </Row>




                    {/* <Placeholder.Paragraph /> */}

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={modalType === "Add" ? handleAddCity : handleUpdateCity} appearance="primary">
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