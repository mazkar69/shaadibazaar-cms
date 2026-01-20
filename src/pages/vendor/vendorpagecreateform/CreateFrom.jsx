import { Button, Col, Form, IconButton, Panel, Row, SelectPicker, Stack, TagInput, Textarea } from "rsuite";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Autoformat,
    Bold,
    Italic,
    Underline,
    BlockQuote,
    Essentials,
    FindAndReplace,
    Font,
    Heading,
    Image,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    PictureEditing,
    Indent,
    IndentBlock,
    Link,
    List,
    MediaEmbed,
    Mention,
    Paragraph,
    PasteFromOffice,
    SourceEditing,
    Table,
    TableColumnResize,
    TableToolbar,
    TextTransformation,
    HtmlEmbed,
    CodeBlock,
    RemoveFormat,
    Code,
    SpecialCharacters,
    HorizontalLine,
    PageBreak,
    TodoList,
    Strikethrough,
    Subscript,
    Superscript,
    Highlight,
    Alignment
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import PlusIcon from '@rsuite/icons/Plus';
import React, { useEffect, useState } from "react";
import CloseIcon from '@rsuite/icons/Close';
import { Icon } from "@rsuite/icons";
import getCities from "../../../utils/request/getCities.js";
import getLocalities from "../../../utils/request/getLocalities.js";
import { useNavigate } from "react-router";
import getVendorCategories from "../../../utils/request/getVendorCategories.js";
import { authApi } from "../../../utils/request/apiRequest.js";

