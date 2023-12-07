import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth } from "../firebase";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error.message);
    } 
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
      <div className="navbar bg-base-100 p-2">
        <div className="flex-1">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-ghost text-xl" onClick={handleLogout}>
            Logout
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
