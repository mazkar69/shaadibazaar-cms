import { Button, Col, Form, IconButton, Input, Panel, Row, SelectPicker, Stack, TagInput } from "rsuite";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import PlusIcon from '@rsuite/icons/Plus';
import { useEffect, useRef, useState } from "react";
import CloseIcon from '@rsuite/icons/Close';
import { Icon } from "@rsuite/icons";
import getCities from "../../../utils/request/getCities.js";
import getVenueCategories from "../../../utils/request/getVenueCategories.js";
import getLocalities from "../../../utils/request/getLocalities.js";
import { useNavigate, useParams } from "react-router";

export default function UpdateForm() {

    const navigate = useNavigate();
    //Extracting the id from the params
    const {_id} = useParams();



    const faqs = {
        question: "",
        answer: ""
    }

    const [formData, setFormData] = useState({
        url: "",
        category: "",
        city: "",
        location: "",
        meta_title: "",
        meta_keyword: [],
        meta_description: "",
        faqs: [faqs],
        footer_caption:""

    })

    // console.log(formData)

    //State 
    const [cities,setCities] = useState([]);
    const [categories,setCategories] = useState([])
    const [localities,setLocalities] = useState([])
    const [cityIds,setCityIds] = useState({})
    const [loading,setLoading] = useState(false);


    // To Solve the editor initial state update
    const renderEditorChange = useRef(true)

    //fetch the page details 
    useEffect(()=>{
        const getVenuePageDetails = async()=>{
            try {
                let response = await fetch(`/api/venue/page/list/?_id=${_id}`)
                response = await response.json();
                // console.log( "response " + response)
                if(response.success){
                    const data = response.data.venuePages[0];
                    setFormData(data)
                    

                }else{
                    //reload the browser
                }
            } catch (error) {
                console.log(error)
                
            }
        }


        getVenuePageDetails();
    },[])


    // Fetching category city and location
    useEffect(()=>{

        const getData = async ()=>{

            //Get the cities
            const cities =await  getCities();
            //get the category
            const categories = await getVenueCategories();
         

            const selectCityData = cities.map((item)=>{
                return {label:item.name,value:item.slug,id:item._id}
            })
            const selectCategoryData = categories.map((item)=>{
                return {label:item.name,value:item.slug}
            })

            setCities(selectCityData)
            setCategories(selectCategoryData)


            //This will help to find the id of the city with the slug,
            const result = {}
            cities.forEach((item)=>{
                result[item.slug] = item._id;
                
            })

            setCityIds(result);        //Now we can find the id of the city with cityIds[slug] it will return the id of that city
            // console.log(result)

        }

        getData();

    },[])


    //When city change we are fetching the locality 
    useEffect(()=>{
        // alert(cityIds[formData.city])

        const getData = async ()=>{

            const localities = await getLocalities(cityIds[formData.city])

            const selectLocalitiesData = localities.map((item)=>{
                return {label:item.name,value:item.slug}
            })

            setLocalities(selectLocalitiesData);

            
        }

        getData();

        //When city chnage initilize the location with "" else it has the privious state value
        // formData.location = "";          //Not in updateForm, Only on create form

    },[formData.city,cityIds])




    const handleFormData = (value, event) => {   
     
        //    console.log(value)
        //    console.log(event)

        const name = event.target.name;
        setFormData({ ...formData, [name]: value })

    }


    const handleTagInput = (value,event)=>{
        // console.log(value)
        setFormData({...formData,meta_keyword:[...value]})
    }

    //This function will handle the area capacity form 
    const handleFaqsValueChange = (newValue, event, index, key) => {

        const updatedArray = formData.faqs;
        updatedArray[index][key] = newValue;
        setFormData({ ...formData, faqs: updatedArray })

    };

    // Add the field in faqs
    const handleAddFaqs = () => {
        // alert("Click")
        // console.log("Clicked")
        const updatedArray = formData.faqs;

        setFormData({ ...formData, faqs: [...updatedArray, faqs] })
    }

    //Remove the faqs field when the user click on cross iocn
    const handleRemoveFaqs = (index) => {

        let newFaqs = formData.faqs.filter((item, i) => {
            return i !== index
        });

        setFormData({ ...formData, faqs: newFaqs })

    }


  
    const handleEditorChange = (event, editor) => {
        //it is recomanded
        if(renderEditorChange.current){
            renderEditorChange.current = false;
            return;
        }
        // console.log(formData)
        const data = editor.getData();       
        setFormData({...formData,footer_caption:data})

        // console.log(data)
      };


    //   const handleSubmit = null;
    const handleSubmit = async()=>{

        if(!formData.city || !formData.category){
            alert("Select the required field")
            return
        }

        if(!formData.location){
            formData.location = "all"
        }

        const url = `${formData.city}/${formData.category}/${formData.location}`


        try {
                setLoading(true)

                let response = await fetch(`/api/venue/page/update/${_id}`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({...formData,url})
            })

            response = await response.json();

            if(response.success){
                //Redirect to the listing page 
                // alert("Updated Successfully")
                navigate("/venue-page")

            }
            else{
                alert(response.msg);
            }
            
        } catch (error) {
            console.log("Error is " + error)
            
            
        }finally{
            setLoading(false)
        }
    }

    return (
        <Panel bordered >
            <Form fluid>
                <Row style={{ marginBottom: "2rem" }}>
                    <Col xs={8}>
                        <Form.Group controlId="category">
                            <Form.ControlLabel>Category </Form.ControlLabel>
                            <Form.Control name="category" block data={categories} accepter={SelectPicker} value={formData.category} onChange={(value,event)=>handleFormData(value,{target:{name:"category"}})}/>
                        </Form.Group>
                    </Col>
                    <Col xs={8}>
                        <Form.Group controlId="city">
                            <Form.ControlLabel>City </Form.ControlLabel>
                            <Form.Control name="city" block data={cities} accepter={SelectPicker} value={formData.city} onChange={(value,event)=>handleFormData(value,{target:{name:"city"}})}/>
                        </Form.Group>
                    </Col>
                    <Col xs={8}>
                        <Form.Group controlId="locality">
                            <Form.ControlLabel>Locality </Form.ControlLabel>
                            <Form.Control name="location" block data={localities} accepter={SelectPicker} value={formData.location} onChange={(value,event)=>handleFormData(value,{target:{name:"location"}})} />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="show-grid" style={{ marginBottom: "2rem" }}>
                    <Col xs={12}>
                        <Form.Group controlId="meta_title">
                            <Form.ControlLabel>Meta Title</Form.ControlLabel>
                            <Form.Control name="meta_title" value={formData.meta_title} onChange={handleFormData} />
                        </Form.Group>
                    </Col>
                    <Col xs={12}>
                        <Form.Group controlId="meta_keyword">
                            <Form.ControlLabel>Meta Keyword</Form.ControlLabel>
                            <Form.Control name="meta_keyword" block accepter={TagInput}  value={formData.meta_keyword} onChange={handleTagInput}/>
                        </Form.Group>
                    </Col>

                </Row>

                <Row style={{ marginBottom: "2rem" }}>
                    <Form.Group controlId="meta_description">
                        <Form.ControlLabel>Meta Description</Form.ControlLabel>
                        <Input name="meta_description" rows={4} value={formData.meta_description} onChange={handleFormData} as="textarea"  />
                    </Form.Group>
                </Row>


                <Row style={{ marginBottom: "2rem" }}>
                    <Panel bordered header={<Stack spacing={8}><span>FAQs</span><IconButton appearance="primary" size="xs" icon={<PlusIcon />} onClick={handleAddFaqs}></IconButton></Stack>} style={{ marginBottom: "2rem" }}>
                        {
                            formData.faqs?.map((faq, i) => {
                                return (
                                    <Row>
                                        <Col xs={11}>
                                            <Form.Group controlId={`question-${i}`}>
                                                <Form.ControlLabel>Question</Form.ControlLabel>
                                                <Form.Control name={`question-${i}`} value={faq.question} onChange={(value,event)=>{handleFaqsValueChange(value,event,i,"question")}} />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={11}>
                                            <Form.Group controlId={`answer-${i}`}>
                                                <Form.ControlLabel>Answer</Form.ControlLabel>
                                                <Form.Control name={`answer-${i}`} value={faq.answer} onChange={(value,event)=>{handleFaqsValueChange(value,event,i,"answer")}}/>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={2}>
                                            <Icon as={CloseIcon} size="2em" style={{ marginTop: "2rem", cursor: "pointer" }} onClick={() => { handleRemoveFaqs(i) }} />
                                        </Col>
                                    </Row>
                                )
                            })
                        }

                    </Panel>
                </Row>

                <Row style={{ marginBottom: "2rem" }}>

                    <Form.Group controlId="textarea">
                        <Form.ControlLabel>Footer Content</Form.ControlLabel>
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.footer_caption}
                            onChange={(event,editor)=>{
                                handleEditorChange(event,editor);
                            }}

                        />
                    </Form.Group>
                </Row>


                <Stack spacing={20} justifyContent="right">
                    <Button appearance="primary" loading={loading} onClick={handleSubmit}>Update</Button>
                    <Button appearance="default">Clear</Button>
                </Stack>



            </Form>

        </Panel>
    )
}