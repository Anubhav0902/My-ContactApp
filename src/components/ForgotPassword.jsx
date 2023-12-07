import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was sent");
    } catch (error) {
      toast.error("Could not send reset email");
    }
  };

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div>
          <div className="card shrink-0 w-full max-w-md shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={onSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="email" placeholder="Enter Your Email" className="input input-bordered" value={email} onChange={onChange} required />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary" type="submit">
                  Reset Password
                </button>
              </div>
              <Link to="/signin" className="text-xs forgotPasswordLink">
                Back to Login
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
