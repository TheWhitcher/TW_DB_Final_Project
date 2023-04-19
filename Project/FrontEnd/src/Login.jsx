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
        form[key] = newValue; // ex: form["username"] = "toto";
        setform(form);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginUrl = 'http://localhost:8080/auth/login';
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                // 'authorization': localStorage.getItem('token') // to authenticate a protected route
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
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label className="form-label" htmlFor="username">Email</label>
                    <input className="form-control" type="email" placeholder="Email" id="email" onChange={(event) => handleInputChange('email', event.target.value)}/>

                <label className="form-label" htmlFor="Password">Password</label>
                    <input className="form-control my-2" type="password" placeholder="Password" id="password" onChange={(event) => handleInputChange('password', event.target.value)}/>
                <button className='btn btn-success' type="submit" >Login</button>
            </div>
        </form>

        <div>New Register? <a href="./Register">Click Here</a></div>
        <div>Forgot Password? <a onClick={passAlert}>Click Here</a></div>
        <ToastContainer/>
    </div>
  )
}

export default Login