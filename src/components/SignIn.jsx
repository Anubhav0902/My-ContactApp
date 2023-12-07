import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Typed from "typed.js";
import { IoMdContacts } from "react-icons/io";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        if (user) {
          navigate("/home");
        }
        setLoading(false);
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
      strings: ["Connect with Our Contact App!", "Organize, connect, and communicate effortlessly.", "Connect with Our Contact App!"],
      typeSpeed: 40,
      backSpeed: 40,
      backDelay: 1000,
      startDelay: 1000,
      showCursor: false,
    };

    // Create a new Typed instance
    const typed = new Typed(".typing-element-header", options);

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
            <h1 className="text-4xl font-bold typing-element-header"></h1>
            <p className="py-6">Welcome back to the Contact App Community! Sign in to your account and continue managing your contacts with ease. Explore the seamless experience of staying connected and organized.</p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit}>
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
                <label className="label">
                  <Link to="/forgot-password" className="label-text-alt link link-hover">
                    Forgot password?
                  </Link>
                </label>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">{loading ? <span className="loading loading-dots loading-md"></span> : "Login"}</button>
              </div>
              <p className="mt-4">
                Do Not Have An Account ?{" "}
                <Link to="/signup" className="link link-primary">
                  Register now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
