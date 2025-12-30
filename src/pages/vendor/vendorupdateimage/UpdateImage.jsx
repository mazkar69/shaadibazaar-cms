import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { Button,  Panel, Stack } from "rsuite";
import { MdDelete, MdCloudUpload } from "react-icons/md";
import { SortableImage } from "../../venue/venueupdateimage/SortableImage.jsx";  //From venue (UpdateImage)

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';

import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';



export default function UpdateImage({ setName }) {

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );





    const domain = "/public/uploads/";

    const { _id } = useParams();


    const inputFile = useRef()



    const [uploadedImages, setUploadedImages] = useState([]);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);


    //This will fetch the images by _id
    useEffect(() => {
        const getImages = async () => {

            let vendor = await fetch(`/api/vendor/get-images/${_id}`)
            const { data } = await vendor.json()

            // console.log(images)
            setUploadedImages(data.images)
            setName(data.name)
        }

        getImages();
    }, [])


    //When use selected the images from local machine, that images will be set in the Images state, and then this useEffect will run and make the Preview of selected images and store the url in imagePreview state
    useEffect(() => {
        const newImagePreviews = [];

        for (let i = 0; i < images?.length; ++i) {

            newImagePreviews.push(URL.createObjectURL(images[i]));

        }
        setImagePreviews(newImagePreviews);

    }, [images])



    // On change of image, This will run when a user select the images from the local machine This method will check the validation like img extendion and size, If all the validation is correct then save in Images state.
    const handleImageChange = (e) => {
        const selectedImages = Array.from(e.target.files);
        let isValid = true;


        // Validation
        for (let img of selectedImages) {
            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(img.type)) {
                alert('Only jpg, jpeg, and png files are allowed.');
                isValid = false;
                break;
            }

            if (img.size > 5 * 1024 * 1024) { // 5MB
                alert('Image size should not be more than 5MB.');
                isValid = false;
                break;
            }

        }

        if (isValid) {
            setImages(selectedImages);
        } else {
            e.target.value = null; // Reset input value
        }
    };



    //This will delete the preview image form the array of blob
    const deletePreview = (index) => {

        const newImages = images.filter((url, i) => {
            return i !== index;
        })
        setImages(newImages);

    }


    //This function will run on click of update btn. This function will update the new selected images and return the updated images.
    const handleUpdate = async () => {
        setLoading(true)

        if (images.length === 0) {          //If no imaes is selected then return 
            console.error('No images selected.');
            return;
        }


        //Creating the from data, because we are sending  new images in the form of  formData.
        const formData = new FormData();




        //To append the multiple images in an aray
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }



        try {
            //Making request to update the images
            const url = `/api/vendor/upload-images/${_id}`;

            let response = await fetch(url, {
                method: "POST",
                headers: {
                    // 'Content-Type': 'application/json',
                    // 'Content-Type': 'multipart/form-data',
                    // "bearer": token,
                },
                body: formData
            })


            response = await response.json();
            // console.log("Response:")
            // console.log(response);

            if (response.success) {
                setUploadedImages(response.data)
                alert("Successfully ")
                setImages([]);
                setImagePreviews([]);
            } else {
                alert("something went wroung")
            }
        } catch (error) {
            console.log(error)
            setLoading(false)

        }
        setLoading(false)

    };

    const handleClearBtn = () => {
        setImages([]);
        setImagePreviews([]);
        setLoading(false)
    }

    const handleDelete = async (imageName) => {

        try {

            //Making request to delte the images
            const url = `/api/vendor/delete-image/${_id}`;

            let response = await fetch(url, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'multipart/form-data',
                    // "bearer": token,
                },
                body: JSON.stringify({ imageName })
            })


            response = await response.json();
            // console.log("Response:")
            // console.log(response);

            if (response.success) {
                setUploadedImages(response.data)
                alert(" Delete Successfully ")
                setImages([]);
                setImagePreviews([]);
            } else {
                alert("something went wroung")
            }
        } catch (error) {
            console.log(error)

        }
    }



        //When the image position change on dragend this function will be called and it will update the image position.
        async function updateImagePosition(updateImageList) {

            try {
    
                //Making request to delte the images
                const url = `/api/vendor/update-image/${_id}`;
    
                let response = await fetch(url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Content-Type': 'multipart/form-data',
                        // "bearer": token,
                    },
                    body: JSON.stringify({ "images": updateImageList })
                })
    
    
                response = await response.json();
    
    
                if (response.success) {
                    console.log("Image successfully position.")
    
                } else {
                    alert("something went wroung on drag and drop")
                }
            } catch (error) {
                console.log(error)
    
            }
    
        }
    
        //When image dragg and dropp
        function handleDragEnd(event) {
            const { active, over } = event;
    
            if (active.id !== over.id) {
                setUploadedImages((items) => {
                    const oldIndex = items.indexOf(active.id);
                    const newIndex = items.indexOf(over.id);
    
                    //Calling the api to update the position
                    updateImagePosition(arrayMove(items, oldIndex, newIndex))
    
                    //Return the updateList
                    return arrayMove(items, oldIndex, newIndex);
                });
            }
        }


    return (
        <div spacing={10} className="update-image-container">
            <Panel bordered onClick={() => inputFile.current.click()} title="Upload Images" style={{ cursor: "pointer" }}>

                <div className="upload-section">
                    <MdCloudUpload className="upload-icon" id="photo" />
                    <input type="file" multiple name='photo' className={"file"} id="photo" ref={inputFile} onChange={handleImageChange} />

                </div>


            </Panel>
            {
                images?.length > 0 && (

                    <Panel bordered header={<span>Preview images</span>}>
                        <div className="images-container">
                            {
                                imagePreviews?.map((img, i) => {
                                    return (
                                        <div className="image-card " key={i}>
                                            <img className="image" src={img} alt="venue-card" />
                                            <div className="overlay ">
                                                <MdDelete className="icon" onClick={() => deletePreview(i)} />
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>

                        <Panel>
                            <Stack spacing={10} justifyContent="flex-end">
                                <Button appearance="primary" onClick={handleUpdate} loading={loading}> Upload</Button>
                                <Button appearance="default" onClick={handleClearBtn}> clear</Button>
                            </Stack>
                        </Panel>


                    </Panel>


                )
            }

            <Panel bordered header={<span>Uploaded Images</span>} style={{ background: "white" }}>

                <div className="images-container">

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={uploadedImages}
                            strategy={horizontalListSortingStrategy}
                        >
                            {uploadedImages?.map(id => <SortableImage key={id} id={id} url={id} handleDelete={handleDelete} />)}
                        </SortableContext>
                    </DndContext>


                </div>


            </Panel>
        </div>


    )
}




