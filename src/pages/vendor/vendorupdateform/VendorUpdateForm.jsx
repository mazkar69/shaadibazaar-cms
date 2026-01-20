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
import getLocalities from "../../../utils/request/getLocalities.js";
import PhoneNumbers from "../../../utils/json/phoneNumber.json"
import { useNavigate, useParams } from "react-router";
import getVendors from "../../../utils/request/getVendors.js";
import getVendorCategories from "../../../utils/request/getVendorCategories.js";
import { authApi } from '../../../utils/request/apiRequest.js';
import toast from 'react-hot-toast';
// console.log(VenueFeatureData)

export default function VendorUpdateForm() {

    //Extracting the url
    const { _id } = useParams();

    //for navigating
    const navigate = useNavigate();

    const package_option = {
        package_name: "",
        package_price: "",


    }

    const [formData, setFormData] = useState({

        vendor_category_id: "",
        brand_name: "",
        slug: "",
        city_id: "",
        location_id: "",
        vendor_address: "",
        phone: "",
        email: "",

        package_price: "",
        package_option: [package_option],

        yrs_exp: "",
        summary: "",
        similar_vendor_ids: [],
        meta_title: "",
        meta_description: "",

        vendor_name: "",
        vendor_phone: "",
        vendor_email:""

    })

    //fetch the vendor details 
    useEffect(() => {
        const getVendorDetails = async () => {
            try {
                const { data } = await authApi.get(`/api/vendor/details/${_id}`);

                if (data.success) {
                    setFormData(data.data);
                } else {
                    toast.error("Failed to fetch vendor details");
                }
            } catch (error) {
                console.log(error);
                toast.error("Error fetching vendor details");
            }
        }

        getVendorDetails();
    }, [])

    //State 
    const [cities, setCities] = useState([]);
    const [categories, setCategories] = useState([])
    const [localities, setLocalities] = useState([])
    const [similarVendors, setSimilarVendors] = useState([])


    const [loading, setLoading] = useState(false);

    //update the slug
    useEffect(() => {

        // Convert spaces to dashes and update the slug
        const newSlug = formData.brand_name.toLowerCase().replace(/\s+/g, '-');
        setFormData({ ...formData, slug: newSlug })

    }, [formData.brand_name])



    //Fetching category city and location
    useEffect(() => {

        const getData = async () => {

            //Get the cities
            const cities = await getCities();
            //get the category
            const categories = await getVendorCategories();


            const selectCityData = cities.map((item) => {
                return { label: item.name, value: item._id, }
            })
            const selectCategoryData = categories.map((item) => {
                return { label: item.name, value: item._id }
            })



            setCities(selectCityData)
            setCategories(selectCategoryData)


        }

        getData();

    }, [])


    //When city change we are fetching the locality and similar data
    useEffect(() => {

        const getData = async () => {


            if (!formData.city_id) {
                setLocalities([])
                formData.location_id = "";
                formData.similar_vendor_ids = [];
                setSimilarVendors([]);

                return;

            }

            if (!formData.vendor_category_id) {
                formData.similar_vendor_ids = [];
                setSimilarVendors([]);
          
            }



            //Extracting the id from the city slug
            const localities = await getLocalities(formData.city_id)
            const similarvendor = await getVendors(formData.city_id,formData.vendor_category_id);


            const selectLocalitiesData = localities.map((item) => {
                return { label: item.name, value: item._id }
            })
            const selectSimilarVendorData = similarvendor.map((item) => {
                return { label: item.brand_name, value: item._id }
            })


            setLocalities(selectLocalitiesData);
            setSimilarVendors(selectSimilarVendorData)

        }

        getData();

        // //When city chnage initilize the location with "" else it has the privious state value
        // formData.location_id = "";
        // formData.similar_vendor_ids = []

    }, [formData.city_id,formData.vendor_category_id])



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
    const handlePackageOptionCapacityValueChange = (newValue, event, index, key) => {

        const updatedArray = formData.package_option;
        updatedArray[index][key] = newValue;
        setFormData({ ...formData, package_option: updatedArray })

    };

    // Add the field in faqs
    const handleAddPackageOptionCapacity = () => {
        // alert("Click")
        // console.log("Clicked")
        const updatedArray = formData.package_option;

        setFormData({ ...formData, package_option: [...updatedArray, package_option] })
    }

    //Remove the faqs field when the user click on cross iocn
    const handleRemovePackageOption = (index) => {

        let newPackageOption = formData.package_option.filter((item, i) => {
            return i !== index
        });

        setFormData({ ...formData, package_option: newPackageOption })

    }



    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setFormData({ ...formData, summary: data })
        // console.log(data)
    };



    const handleSubmit = async () => {

        if (!formData.city_id || !formData.location_id || !formData.brand_name) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setLoading(true);
            const { data } = await authApi.post(`/api/vendor/update/${_id}`, formData);

            if (data.success) {
                toast.success("Vendor updated successfully");
                navigate("/vendor");
            }
            else {
                toast.error(data.message || "Failed to update vendor");
            }

        } catch (error) {
            console.log("Error is " + error);
            toast.error("An error occurred while updating vendor");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Panel bordered >
            <Form fluid>
                <Row style={{ marginBottom: "2rem", width: "100%" }}>
                    <Col xs={8}>
                        <Form.Group controlId="vendor_category_id">
                            <Form.Label>Category</Form.Label>
                            <Form.Control name="vendor_category_id" value={formData.vendor_category_id} block data={categories} accepter={SelectPicker} onChange={(value) => { handleFormData(value, { target: { name: "vendor_category_id" } }) }} />
                        </Form.Group>
                    </Col>
                    <Col xs={8}>
                        <Form.Group controlId="brand_name">
                            <Form.Label>Brand Name</Form.Label>
                            <Form.Control name="brand_name" value={formData.brand_name} onChange={handleFormData} />
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
                        <Form.Group controlId="similar_vendor_ids">
                            <Form.Label>Similar Vendor</Form.Label>
                            <Form.Control name="similar_vendor_ids" data={similarVendors} block value={formData.similar_vendor_ids} accepter={TagPicker} virtualized onChange={(value, event) => handleTagInput(value, { target: { name: "similar_vendor_ids" } })} />
                        </Form.Group>
                    </Col>
                </Row>

                <Row style={{ marginBottom: "2rem", width: "100%" }}>
                    <Form.Group controlId="vendor_address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control name="vendor_address" rows={2} accepter={Textarea} value={formData.vendor_address} onChange={handleFormData} />
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
                        <Form.Group controlId="package_price">
                            <Form.Label>Package Price</Form.Label>
                            <Form.Control name="package_price" accepter={NumberInput} value={formData.package_price} onChange={handleFormData} />
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group controlId="yrs_exp">
                            <Form.Label>Years of Experience</Form.Label>
                            <Form.Control name="yrs_exp" accepter={NumberInput} value={formData.yrs_exp} onChange={handleFormData} />
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
                    <Panel bordered header={<Stack spacing={8}><span>Package Options</span><IconButton appearance="primary" size="xs" icon={<PlusIcon />} onClick={handleAddPackageOptionCapacity}></IconButton></Stack>} style={{ marginBottom: "2rem", width: "100%" }}>
                        {
                            formData.package_option?.map((pack, i) => {
                                return (
                                    <Row key={i} style={{ marginBottom: "1rem", width: "100%" }}>
                                        <Col xs={5}>
                                            <Form.Group controlId={`package_name-${i}`}>
                                                <Form.Label>Package Name</Form.Label>
                                                <Form.Control name={`package_name-${i}`} value={pack.package_name} onChange={(value, event) => { handlePackageOptionCapacityValueChange(value, event, i, "package_name") }} />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={5}>
                                            <Form.Group controlId={`package_price-${i}`}>
                                                <Form.Label>Package Price</Form.Label>
                                                <Form.Control name={`package_price-${i}`} accepter={NumberInput} value={pack.package_price} onChange={(value, event) => { handlePackageOptionCapacityValueChange(value, event, i, "package_price") }} />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={2}>
                                            <Icon as={CloseIcon} size="2em" style={{ marginTop: "2rem", cursor: "pointer" }} onClick={() => { handleRemovePackageOption(i) }} />
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
                            data={formData.summary || ""}
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
                                placeholder: "Write vendor summary here...",
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


                <Row style={{ marginBottom: "2rem", width: "100%" }}>
                    <Panel bordered header={<span>Vendor Details:</span>} style={{width:"100%"}}>
                        <Row className="" style={{ marginBottom: "2rem", width: "100%" }}>
                            <Col xs={8}>
                                <Form.Group controlId="vendor_name">
                                    <Form.Control name="vendor_name" placeholder="Name" value={formData.vendor_name} onChange={handleFormData} />
                                </Form.Group>
                            </Col>
                            <Col xs={8}>
                                <Form.Group controlId="vendor_phone">
                                    <Form.Control name="vendor_phone" placeholder="Phone" value={formData.vendor_phone} onChange={handleFormData} />
                                </Form.Group>
                            </Col>
                            <Col xs={8}>
                                <Form.Group controlId="vendor_email">
                                    <Form.Control name="vendor_email" placeholder="Email" type="email" value={formData.vendor_email} onChange={handleFormData} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Panel>
                </Row>

                <Stack spacing={20} justifyContent="right">
                    <Button appearance="primary" loading={loading} onClick={handleSubmit}>Update</Button>
                    <Button appearance="default">Clear</Button>
                </Stack>



            </Form>

        </Panel>
    )
}