export default function CreateForm() {

    const navigate = useNavigate();

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
        footer_caption: "",



    })

    //State 
    const [cities,setCities] = useState([]);
    const [categories,setCategories] = useState([])
    const [localities,setLocalities] = useState([])
    const [cityIds,setCityIds] = useState({})

    const [loading,setLoading] = useState(false);


    //Fetching category city and location
    useEffect(()=>{

        const getData = async ()=>{

            //Get the cities
            const cities =await  getCities();
            //get the category
            const categories = await getVendorCategories();
         

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

        const getData = async ()=>{

            const localities = await getLocalities(cityIds[formData.city])

            const selectLocalitiesData = localities.map((item)=>{
                return {label:item.name,value:item.slug}
            })

            setLocalities(selectLocalitiesData);

            
        }

        getData();

        //When city chnage initilize the location with "" else it has the privious state value
        formData.location = "";

    },[formData.city])




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
        const data = editor.getData();
        setFormData({...formData,footer_caption:data})
        // console.log(data)
      };



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
            const { data } = await authApi.post("/api/vendor/page/create", { ...formData, url })

            if(data.success){
                //Redirect to the listing page 
                navigate("/vendor-page")

            }
            else{
                alert(data.msg);
            }
            
        } catch (error) {
            console.log("Error is " + error)
            
            
        } finally{
            setLoading(false);
        }
    }

    return (
        <Panel bordered >
            <Form fluid>
                <Row style={{ marginBottom: "2rem", width: "100%" }}>
                    <Col xs={8}>
                        <Form.Group controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control name="category" block data={categories} accepter={SelectPicker} value={formData.category} onChange={(value,event)=>handleFormData(value,{target:{name:"category"}})}/>
                        </Form.Group>
                    </Col>
                    <Col xs={8}>
                        <Form.Group controlId="city">
                            <Form.Label>City</Form.Label>
                            <Form.Control name="city" block data={cities} accepter={SelectPicker} value={formData.city} onChange={(value,event)=>handleFormData(value,{target:{name:"city"}})}/>
                        </Form.Group>
                    </Col>
                    <Col xs={8}>
                        <Form.Group controlId="locality">
                            <Form.Label>Locality</Form.Label>
                            <Form.Control name="location" block data={localities} accepter={SelectPicker} value={formData.location} onChange={(value,event)=>handleFormData(value,{target:{name:"location"}})} />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="show-grid" style={{ marginBottom: "2rem", width: "100%" }}>
                    <Col xs={12}>
                        <Form.Group controlId="meta_title">
                            <Form.Label>Meta Title</Form.Label>
                            <Form.Control name="meta_title" value={formData.meta_title} onChange={handleFormData} />
                        </Form.Group>
                    </Col>
                    <Col xs={12}>
                        <Form.Group controlId="meta_keyword">
                            <Form.Label>Meta Keyword</Form.Label>
                            <Form.Control name="meta_keyword" block accepter={TagInput} style={{ width: "100%" }} value={formData.meta_keyword} onChange={handleTagInput}/>
                        </Form.Group>
                    </Col>
                </Row>

                <Row style={{ marginBottom: "2rem", width: "100%" }}>
                    <Form.Group controlId="meta_description">
                        <Form.Label>Meta Description</Form.Label>
                        <Form.Control name="meta_description" rows={4} value={formData.meta_description} onChange={handleFormData} accepter={Textarea} />
                    </Form.Group>
                </Row>


                <Row style={{ marginBottom: "2rem", width: "100%" }}>
                    <Panel bordered header={<Stack spacing={8}><span>FAQs</span><IconButton appearance="primary" size="xs" icon={<PlusIcon />} onClick={handleAddFaqs}></IconButton></Stack>} style={{ marginBottom: "2rem", width: "100%" }}>
                        {
                            formData.faqs?.map((faq, i) => {
                                return (
                                    <Row key={i} style={{ marginBottom: "1rem", width: "100%" }}>
                                        <Col xs={11}>
                                            <Form.Group controlId={`question-${i}`}>
                                                <Form.Label>Question</Form.Label>
                                                <Form.Control name={`question-${i}`} value={faq.question} onChange={(value,event)=>{handleFaqsValueChange(value,event,i,"question")}} />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={11}>
                                            <Form.Group controlId={`answer-${i}`}>
                                                <Form.Label>Answer</Form.Label>
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

                <Row style={{ marginBottom: "2rem", width: "100%" }}>
                    <Form.Group controlId="textarea">
                        <Form.Label>Footer Content</Form.Label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.footer_caption || ""}
                            onChange={handleEditorChange}
                            config={{
                                licenseKey: 'GPL',
                                toolbar: {
                                    items: [
                                        'undo', 'redo',
                                        '|',
                                        'sourceEditing',
                                        '|',
                                        'findAndReplace', 'selectAll',
                                        '|',
                                        'heading',
                                        '|',
                                        'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
                                        '-',
                                        'bold', 'italic', 'underline',
                                        {
                                            label: 'Formatting',
                                            icon: 'text',
                                            items: ['strikethrough', 'subscript', 'superscript', 'code', '|', 'removeFormat']
                                        },
                                        '|',
                                        'specialCharacters', 'horizontalLine', 'pageBreak',
                                        '|',
                                        'link', 'insertImage', 'insertTable',
                                        {
                                            label: 'Insert',
                                            icon: 'plus',
                                            items: ['highlight', 'blockQuote', 'mediaEmbed', 'codeBlock', 'htmlEmbed']
                                        },
                                        'alignment',
                                        '|',
                
                                        'bulletedList', 'numberedList', 'todoList',
                                        {
                                            label: 'Indents',
                                            icon: 'plus',
                                            items: ['outdent', 'indent']
                                        }
                                    ],
                                    shouldNotGroupWhenFull: true
                                },
                                list: {
                                    properties: {
                                        styles: true,
                                        startIndex: true,
                                        reversed: true
                                    }
                                },
                                plugins: [
                                    Autoformat, BlockQuote, Bold, Essentials, FindAndReplace, Font,
                                    Heading, Image, ImageCaption, ImageResize, ImageStyle, ImageToolbar,
                                    ImageUpload, Indent, IndentBlock, Italic, Link, List, MediaEmbed,
                                    Mention, Paragraph, PasteFromOffice, PictureEditing, SourceEditing,
                                    Table, TableColumnResize, TableToolbar, TextTransformation, Underline,
                                    HtmlEmbed, CodeBlock, RemoveFormat, Code, SpecialCharacters,
                                    HorizontalLine, PageBreak, TodoList, Strikethrough, Subscript,
                                    Superscript, Highlight, Alignment,
                                ],
                                placeholder: "Write footer content here...",
                                heading: {
                                    options: [
                                        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                                        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                                        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                                        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                                        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                                        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                                        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                                    ]
                                },
                                image: {
                                    resizeOptions: [
                                        {
                                            name: 'resizeImage:original',
                                            label: 'Default image width',
                                            value: null
                                        },
                                        {
                                            name: 'resizeImage:50',
                                            label: '50% page width',
                                            value: '50'
                                        },
                                        {
                                            name: 'resizeImage:75',
                                            label: '75% page width',
                                            value: '75'
                                        }
                                    ],
                                    toolbar: [
                                        'imageTextAlternative',
                                        'toggleImageCaption',
                                        '|',
                                        'imageStyle:inline',
                                        'imageStyle:wrapText',
                                        'imageStyle:breakText',
                                        '|',
                                        'resizeImage'
                                    ],
                                },
                                link: {
                                    addTargetToExternalLinks: true,
                                    defaultProtocol: 'https://'
                                },
                                table: {
                                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
                                },
                            }}
                        />
                    </Form.Group>
                </Row>


                <Stack spacing={20} justifyContent="right">
                    <Button appearance="primary" loading={loading} onClick={handleSubmit}>Submit</Button>
                    <Button appearance="default">Clear</Button>
                </Stack>



            </Form>

        </Panel>
    )
}