import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal,  SelectPicker } from "rsuite";
import EyeCloseIcon from '@rsuite/icons/EyeClose';

import toast from "react-hot-toast";
import { authApi } from "../../utils/request/apiRequest";

export default function UpdateUserModal({updateUserData, open, handleClose,refetch}) {



    const role = [
        { label: "SuperAdmin", value: "superAdmin" },
        { label: "Admin", value: "admin" },
        { label: "Sales", value: "sales" },
    ]



    const [formData, setFormData] = useState({
        name: updateUserData?.name,
        phone: updateUserData?.phone || "",
        email: updateUserData?.email || "",
        password: updateUserData?.password || "",
        role: updateUserData?.role || "",
    })

    useEffect(()=>{

        setFormData({
            name: updateUserData?.name,
            phone: updateUserData?.phone || "",
            email: updateUserData?.email || "",
            password: updateUserData?.password || "",
            role: updateUserData?.role || "",
        })
    },[updateUserData])

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (value) => {
    


        try {
            setLoading(true);
            const { data } = await authApi.put(`/api/adminUser/update/${updateUserData?._id}`, formData);

            toast.success(data.message)
            setFormData({
                name: "",
                phone: "",
                email: "",
                password: "",
                role: ""
            })


            handleClose();
            refetch();

        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
        finally {
            setLoading(false)
        }

    }

    return (

        <Modal size={"xs"} open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Create User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form fluid formValue={formData} onChange={setFormData}>
                    <Form.Group controlId="name" >
                        <Form.ControlLabel >Name:</Form.ControlLabel>
                        <Form.Control name="name" placeholder="" />
                    </Form.Group>
                    <Form.Group controlId="phone" >
                        <Form.ControlLabel>Phone:</Form.ControlLabel>
                        <Form.Control name="phone" placeholder="" />
                    </Form.Group>
                    <Form.Group controlId="email" >
                        <Form.ControlLabel>Email:</Form.ControlLabel>
                        <Form.Control name="email" placeholder="" type="email" />
                    </Form.Group>
                    <Form.Group controlId="password" >
                        <Form.ControlLabel>Password:</Form.ControlLabel>
                        <InputGroup>
                            <Form.Control name="password" placeholder="" type={!showPassword ? "password" : "text"} />
                            <InputGroup.Button onClick={(e) => setShowPassword(!showPassword)}>
                                <EyeCloseIcon />
                            </InputGroup.Button>
                        </InputGroup>

                    </Form.Group>
                    <Form.Group controlId="role" >
                        <Form.ControlLabel>Role:</Form.ControlLabel>
                        <Form.Control name="role" accepter={SelectPicker} data={role} type="password" block searchable={false} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} appearance="subtle">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} appearance="primary" type="submit" loading={loading}>
                    Update
                </Button>
            </Modal.Footer>
        </Modal>
    )
}