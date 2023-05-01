import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

// Password requirement tests
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

    const results = {
        length: lengthTest,
        upper: upperTest,
        lower: lowerTest,
        number: numbersTest,
        special: specialTest,
    }

    return results
}

// Register a new user
function Register() {
    const [form, setform] = useState({});
    const navigate = useNavigate(); 

    // Handles change of input in pages components.
    function handleInputChange(key, newValue){
        form[key] = newValue;
        setform(form);
        }

    // Handle submit button.
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
    
    // Password validation.
    const results = validatePassword(form.password)

    if(!results.length){
        toast.error("Password must be at least 8 characters long.", toastOptions)
        return
    }
    else if(!results.upper){
        toast.error("Password must contain 1 upper case letter.", toastOptions)
        return
    }
    else if(!results.lower){
        toast.error("Password must contain 1 lower case letter.", toastOptions)
        return
    }
    else if(!results.number){
        toast.error("Password must contain 1 number.", toastOptions)
        return
    }
    else if(!results.special){
        toast.error("Password must contain 1 special character.", toastOptions)
        return
    }

    const loginUrl = 'http://localhost:8080/user/register';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(form)
    }
    

    const response = await fetch(loginUrl, options)  
    
    if(response.status == 201){        
        toast.success("Register successful", toastOptions);
        setTimeout(() => {navigate('/login')}, 2000)
    }
    else{
        toast.error("Register failed", toastOptions);
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