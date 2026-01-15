import { Button, Checkbox, Col, Form, Grid, IconButton, NumberInput, Panel, Row, SelectPicker, Stack, TagPicker, Textarea } from "rsuite";

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
import { useEffect, useState } from "react";
import CloseIcon from '@rsuite/icons/Close';
import { Icon } from "@rsuite/icons";
import getCities from "../../../utils/request/getCities.js";
import getVenueCategories from "../../../utils/request/getVenueCategories.js";
import getLocalities from "../../../utils/request/getLocalities.js";

import VenueFeatureData from '../../../utils/json/venueFeature.json'
import PhoneNumbers from "../../../utils/json/phoneNumber.json"
import getBudget from "../../../utils/request/getBudget.js";
import getVenues from "../../../utils/request/getVenues.js";
import { useNavigate } from "react-router";
import { authApi } from "../../../utils/request/apiRequest.js";
// console.log(VenueFeatureData)

export default function VenueAddForm() {

    const navigate = useNavigate();

    const areacapacity = {
        name: "",
        sitting: "",
        floating: "",
        area_type: ""

    }

    const [formData, setFormData] = useState({

        venue_category_ids: [],
        name: "",
        slug: "",
        city_id: "",
        location_id: "",
        related_location_ids: [],
        venue_address: "",
        phone: "",
        email: "",
        min_capacity: "",
        max_capacity: "",
        veg_price: 0,
        nonveg_price: 0,
        rental_price: 0,
        rooms: 0,
        budget_id: "",
        parking_capacity: "",
        similar_venues_ids: [],
        meta_title: "",
        meta_description: "",
        location_map: "",
        venue_features: VenueFeatureData || [],
        area_capacity: [areacapacity],
        summary: "",

        owner_name: "",
        owner_phone: "",
        owner_email: ""

    })

    //State 
    const [cities, setCities] = useState([]);
    const [categories, setCategories] = useState([])
    const [localities, setLocalities] = useState([])
    const [similarVenues, setSimilarVenues] = useState([])
    const [budgets, setBudgets] = useState([])
    const [localitiesSlug, setLocalitiesSlugs] = useState({});


    const [loading, setLoading] = useState(false);

    //update the slug
    useEffect(() => {

        // Convert spaces to dashes and update the slug
        const newSlug = formData.name.toLowerCase().replace(/\s+/g, '-');
        setFormData({ ...formData, slug: newSlug })

    }, [formData.name])

    //Fetching category city and budget
    useEffect(() => {

        const getData = async () => {

            //Get the cities
            const cities = await getCities();
            //get the category
            const categories = await getVenueCategories();
            //gettheBudget
            const budgets = await getBudget();


            const selectCityData = cities.map((item) => {
                return { label: item.name, value: item._id, }
            })
            const selectCategoryData = categories.map((item) => {
                return { label: item.name, value: item._id }
            })
            const selectBudgetData = budgets.map((item) => {
                return { label: item.name, value: item._id }
            })

            setCities(selectCityData)
            setCategories(selectCategoryData)
            setBudgets(selectBudgetData)



        }

        getData();

    }, [])


    //When city change we are fetching the locality 
    useEffect(() => {

        const getData = async () => {


            if (!formData.city_id) {
                setLocalities([])
                formData.location_id = "";
                formData.related_location_ids = [];
                formData.similar_venues_ids = [];
                setSimilarVenues([]);

                return;

            }

            //Extracting the id from the city slug
            const localities = await getLocalities(formData.city_id)
            const similarvenue = await getVenues(formData.city_id);


            const selectLocalitiesData = localities.map((item) => {
                return { label: item.name, value: item._id }
            })
            const selectSimilarVenueData = similarvenue.map((item) => {
                return { label: item.name, value: item._id }
            })

            //This will help to find the id of the city with the slug,
            const result = {}
            localities.forEach((item) => {
                result[item._id] = item.slug;

            })
            setLocalitiesSlugs(result);

            setLocalities(selectLocalitiesData);
            setSimilarVenues(selectSimilarVenueData)

        }

        getData();

        //When city chnage initilize the location with "" else it has the privious state value
        formData.location_id = "";
        formData.related_location_ids = [];
        formData.similar_venues_ids = []

    }, [formData.city_id])



    const handleFormData = (value, event) => {

        //    console.log(value)
        //    console.log(event)
        const name = event.target.name;
        setFormData({ ...formData, [name]: value })

    }

    const handleTagInput = (value, event) => {

        setFormData({ ...formData, [event.target.name]: [...value] })
    }

    //This function will handle the area capacity form 
    const handleAreaCapacityValueChange = (newValue, event, index, key) => {

        const updatedArray = formData.area_capacity;
        updatedArray[index][key] = newValue;
        setFormData({ ...formData, area_capacity: updatedArray })

    };

    // Add the field in faqs
    const handleAddAreaCapacity = () => {
        // alert("Click")
        // console.log("Clicked")
        const updatedArray = formData.area_capacity;

        setFormData({ ...formData, area_capacity: [...updatedArray, areacapacity] })
    }

    //Remove the faqs field when the user click on cross iocn
    const handleRemoveFaqs = (index) => {

        let newAreaCapacity = formData.area_capacity.filter((item, i) => {
            return i !== index
        });

        setFormData({ ...formData, area_capacity: newAreaCapacity })

    }

    // This Function is a handler function when the user select any feature item then we are setting that item to the formData.venue_feature.
    const handleCheckChange = (value, checked, i) => {

        const newVenueFeatures = formData.venue_features;
        newVenueFeatures[i].status = checked;

        setFormData({ ...formData, venue_features: newVenueFeatures });



    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setFormData({ ...formData, summary: data })
        // console.log(data)
    };



    const handleSubmit = async () => {


        if (!formData.city_id || !formData.location_id || !formData.name) {
            alert("Select the required field")
            return
        }



        try {
            setLoading(true)

            const structuredSlug = `${formData.slug}-in-${localitiesSlug[formData.location_id]}`
            // console.log(structuredSlug)
            let {data} = await authApi.post("/api/venue/create",{ ...formData, slug: structuredSlug })



            if (data.success) {
                //Redirect to the listing page 
                navigate("/venue")
            }
            else {
                alert(data.msg);
            }

        } catch (error) {
            console.log("Error is " + error)


        } finally {
            setLoading(false)
        }
    }

    return (
        <Panel bordered >
            <Form fluid>
                <Row style={{ marginBottom: "2rem", width: "100%" }}>
                    <Col xs={8}>
                        <Form.Group controlId="venue_category_ids">
                            <Form.Label>Category</Form.Label>
                            <Form.Control name="venue_category_ids" block data={categories} accepter={TagPicker} onChange={(value) => { handleTagInput(value, { target: { name: "venue_category_ids" } }) }} />
                        </Form.Group>
                    </Col>
                    <Col xs={8}>
                        <Form.Group controlId="name">
                            <Form.Label>Venue Name</Form.Label>
                            <Form.Control name="name" value={formData.name} onChange={handleFormData} />
                        </Form.Group>
                    </Col>
                    <Col xs={8}>
                        <Form.Group controlId="slug">
                            <Form.Label>Slug</Form.Label>
                            <Form.Control name="slug" value={formData.slug} disabled />
                        </Form.Group>
                    </Col>
                </Row>

                <Row style={{ marginBottom: "2rem", width: "100%" }}>

                    <Col xs={8}>
                        <Form.Group controlId="city">
                            <Form.Label>City</Form.Label>
                            <Form.Control name="city_id" block data={cities} accepter={SelectPicker} virtualized value={formData.city_id} onChange={(value, event) => handleFormData(value, { target: { name: "city_id" } })} />
                        </Form.Group>
                    </Col>
                    <Col xs={8}>
                        <Form.Group controlId="location_id">
                            <Form.Label>Locality</Form.Label>
                            <Form.Control name="location_id" block data={localities} virtualized accepter={SelectPicker} value={formData.location_id} onChange={(value, event) => handleFormData(value, { target: { name: "location_id" } })} />
                        </Form.Group>
                    </Col>
                    <Col xs={8}>
                        <Form.Group controlId="related-location_ids">
                            <Form.Label>Related Location</Form.Label>
                            <Form.Control name="related_location_ids" block data={localities} virtualized accepter={TagPicker} value={formData.reloated_location_ids} onChange={(value, event) => handleTagInput(value, { target: { name: "related_location_ids" } })} />
                        </Form.Group>
                    </Col>
                </Row>

                <Row style={{ marginBottom: "2rem", width: "100%" }}>
                    <Form.Group controlId="venue_address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control name="venue_address" rows={2} accepter={Textarea} value={formData.venue_address} onChange={handleFormData} />
                    </Form.Group>
                </Row>

                <Row className="show-grid" style={{ marginBottom: "2rem", width: "100%" }}>
                    <Col xs={6}>
                        <Form.Group controlId="phone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control name="phone" accepter={SelectPicker} block value={formData.phone} data={PhoneNumbers} onChange={(value) => handleFormData(value, { target: { name: "phone" } })} />
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control name="email" type="email" value={formData.email} onChange={handleFormData} />
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group controlId="min_capacity">
                            <Form.Label>Min Capacity</Form.Label>
                            <Form.Control name="min_capacity" accepter={NumberInput} value={formData.min_capacity} onChange={handleFormData} />
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group controlId="max_capacity">
                            <Form.Label>Max Capacity</Form.Label>
                            <Form.Control name="max_capacity" accepter={NumberInput} value={formData.max_capacity} onChange={handleFormData} />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="show-grid" style={{ marginBottom: "2rem", width: "100%" }}>
                    <Col xs={6}>
                        <Form.Group controlId="veg_price">
                            <Form.Label>Veg Price/plate</Form.Label>
                            <Form.Control name="veg_price" accepter={NumberInput} value={formData.veg_price} onChange={handleFormData} />
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group controlId="nonveg_price">
                            <Form.Label>Non-Veg Price/plate</Form.Label>
                            <Form.Control name="nonveg_price" accepter={NumberInput} value={formData.nonveg_price} onChange={handleFormData} />
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group controlId="rental_price">
                            <Form.Label>Rental Price</Form.Label>
                            <Form.Control name="rental_price" accepter={NumberInput} value={formData.rental_price} onChange={handleFormData} />
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group controlId="rooms">
                            <Form.Label>Room Count</Form.Label>
                            <Form.Control name="rooms" accepter={NumberInput} value={formData.rooms} onChange={handleFormData} />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="show-grid" style={{ marginBottom: "2rem", width: "100%" }}>
                    <Col xs={6}>
                        <Form.Group controlId="budet_id">
                            <Form.Label>Budget</Form.Label>
                            <Form.Control name="budget_id" accepter={SelectPicker} block data={budgets} onChange={(value, event) => handleFormData(value, { target: { name: "budget_id" } })} />
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group controlId="parking_capacity">
                            <Form.Label>Parking Capacity</Form.Label>
                            <Form.Control name="parking_capacity" accepter={NumberInput} value={formData.parking_capacity} onChange={handleFormData} />
                        </Form.Group>
                    </Col>
                    <Col xs={12}>
                        <Form.Group controlId="similar_venues_ids">
                            <Form.Label>Similar Venue</Form.Label>
                            <Form.Control name="similar_venues_ids" data={similarVenues} block value={formData.similar_venues_ids} accepter={TagPicker} virtualized onChange={(value, event) => handleTagInput(value, { target: { name: "similar_venues_ids" } })} />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="show-grid" style={{ marginBottom: "2rem", width: "100%" }}>
                    <Col xs={12}>
                        <Form.Group controlId="meta_title">
                            <Form.Label>Meta Title</Form.Label>
                            <Form.Control name="meta_title" rows={2} value={formData.meta_title} onChange={handleFormData} accepter={Textarea} />
                        </Form.Group>
                    </Col>
                    <Col xs={12}>
                        <Form.Group controlId="meta_description">
                            <Form.Label>Meta Description</Form.Label>
                            <Form.Control name="meta_description" rows={2} value={formData.meta_description} onChange={handleFormData} accepter={Textarea} />
                        </Form.Group>
                    </Col>
                </Row>

                <Row style={{ marginBottom: "2rem", width: "100%" }}>
                    <Form.Group controlId="location_map">
                        <Form.Label>Map URL</Form.Label>
                        <Form.Control name="location_map" rows={3} value={formData.location_map} onChange={handleFormData} accepter={Textarea} />
                    </Form.Group>
                </Row>


                <Row style={{ marginBottom: "2rem", width: "100%" }}>

                    <Panel bordered header={<span>Venue Feature</span>}>

                        <Row>

                            {
                                formData.venue_features?.map((feature, i) => {
                                    return (
                                        <Col xs={8} key={i} >
                                            <Checkbox checked={feature.status} onChange={(value, checked) => handleCheckChange(value, checked, i)}>
                                                {feature.name}
                                            </Checkbox>

                                        </Col>
                                    )
                                })
                            }


                        </Row>

                    </Panel>
                </Row>

                <Row style={{ marginBottom: "2rem", width: "100%" }} >
                    <Panel bordered header={<Stack spacing={8}><span>Area Capacity</span><IconButton appearance="primary" size="xs" icon={<PlusIcon />} onClick={handleAddAreaCapacity}></IconButton></Stack>} style={{ marginBottom: "2rem", width: "100%" }}>
                        {
                            formData.area_capacity?.map((area, i) => {
                                return (
                                    <Row key={i} style={{ marginBottom: "1rem", width: "100%" }}>

                                        <Col xs={5}>
                                            <Form.Group controlId={`name-${i}`}>
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control name={`name-${i}`} value={area.name} onChange={(value, event) => { handleAreaCapacityValueChange(value, event, i, "name") }} />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={5}>
                                            <Form.Group controlId={`seating-${i}`}>
                                                <Form.Label>Seating</Form.Label>
                                                <Form.Control name={`seating-${i}`} accepter={NumberInput} value={area.seating} onChange={(value, event) => { handleAreaCapacityValueChange(value, event, i, "seating") }} />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={5}>
                                            <Form.Group controlId={`floating-${i}`}>
                                                <Form.Label>Floating</Form.Label>
                                                <Form.Control name={`floating-${i}`} accepter={NumberInput} value={area.floating} onChange={(value, event) => { handleAreaCapacityValueChange(value, event, i, "floating") }} />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={5}>
                                            <Form.Group controlId={`area_type-${i}`}>
                                                <Form.Label>Area Type</Form.Label>
                                                <Form.Control name={`area_type-${i}`} block value={area.area_type} searchable={false} data={[{ label: "Indoor", value: "indoor" }, { label: "Outdoor", value: 'outdoor' }, { label: "Indoor + Outdoor", value: "indoor + outdoor" }]} accepter={SelectPicker} onChange={(value, event) => { handleAreaCapacityValueChange(value, event, i, "area_type") }} />
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
                    <Form.Group controlId="summary">
                        <Form.Label>Summary</Form.Label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.summary}
                            onChange={handleEditorChange}
                            config={{
                                licenseKey: 'GPL', // Or 'GPL'.
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
                                placeholder: "Write venue summary here...",
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

                <Row style={{ marginBottom: "2rem", width: "100%" }} >

                    <Panel bordered header={<span>Owner Details:</span>} style={{ width: "100%" }}>

                        <Row className="" style={{ marginBottom: "2rem", width: "100%" }}>

                            <Col xs={8}>
                                <Form.Group controlId="owner_name">
                                    {/* <Form.ControlLabel>Vendor Name</Form.ControlLabel> */}
                                    <Form.Control name="owner_name" placeholder="Name" value={formData.owner_name} onChange={handleFormData} />
                                </Form.Group>
                            </Col>

                            <Col xs={8}>
                                <Form.Group controlId="owner_phone">
                                    {/* <Form.ControlLabel>Vendor Phone</Form.ControlLabel> */}
                                    <Form.Control name="owner_phone" placeholder="Phone" value={formData.owner_phone} onChange={handleFormData} />
                                </Form.Group>

                            </Col>
                            <Col xs={8}>
                                <Form.Group controlId="owner_email">
                                    {/* <Form.ControlLabel>Vendor Phone</Form.ControlLabel> */}
                                    <Form.Control name="owner_email" placeholder="Email" type="email" value={formData.owner_email} onChange={handleFormData} />
                                </Form.Group>

                            </Col>

                        </Row>

                    </Panel>


                </Row>




                {/* </Grid> */}
                <Stack spacing={20} justifyContent="right">
                    <Button appearance="primary" loading={loading} onClick={handleSubmit}>Submit</Button>
                    <Button appearance="default">Clear</Button>
                </Stack>
            </Form>

        </Panel>
    )
}