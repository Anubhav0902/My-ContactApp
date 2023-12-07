import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { RiEditCircleLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { auth, firestore } from "../firebase";
import { collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdContacts } from "react-icons/io";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom"; // Import useHistory hook from react-router-dom

const Home = () => {
  const navigate = useNavigate(); // Initialize useHistory hook

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [updatingContactId, setUpdatingContactId] = useState(null); // State to track the contact being updated
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const modalRef = useRef(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStatusChecked, setAuthStatusChecked] = useState(false);

  const fetchContacts = async () => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const q = query(collection(firestore, "savedContacts"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const fetchedContacts = [];
      querySnapshot.forEach((doc) => {
        fetchedContacts.push({ id: doc.id, ...doc.data() });
      });
      setContacts(fetchedContacts);
    }
  };

  let unsubscribe;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        fetchContacts();
        setIsAuthenticated(true);
      } else {
        // No user is signed in
        setContacts([]);
        setIsAuthenticated(false);
        //  navigate("/signin");
      }
      setAuthStatusChecked(true); // Set auth status as checked
    });

    return () => {
      unsubscribe();
    };
  }, []); // Fetch contacts on initial load

  const addContacts = async (event) => {
    event.preventDefault();
    setLoading(true);
    const user = auth.currentUser;
    if (user && name && email && phone) {
      const userId = user.uid;
      try {
        const userRef = collection(firestore, "savedContacts");
        await addDoc(userRef, {
          name,
          email,
          phone,
          userId,
        });

        // Show success notification
        toast.success("Contact saved successfully!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
        });

        // Fetch contacts again after adding a new one
        fetchContacts();

        // Clear the input fields
        setName("");
        setEmail("");
        setPhone("");

        // Close the modal
        modalRef.current.close();
      } catch (error) {
        console.error(error);
        // Show error notification
        toast.error("Something went wrong!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
        });
      }
    } else {
      toast.error("Please fill all the fields!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
    setLoading(false);
  };

  // Function to delete a contact
  const deleteContact = async (contactId) => {
    try {
      await deleteDoc(doc(firestore, "savedContacts", contactId));

      // Fetch contacts again after deleting
      fetchContacts();

      // Show success notification
      toast.success("Contact deleted successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error(error);
      // Show error notification
      toast.error("Something went wrong!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  };

  // Function to update a contact
  const updateContact = async (contactId, updatedData) => {
    try {
      const contactRef = doc(firestore, "savedContacts", contactId);
      await updateDoc(contactRef, updatedData);

      // Fetch contacts again after updating
      fetchContacts();

      // Show success notification
      toast.success("Contact updated successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error(error);
      // Show error notification
      toast.error("Something went wrong!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  };

  // Event handler for delete icon
  const handleDelete = (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      deleteContact(contactId);
    }
  };

  // Event handler for update icon
  const handleUpdate = (contactId) => {
    const contactToUpdate = contacts.find((contact) => contact.id === contactId);

    if (contactToUpdate) {
      // Set the state with existing contact details
      setName(contactToUpdate.name);
      setEmail(contactToUpdate.email);
      setPhone(contactToUpdate.phone);

      // Set the contact ID being updated
      setUpdatingContactId(contactId);

      // Show the modal for updating contacts
      modalRef.current.showModal();
    }
  };

  // Event handler for update form submission
  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const user = auth.currentUser;
    if (user && name && email && phone && updatingContactId) {
      const userId = user.uid;
      const updatedData = {
        name,
        email,
        phone,
        userId,
      };

      // Update the contact details
      await updateContact(updatingContactId, updatedData);

      // Clear the input fields
      setName("");
      setEmail("");
      setPhone("");

      // Reset the updatingContactId state
      setUpdatingContactId(null);

      // Close the modal
      modalRef.current.close();
    } else {
      toast.error("Please fill all the fields!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }

    setLoading(false);
  };

  const handleModalClose = () => {
    // Reset the state when the modal is closed
    setName("");
    setEmail("");
    setPhone("");
    setUpdatingContactId(null);
  };

  const filterContacts = (searchTerm) => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const contactsRef = collection(firestore, "savedContacts");

      // Check if there's an existing subscription
      if (unsubscribe) {
        // Unsubscribe the previous listener to avoid conflicts
        unsubscribe();
      }

      // Subscribe to a new listener
      const newUnsubscribe = onSnapshot(query(contactsRef, where("userId", "==", userId)), (snapshot) => {
        const contactLists = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter contacts based on name, email, or phone
        const filteredContacts = contactLists.filter((contact) => {
          const lowerCaseSearchTerm = searchTerm.toLowerCase();
          return contact.name.toLowerCase().includes(lowerCaseSearchTerm) || contact.email.toLowerCase().includes(lowerCaseSearchTerm) || contact.phone.includes(searchTerm);
        });

        setContacts(filteredContacts);
      });

      // Save the new unsubscribe function
      unsubscribe = newUnsubscribe;
    }
  };

  // Event handler for search input change
  const handleSearchInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterContacts(term);
  };

  return (
    <>
      {authStatusChecked ? (
        isAuthenticated ? (
          <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
              <ToastContainer />

              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: "easeOut", duration: 1 }} className="card w-full max-w-[400px] shadow-2xl bg-base-100 p-4">
                <div className="flex justify-center gap-3">
                  <IoMdContacts size={35} className="my-0.5" />
                  <h1 className="text-center text-3xl font-semibold"> Contact-App</h1>
                </div>
                <div className="flex items-center gap-4 mb-4 my-2">
                  <CiSearch size={50} onClick={() => filterContacts(searchTerm)} className="cursor-pointer" />
                  <input type="text" placeholder="Search Contact" className="input w-full max-w-xs text-md" onChange={handleSearchInputChange} />
                  <CiCirclePlus size={50} onClick={() => modalRef.current.showModal()} className="cursor-pointer" />
                </div>

                {/* Render existing contacts */}
                <div className="mt-4 w-full overflow-y-auto overflow-x-auto max-h-96">
                  {loading && (
                    <div className="flex items-center justify-center">
                      <span className="loading loading-dots loading-md"></span>
                    </div>
                  )}
                  {/* Check if contacts array is empty */}
                  {contacts.length === 0 ? (
                    <p className="text-center text-gray-500">Contact list is empty</p>
                  ) : (
                    // Render contacts if array is not empty
                    contacts.map((contact) => (
                      <motion.div key={contact.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: "easeOut", duration: 0.5 }} className="card w-full max-w-[500px] bg-base-100 p-4 mb-4 hover:shadow-md cursor-pointer transition duration-300 relative">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <FaRegUserCircle size={30} />
                            </div>
                            <div className="text-sm">
                              <h2 className="card-title">{contact.name}</h2>
                              <p>{contact.email}</p>
                              <p>{contact.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center absolute top-0 right-0 m-2 gap-1">
                            <RiEditCircleLine size={30} className="cursor-pointer" onClick={() => handleUpdate(contact.id)} />
                            <MdDelete size={30} className="cursor-pointer" onClick={() => handleDelete(contact.id)} />
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>

              <dialog id="my_modal_3" className="modal fixed inset-0  bg-opacity-75 z-50 rounded-md" ref={modalRef} onClose={handleModalClose}>
                <div className="modal-box mx-auto p-6 rounded shadow-lg">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost text-coolGray-800 absolute right-2 top-2" onClick={() => modalRef.current.close()}>
                      ✕
                    </button>
                  </form>
                  <h3 className="font-bold text-2xl mb-4 text-coolGray-800">{updatingContactId ? "Update Contact Details" : "Enter Contact Details!!!"}</h3>
                  <div className="card w-full max-w-[400px] bg-coolGray-800 p-4 text-white rounded-md m-auto">
                    <form className="card-body" onSubmit={updatingContactId ? handleUpdateSubmit : addContacts}>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text font-semibold">Name</span>
                        </label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Your Name" className="input input-bordered w-full" required />
                      </div>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text font-semibold">Email</span>
                        </label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Your Email" className="input input-bordered w-full" required />
                      </div>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text font-semibold">Phone No.</span>
                        </label>
                        <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Your Phone No." className="input input-bordered w-full" required />
                      </div>
                      <div className="form-control mt-6">
                        <button className="btn btn-primary bg-coolGray-100 text-coolGray-800 hover:bg-coolGray-200 hover:text-coolGray-800 transition-all duration-300">{loading ? <span className="loading loading-dots loading-md"></span> : updatingContactId ? "Update Contact" : "Add Contact"}</button>
                      </div>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="text-center text-golden-500">
              <p className="text-lg font-semibold mb-4">Please login first.</p>
              <button className="btn btn-primary" onClick={() => navigate("/signin")}>
                Go to Sign In
              </button>
            </div>
          </div>
        )
      ) : (
        // Render loading message while checking auth status
        <div className="flex items-center justify-center h-screen">
          <span className="loading loading-dots loading-md"></span>
        </div>
      )}
    </>
  );
};

export default Home;
