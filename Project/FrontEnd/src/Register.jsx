import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

function Register() {

    const [form, setform] = useState({});
    const navigate = useNavigate(); 

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
                <div className="input-group mb-3">
                    <span className="input-group-text" id="email">Email</span>
                    <input type="email" className="form-control" placeholder="example@example.com" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" required onChange={(event) => handleInputChange('email', event.target.value)}/>
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="password">Password</span>
                    <input type="password" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" required onChange={(event) => handleInputChange('password', event.target.value)}/>
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="confirmPassword">Confirm Password</span>
                    <input type="password" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" required onChange={(event) => handleInputChange('confirmPassword', event.target.value)}/>
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="DOB">Date Of Birth</span>
                    <input type="date" className="form-control" aria-label="DOB" aria-describedby="inputGroup-sizing-default" required onChange={(event) => handleInputChange('dateOfBirth', event.target.value)}/>
                </div>

                <div className="input-group my-3">
                <label className="input-group-text" htmlFor="inputGroupSelect01">Field of Work</label>
                <select className="form-select" id="inputGroupSelect01" required onChange={(event) => handleInputChange('fieldOfWork', event.target.value)}>
                    <option value="None">None</option>
                    <option value="Education">Education</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Health and Social Services">Health and Social Services</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Intergalactic Assasin">Intergalactic Assasin</option>
                    <option value="Pokémon Trainer">Pokémon Trainer</option>
                </select>
                </div>
                
                <button className='btn btn-success mb-2' type="submit">Create</button>
                <div>Login? <a href='/Login'>Click here</a></div>
            </div>
        </form>
        <ToastContainer/>
    </div>
  )
}

export default Register