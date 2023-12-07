import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import Typed from 'typed.js';

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        user.displayName = name;

        console.log(user);
        setLoading(false);
        navigate("/signin");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
        setLoading(false);
        // Display toast notification for the error
        toast.error(errorMessage);
      });
  };

  useEffect(() => {
    // Options for the Typed instance
    const options = {
      strings: ["Join the Contact App Community!", "Discover a new way to manage contacts.", "Organize, connect, and communicate effortlessly."],
      typeSpeed: 40,
      backSpeed: 40,
      backDelay: 1000,
      startDelay: 1000,
      showCursor: false,
    };

    // Create a new Typed instance
    const typed = new Typed(".typing-element", options);

    // Clean up the Typed instance on component unmount
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div>
      <ToastContainer />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left lg:mx-40">
            <h1 className="text-4xl font-bold typing-element"></h1>
            <p className="py-6">Elevate your contact management experience with our cutting-edge Contact App. Seamlessly register and explore a world where organizing your connections is a breeze. Connect, communicate, and stay organized effortlessly. Sign up now to embark on a journey of hassle-free contact management.</p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Name</span>
                </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Your Name" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Your Email" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Your Password" className="input input-bordered" required />
          
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">{loading ? <span className="loading loading-dots loading-md"></span> : "Register Now"}</button>
              </div>
              <p className="mt-4">
                Already Have An Account ?{" "}
                <Link to="/signin" className="link link-primary">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
