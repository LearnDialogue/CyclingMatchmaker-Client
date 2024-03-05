import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import "../styles/signup.css";
import LoaderWheel from "../components/LoaderWheel";
import { gql, useMutation, useQuery, useLazyQuery } from '@apollo/client';

const SignupPage = () => {

    const passwordValidator = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/;
    const [passwordError, setPasswordError] = useState<string>("");
    //const [loading, setLoading] = useState<boolean>(false);

    const [username, setUserName] = useState<string>("");
    const [email, setEmailAddress] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [reTypedPassword, setReTypedPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [sex, setSex] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [weight, setWeight] = useState<number>();

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const [currentRegisterPage, setCurrentRegisterPage] = useState<'Page1' | 'Page2'>('Page1');

    const [registerErrorMessage, setRegisterErrorMessage] = useState<string>("");

    const [isRegisterValid, setIsRegisterValid] = useState<boolean>(false);


    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        sex: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        birthday: "",
        metric: false,
        weight: 0,
      });

      // Register mutation
      const [addUser, { loading }] = useMutation(REGISTER_USER, {
        onCompleted() {
            setErrors({});
            setIsRegisterValid(true);
        },
        onError(err) {
            console.log(values)
            console.error("GraphQL Mutation Error:", err);
            console.log("GraphQL Errors:", err.graphQLErrors);
            setErrors(err.graphQLErrors);
            const errorObject = (err.graphQLErrors[0] as any)?.extensions?.exception?.errors
            const errorMessage = Object.values(errorObject).flat().join(', ');
            setRegisterErrorMessage(errorMessage);
        },
    
        variables: values,
      });

      const [usernameError, setUsernameError] = useState({});
      const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true);
      const [emailError, setEmailError] = useState({});
      const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
      const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>("");
      const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
      const [isUsernameLoading, setIsUsernameLoading] = useState<boolean>(true);
      const [isEmailLoading, setIsEmailLoading] = useState<boolean>(true);
      const [validateUsername, { loading: usernameLoading, error, data}]= useLazyQuery(VALIDATE_USERNAME, {
        onCompleted() {
            setUsernameError({});
            setIsUsernameLoading(usernameLoading);
        },
        onError: (error) => {
            setUsernameError(error);
            const errorObject = (error.graphQLErrors[0] as any)?.extensions?.exception?.errors
            const errorMessage = Object.values(errorObject).flat().join(', ');
            setUsernameErrorMessage(errorMessage);
          },
      });

      const [validateEmail ,{ loading: emailLoading, error: emailErr, data: emailData }] = useLazyQuery(VALIDATE_EMAIL, {
        onCompleted() {
            setEmailError({});
            setIsEmailLoading(emailLoading);
        },
        onError: (error) => {
            setEmailError(error);
            const errorObject = (error.graphQLErrors[0] as any)?.extensions?.exception?.errors
            const errorMessage = Object.values(errorObject).flat().join(', ');
            setEmailErrorMessage(errorMessage);
          },
      });

      function registerUser() {
        addUser();
      }

    const handleUsernameChange = (e: any) => {
        const updatedUsername = e.target.value;
        setValues((prevValues) => ({
        ...prevValues,
        username: updatedUsername,
        }));
        setUserName(e.target.value);
    }

    const handleEmailAddressChange = (e: any) => {
        const updatedEmail = e.target.value;
        setValues((prevValues) => ({
        ...prevValues,
        email: updatedEmail,
        }));
        setEmailAddress(e.target.value);
    
    }

    const handlePasswordChange = (e: any) => {
        const updatedPassword = e.target.value;
        setValues((prevValues) => ({
        ...prevValues,
        password: updatedPassword,
        }));
        setPassword(e.target.value);
    }

    const handleReTypedPasswordChange = (e: any) => {
        const confirmedPassword = e.target.value;
        setValues((prevValues) => ({
        ...prevValues,
        confirmPassword: confirmedPassword,
        }));
        setReTypedPassword(e.target.value);
    }

    const handleFirstNameChange = (e: any) => {
        const updatedFirstName = e.target.value;
        setValues((prevValues) => ({
        ...prevValues,
        firstName: updatedFirstName,
        }));
        setFirstName(e.target.value);
    }
    const handleLastNameChange = (e: any) => {
        const updatedLastName = e.target.value;
        setValues((prevValues) => ({
        ...prevValues,
        lastName: updatedLastName,
        }));
        setLastName(e.target.value);
    }
    const handleSexChange = (e: any) => {
        const updatedSex = e.target.value;
        setValues((prevValues) => ({
        ...prevValues,
        sex: updatedSex,
        }));
        setSex(e.target.value);
    }
    const handleWeightChange = (e: any) => {
        const updatedWeight = parseInt(e.target.value, 10); 
        setValues((prevValues) => ({
        ...prevValues,
        weight: updatedWeight,
        }));
        setWeight(e.target.value);
    }
    const handleBirthdayChange = (e: any) => {
        const updatedBirthday = e.target.value;
        setValues((prevValues) => ({
        ...prevValues,
        birthday: updatedBirthday,
        }));
        setBirthday(e.target.value);
    }

    // User registered/redirect
    const handleClose = () => {
        console.log("Registering user...");
        navigate('/login')
      };

    // Try to register user
    const handleSignUp = () => {
        //setLoading(true);
        registerUser();
        // if(Object.keys(errors).length === 0) {
        //     handleClose();
        // }
    }

    useEffect(() => {
        if (isRegisterValid) {
          // setLoading(true);
            handleClose();
        }
      }, [isRegisterValid]);

    // Check username and email are valid to continue registering
    const handleContinue = async () => {
        const [usernameResult, emailResult] = await Promise.all([
            validateUsername({ variables: { username } }),
            validateEmail({ variables: { email } }),
          ]);

        if (!usernameResult.error && usernameResult.data.validUsername === false) {
            setIsUsernameValid(false);
        } 
        else {
            setIsUsernameValid(true);
        }
    
           // setIsUsernameValid(usernameResult.data.validUsername);
        
        if(!emailResult.error && emailResult.data.validEmail === false) {
            setIsEmailValid(false);
        }
        else{
            setIsEmailValid(true);
        }
        
        if (password === "") {
            setPasswordError("Password is required.");
        } else if (!password.match(passwordValidator)) {
            setPasswordError(
            "Passwords must be at least 8 characters, must contain at least one lowercase character, one uppercase character, one number, and one special character.");
        } else if (password !== reTypedPassword) {
            setPasswordError("Password and Confirm Password must match.");
        }
        else {
            if(usernameResult.data.validUsername && emailResult.data.validEmail &&  !emailResult.error && !usernameResult.error) {
                setCurrentRegisterPage('Page2');
            }
        }
     }

    if(loading){
        return(
            <div className="signup-loading" >
                <LoaderWheel />
            </div>
        )
    }

    return (
        // Page 1
        <div>
        {currentRegisterPage === 'Page1' && (

            <div className="signup-main-container" >
            <div className="signup-form-container" >
                <h1 className="signup-form-brand" >
                    <Link to="/" >Cycling matchmaker</Link>
                </h1>

                {Object.keys(usernameError).length !== 0 && 
                <div className="signup-form-input" >
                    <label>{usernameErrorMessage}</label>
                </div>}
                {!isUsernameValid && 
                <div className="signup-form-input" >
                    <label>Username Exists</label>
                </div>}
                {Object.keys(emailError).length !== 0 && 
                <div className="signup-form-input" >
                    <label>{emailErrorMessage}</label>
                </div>}
                {!isEmailValid && 
                <div className="signup-form-input" >
                    <label>Email Exists</label>
                </div>}
                {passwordError !== "" && 
                <div className="signup-form-input" >
                    <label>{passwordError}</label>
                </div>}


                <div className="signup-form-input" >
                    <label>Username</label>
                    <input onChange={handleUsernameChange} type="text" value={username} />
                </div>

                <div className="signup-form-input" >
                    <label>Email address</label>
                    <input onChange={handleEmailAddressChange} type="text" value={email} />
                </div>

                <div className="signup-form-input" >
                    <label>Password</label>
                    <input onChange={handlePasswordChange} type="password" value={password} />
                </div>

                <div className="signup-form-input" >
                    <label>Re-type Password</label>
                    <input onChange={handleReTypedPasswordChange} type="password" value={reTypedPassword} />
                </div>

                <div className="signup-form-signup-btn" >
                    <div onClick={handleContinue} >
                        <Button type="primary" >Continue</Button>
                    </div>
                    <span className="signup-form-to-signup" >Already have an account?<span><Link to="/login" >Login</Link></span></span>
                </div>
            </div>
        </div>
        )}
        {currentRegisterPage === 'Page2' && (

            <div className="signup-main-container" >
            <div className="signup-form-container" >
                <h1 className="signup-form-brand" >
                    <Link to="/" >Cycling matchmaker</Link>
                </h1>

                {registerErrorMessage !== "" && 
                <div className="signup-form-input" >
                    <label>{registerErrorMessage}</label>
                </div>}

                <div className="signup-form-input" >
                    <label>First Name</label>
                    <input onChange={handleFirstNameChange} type="text" value={firstName} />
                </div>

                <div className="signup-form-input" >
                    <label>Last Name</label>
                    <input onChange={handleLastNameChange} type="text" value={lastName} />
                </div>

                <div className="signup-form-input" >
                    <label>Sex</label>
                    <input onChange={handleSexChange} type="text" value={sex} />
                </div>

                <div className="signup-form-input" >
                    <label>Weight</label>
                    <input onChange={handleWeightChange} type="text" value={weight} />
                </div>

                <div className="signup-form-input" >
                    <label>Date of Birth (YYYY-MM-DD)</label>
                    <input onChange={handleBirthdayChange} type="text" value={birthday} />
                </div>

                <div className="signup-form-signup-btn" >
                    <div onClick={handleSignUp} >
                        <Button type="primary" >Sign Up</Button>
                    </div>
                    <span className="signup-form-to-signup" >Already have an account?<span><Link to="/login" >Login</Link></span></span>
                </div>
            </div>
            </div>
            )}
        </div>
    )
};
const REGISTER_USER = gql`
  mutation register(
    $firstName: String!
    $lastName: String!
    $email: String!
    $metric: Boolean!
    $sex: String!
    $username: String!
    $weight: Int!
    $password: String!
    $confirmPassword: String!
    $birthday: String!
  ) {
    register(
      registerInput: {
        birthday: $birthday,
        password: $password
        confirmPassword: $confirmPassword
        email: $email
        firstName: $firstName
        lastName: $lastName
        metric: $metric,
        sex: $sex
        username: $username
        weight: $weight
      }
    ) {
      email
      username
    }
  }
`;

const VALIDATE_USERNAME = gql`
  query validUsername($username: String!) {
    validUsername(username: $username)
  }
`;

const VALIDATE_EMAIL = gql`
  query validEmail($email: String!) {
    validEmail(email: $email) 
  }
`;
export default SignupPage;