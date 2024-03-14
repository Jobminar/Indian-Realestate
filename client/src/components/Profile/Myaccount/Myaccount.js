// Myaccount.js
import React, { useState, useEffect } from "react";
import { Avatar, TextField, Button, IconButton, Card } from "@mui/material";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import "./myaccount.css"; // Import your custom styles
import { useNavigate } from "react-router-dom";

const Myaccount = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    title: "",
    fullname: "",
    avatar: "", // Ensure that the initial value is an empty string
  });

  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userString = sessionStorage.getItem("user");
  
    try {
      const user = userString ? JSON.parse(userString) : {};
  
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: user.password || "",
        title: user.title || "",
        fullname: user.fullname || "",
        avatar: user.profileImage || "",
      });
  
      // Clean up the base64 string and set the cleaned data as the image state
      const cleanImageData = user.profileImage.replace(/\s/g, '');
      setImage(cleanImageData || null);  // Set to null if no image data is present
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);
  
 


  const handleInputChange = (e) => {
    if (e.target.name === "avatar") {
      const selectedFile = e.target.files[0];
  
      if (selectedFile) {
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setFormData((prevData) => ({
            ...prevData,
            avatar: reader.result,
          }));
  
          setImage(reader.result);
        };
  
        reader.readAsDataURL(selectedFile);
      } else {
      
        setFormData((prevData) => ({
          ...prevData,
          avatar: "",
        }));
  
        setImage(null);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
    }
  };
  
  const handleUpdate = async () => {
    try {
      const userString = sessionStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : {};
      const userId = user._id;

      const response = await fetch(
        `http://localhost:3000/auth/update-profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Update successful:", data);
        alert("Successful Update");
        navigate("/")

       
        sessionStorage.setItem("user", JSON.stringify({ ...user, ...formData }));

        setIsEditing(false);
      } else {
        console.error("Update failed:", data.error);
      }
    } catch (error) {
      console.error("Error during update:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="total-divs">
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <h2>My Account</h2>

          {/* <Avatar
            alt="Profile Image"
            src={image || undefined}
            sx={{ width: 100, height: 100 }}
          /> */}

<Avatar
  alt="Profile Image"
  src={`data:image/jpeg;base64,${image}`}
  sx={{ width: 100, height: 100 }}
/>

        

        </div>

        <form className="form-fieldss">
          <div className="forminside">
            {Object.keys(formData).map((key) => (
              key !== "avatar" && (
                <TextField
                  key={key}
                  type={key === "password" ? "password" : "text"}
                  name={key}
                  className="inputs"
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={formData[key]}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              )
            ))}

            <TextField
              type="file"
              name="avatar"
              className="inputs"
              onChange={handleInputChange}
              accept="image/*"
              disabled={!isEditing}
            />

            <center className="center">
              {isEditing ? (
                <Button
                  sx={{ border: "none", background: "#9E5C08" }}
                  variant="contained"
                  className="buttonsmy"
                  onClick={handleUpdate}
                >
                  Update
                </Button>
              ) : (
                <IconButton onClick={handleEditClick}>
                  Edit: <EditCalendarIcon />
                </IconButton>
              )}
            </center>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Myaccount;
