import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

function Register() {

    const [form, setform] = useState({});
    const navigate = useNavigate(); 

    const saveRoute = () =>{     
    }

    function handleInputChange(key, newValue){
        form[key] = newValue; // ex: form["username"] = "toto";
        setform(form);
        }

    const handleSubmit = async (e) => {
        e.preventDefault();

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

    if(form.password != form.confirmPassword){
        toast.error("Passwords don't match", toastOptions)
        return
    }

    if(!validatePassword(form.password)){
        toast.error("Passwords don't match criteria", toastOptions)
        return
    }

    const loginUrl = 'http://localhost:8080/auth/register';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            // 'authorization': localStorage.getItem('token') // to authenticate a protected route
        },
        body: JSON.stringify(form)
    }
    

    const response = await fetch(loginUrl, options)  
    
    if(response.status == 201){
        // const data = await response.json()
        // const token = data.accessToken;
        // localStorage.setItem('token', token);
        
        toast.success("Register successful", toastOptions);
        // setTimeout(() => {navigate('/home')}, 2000)
    }
    else{
        toast.error("Register failed", toastOptions);
    }

    function validatePassword(password){
        const lengthRegex = /.{8}.*/;
        const lengthTest = lengthRegex.test(password);
        console.log('lengthTest: ', lengthTest);

        const upperRegex = /[A-Z]/;
        const upperTest = upperRegex.test(password)
        console.log('upperTest: ', upperTest);

        const lowerRegex = /[a-z]/;
        const lowerTest = lowerRegex.test(password)
        console.log('lowerTest: ', lowerTest);

        const numbersRegex = /\d/;
        const numbersTest = numbersRegex.test(password)
        console.log('numbersTest: ', numbersTest);
        
        const specialRegex = /[!#$%&'*+\/=?^_`.{|}~-]/;
        const specialTest = specialRegex.test(password);
        console.log('specialTest: ', specialTest);

        return lengthTest && upperTest && lowerTest && numbersTest && specialTest;
    }
    }

  return (
      <div className="App">
        <h1>Create an Account</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email" className="form-label">Email address</label>
                    <input className="form-control" type="email" placeholder="Ex: example@example.com" aria-label=".form-control-sm example" required onChange={(event) => handleInputChange('email', event.target.value)}/>

                <label htmlFor="inputPassword" className="form-label">Password</label>
                <div className="col">
                    <input type="password" className="form-control" id="inputPassword" required onChange={(event) => handleInputChange('password', event.target.value)}/>
                </div>

                <label htmlFor="inputPassword" className="form-label" id="confirmPassword" >Confirm Password</label>
                    <div className="col">
                        <input type="password" className="form-control" id="confirmPassword" required onChange={(event) => handleInputChange('confirmPassword', event.target.value)}/>
                    </div>

                <label htmlFor="DOB" className="form-label">Date of Birth</label>
                    <input type="date" aria-label="DOB" className="form-control" required onChange={(event) => handleInputChange('dateOfBirth', event.target.value)}/>

                    <div className="dropdown m-2">
                        <label htmlFor="FOW" className="form-label me-2">Field of Work</label>
                        <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                            Field of Work
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">Education</a></li>
                            <li><a className="dropdown-item" href="#">Information</a></li>
                            <li><a className="dropdown-item" href="#">Health and Social Services</a></li>
                            <li><a className="dropdown-item" href="#">Manufacturing</a></li>
                        </ul>
                    </div>

                {/* <label className="form-check-label" htmlFor="firstCheckbox">I accept the terms and conditions </label>
                <input className="form-check-input ms-2" type="checkbox" value="false" id="termsCheckbox" required onChange={(event) => handleInputChange('terms', event.target.checked)}/> */}
                <div/>
                <button className='btn btn-success' type="submit">Create</button>
                <div>Login? <a href='/Login'>Click here</a></div>
            </div>
        </form>
        <ToastContainer/>
    </div>
  )
}

export default Register