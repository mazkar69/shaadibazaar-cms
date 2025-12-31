import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Form, Button, Panel, Stack, Divider } from 'rsuite';
import api from '../../utils/request/apiRequest';


const SignUp = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)


  const handleLogin = async () => {
    // console.log(formData)

    if (!formData.username || !formData.password) {
      alert("Invalid field");
      return;
    }

    try {
      setLoading("true")
      let { data } = await api.post("/api/login/admin", {
        email: formData.username,
        password: formData.password
      })


      if (data.success) {
        //save token to the stroage and redirect to the dashboard

        localStorage.setItem("x4976gtylCC", data.token)
        navigate("/");

      } else {
        //password or usename is  invalid
        alert("Invalid Credentials")
      }

    } catch (error) {
      alert("Internal server error")
      console.log(error)

    } finally {
      setLoading(false)
    }

  }


  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="column"
      style={{
        height: '100vh'
      }}
    >
      {/* <Brand style={{ marginBottom: 10 }} /> */}

      <Panel bordered style={{ background: '#fff', width: 400 }} header={<h3>Admin Login</h3>}>

        <Form fluid onChange={setFormData}>
          <Form.Group>
            <Form.ControlLabel>Username</Form.ControlLabel>
            <Form.Control name="username" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>
              <span>Password</span>
              <a style={{ float: 'right' }}>Forgot password?</a>
            </Form.ControlLabel>
            <Form.Control name="password" type="password" />
          </Form.Group>
          <Form.Group>
            <Stack spacing={6} divider={<Divider vertical />}>
              <Button appearance="primary" type='submit' loading={loading} onClick={handleLogin}>Sign in</Button>

            </Stack>
          </Form.Group>
        </Form>
      </Panel>
    </Stack>
  );
};

export default SignUp;
