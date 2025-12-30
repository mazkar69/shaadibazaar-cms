import { Button, Col, Form, IconButton, Input, InputNumber, Panel, Row, SelectPicker, Stack, TagPicker } from "rsuite";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import PlusIcon from '@rsuite/icons/Plus';
import { useEffect, useState } from "react";
import CloseIcon from '@rsuite/icons/Close';
import { Icon } from "@rsuite/icons";
import getCities from "../../../utils/request/getCities.js";
import getLocalities from "../../../utils/request/getLocalities.js";
import PhoneNumbers from "../../../utils/json/phoneNumber.json"
import { useNavigate } from "react-router";
import getVendors from "../../../utils/request/getVendors.js";
import getVendorCategories from "../../../utils/request/getVendorCategories.js";
// console.log(VenueFeatureData)

export default function VendorAddForm() {

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

    //Fetching category city and category
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
            const similarvendor = await getVendors(formData.city_id, formData.vendor_category_id);


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

        //When city chnage initilize the location with "" else it has the privious state value
        formData.location_id = "";
        formData.similar_vendor_ids = []

    }, [formData.city_id, formData.vendor_category_id])

  

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

        // console.log(formData)

        if (!formData.city_id || !formData.location_id || !formData.brand_name) {
            alert("Select the required field")
            return
        }



        try {
            setLoading(true)
            let response = await fetch("/api/vendor/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            response = await response.json();

            if (response.success) {
                //Redirect to the listing page 
                navigate("/vendor")
            }
            else {
                alert(response.msg);
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
                <Row style={{ marginBottom: "2rem" }}>
                    <Col xs={8}>
                        <Form.Group controlId="venue_category_ids">
                            <Form.ControlLabel>Category </Form.ControlLabel>
                            <Form.Control name="vendor_category_id" value={formData.vendor_category_id} block data={categories} accepter={SelectPicker} onChange={(value) => { handleFormData(value, { target: { name: "vendor_category_id" } }) }} />
                        </Form.Group>
                    </Col>
                    <Col xs={8}>
                        <Form.Group controlId="name">
                            <Form.ControlLabel> Brand Name</Form.ControlLabel>
                            <Form.Control name="brand_name" value={formData.brand_name} onChange={handleFormData} />
                        </Form.Group>
                    </Col>
                    <Col xs={8}>
                        <Form.Group controlId="slug">
                            <Form.ControlLabel>Slug </Form.ControlLabel>
                            <Form.Control name="slug" value={formData.slug} disabled />
                        </Form.Group>
                    </Col>
                </Row>

                <Row style={{ marginBottom: "2rem" }}>

                    <Col xs={6}>
                        <Form.Group controlId="city">
                            <Form.ControlLabel>City </Form.ControlLabel>
                            <Form.Control name="city_id" block data={cities} accepter={SelectPicker} virtualized value={formData.city_id} onChange={(value, event) => handleFormData(value, { target: { name: "city_id" } })} />
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group controlId="location_id">
                            <Form.ControlLabel>Locality </Form.ControlLabel>
                            <Form.Control name="location_id" block data={localities} virtualized accepter={SelectPicker} value={formData.location_id} onChange={(value, event) => handleFormData(value, { target: { name: "location_id" } })} />
                        </Form.Group>
                    </Col>

                    <Col xs={12}>
                        <Form.Group controlId="similar_vendor_ids">
                            <Form.ControlLabel>Similar Vendor </Form.ControlLabel>
                            <Form.Control name="similar_vendor_ids" data={similarVendors} block value={formData.similar_vendor_ids} accepter={TagPicker} virtualized onChange={(value, event) => handleTagInput(value, { target: { name: "similar_vendor_ids" } })} />
                        </Form.Group>
                    </Col>

                </Row>

                <Row style={{ marginBottom: "2rem" }}>

                    <Form.Group controlId="venue_address">
                        <Form.ControlLabel>Address</Form.ControlLabel>
                        <Input name="vendor_address" rows={5} as="textarea" value={formData.vendor_address} onChange={handleFormData} />
                    </Form.Group>

                </Row>

                <Row className="show-grid" style={{ marginBottom: "2rem" }}>
                    <Col xs={6}>
                        <Form.Group controlId="phone">
                            <Form.ControlLabel>Phone </Form.ControlLabel>
                            <Form.Control name="phone" accepter={SelectPicker} block value={formData.phone} data={PhoneNumbers} onChange={(value) => handleFormData(value, { target: { name: "phone" } })} />
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group controlId="email">
                            <Form.ControlLabel>Email</Form.ControlLabel>
                            <Form.Control name="email" type="email" value={formData.email} onChange={handleFormData} />
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group controlId="package_price">
                            <Form.ControlLabel>Package Price </Form.ControlLabel>
                            <Form.Control name="package_price" accepter={InputNumber} value={formData.package_price} onChange={handleFormData} />
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group controlId="yrs_exp">
                            <Form.ControlLabel>Year Of Exp. </Form.ControlLabel>
                            <Form.Control name="yrs_exp" accepter={InputNumber} value={formData.yrs_exp} onChange={handleFormData} />
                        </Form.Group>
                    </Col>



                </Row>


                <Row className="show-grid" style={{ marginBottom: "2rem" }}>
                    <Col xs={12}>
                        <Form.Group controlId="meta_title">
                            <Form.ControlLabel>Meta Title</Form.ControlLabel>
                            <Input name="meta_title" rows={2} value={formData.meta_title} onChange={handleFormData} as="textarea" />
                        </Form.Group>
                    </Col>
                    <Col xs={12}>
                        <Form.Group controlId="meta_description">
                            <Form.ControlLabel>Meta Description</Form.ControlLabel>
                            <Input name="meta_description" rows={2} value={formData.meta_description} onChange={handleFormData} as="textarea" />
                        </Form.Group>
                    </Col>

                </Row>


                <Row style={{ marginBottom: "2rem" }}>
                    <Panel bordered header={<Stack spacing={8}><span>Package Option</span><IconButton appearance="primary" size="xs" icon={<PlusIcon />} onClick={handleAddPackageOptionCapacity}></IconButton></Stack>} style={{ marginBottom: "2rem" }}>
                        {
                            formData.package_option?.map((pack, i) => {
                                return (
                                    <Row>
                                        <Col xs={10}>
                                            <Form.Group controlId={`package_name-${i}`}>
                                                <Form.ControlLabel>Package name</Form.ControlLabel>
                                                <Form.Control name={`package_name-${i}`} value={pack.package_name} onChange={(value, event) => { handlePackageOptionCapacityValueChange(value, event, i, "package_name") }} />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={10}>
                                            <Form.Group controlId={`package_price-${i}`}>
                                                <Form.ControlLabel>Package price</Form.ControlLabel>
                                                <Form.Control name={`package_price-${i}`} accepter={InputNumber} value={pack.package_price} onChange={(value, event) => { handlePackageOptionCapacityValueChange(value, event, i, "package_price") }} />
                                            </Form.Group>
                                        </Col>

                                        <Col xs={4}>
                                            <Icon as={CloseIcon} size="2em" style={{ marginTop: "2rem", cursor: "pointer" }} onClick={() => { handleRemovePackageOption(i) }} />
                                        </Col>
                                    </Row>
                                )
                            })
                        }

                    </Panel>
                </Row>


                <Row style={{ marginBottom: "2rem" }}>

                    <Form.Group controlId="summary">
                        <Form.ControlLabel>Summary</Form.ControlLabel>
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.summary}

                            onChange={handleEditorChange}


                        />
                    </Form.Group>
                </Row>


                <Row style={{ marginBottom: "2rem" }}>

                    <Panel bordered header={<span>Vendor Details:</span>} >

                        <Row>

                            <Col xs={8}>
                                <Form.Group controlId="vendor_name">
                                    {/* <Form.ControlLabel>Vendor Name</Form.ControlLabel> */}
                                    <Form.Control name="vendor_name" placeholder="Name" value={formData.vendor_name} onChange={handleFormData} />
                                </Form.Group>
                            </Col>

                            <Col xs={8}>
                                <Form.Group controlId="vendor_phone">
                                    {/* <Form.ControlLabel>Vendor Phone</Form.ControlLabel> */}
                                    <Form.Control name="vendor_phone" placeholder="Phone" value={formData.vendor_phone} onChange={handleFormData} />
                                </Form.Group>

                            </Col>
                            <Col xs={8}>
                                <Form.Group controlId="vendor_email">
                                    {/* <Form.ControlLabel>Vendor Phone</Form.ControlLabel> */}
                                    <Form.Control name="vendor_email" placeholder="Email" type="email" value={formData.vendor_email} onChange={handleFormData} />
                                </Form.Group>

                            </Col>

                        </Row>

                    </Panel>


                </Row>


                <Stack spacing={20} justifyContent="right">
                    <Button appearance="primary" loading={loading} onClick={handleSubmit}>Submit</Button>
                    <Button appearance="default">Clear</Button>
                </Stack>



            </Form>

        </Panel>
    )
}