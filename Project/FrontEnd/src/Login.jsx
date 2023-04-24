import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

function Login() {
    const [form, setform] = useState({});
    const navigate = useNavigate(); 

    const passAlert = () =>{
        alert("SHAAAAAAAAAAAMMMMMEEEEE!!!")
    }
    
    function handleInputChange(key, newValue){
        form[key] = newValue;
        setform(form);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginUrl = 'http://localhost:8080/user/login';
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(form)
        }
        const response = await fetch(loginUrl, options)

        const toastOptions = {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        }

        if(response.status == 200){
            const data = await response.json()
            const token = data.accessToken;
            localStorage.setItem('token', token);
            
            toast.success("Login successful", toastOptions);
            setTimeout(() => {navigate('/home')}, 2000)
        }
        else{
            toast.error("Login failed", toastOptions);
        }

    }

  return (
    <div className="App">
        <h1 className="mb-3">Log In</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="email">Email</span>
                    <input type="email" className="form-control" placeholder="example@example.com" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" required onChange={(event) => handleInputChange('email', event.target.value)}/>
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="password">Password</span>
                    <input type="password" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" required onChange={(event) => handleInputChange('password', event.target.value)}/>
                </div>
                <button className='btn btn-success mb-3' type="submit">Login</button>
            </div>
        </form>

        <div>New Register? <a href="./Register">Click Here</a></div>
        <div>Forgot Password? <a onClick={passAlert}>Click Here</a></div>
        <ToastContainer/>
    </div>
  )
}

export default Login