const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")               
const User = require("../models/User");
const { validateEmail, validatePassword} = require("../utils/validator");

exports.signup = async (req, res) => {

  // Validate the input fields
  const { email, password, isAdmin } = req.body;
  
  if (!email && !password) {
    return res.status(400).json({emptyInput: { email: true, password: true }});
  }

  if (!email) {
    return res.status(400).json({emptyInput: { email: true, password: false }});
  }

  if (!password) {
    return res.status(400).json({emptyInput: { email: false, password: true }});
  }

  if (!validateEmail(email)) {
    return res.status(406).json({
      field: "email",
      message: "Please Enter valid email",
    });
  }
  if (!validatePassword(password)) {
    return res.status(406).json({
      field: "password",
      message: "Please Enter valid Password with length of 6 contain atleast one digit and special character",
    });
  }
  
  
  // Check if user already exists
  try{
    const user = await User.findOne({email});

    if(user){
      return res.status(400).json({ field: "email",message: "Email already in use" });
    }
  }
  catch(err){
    return res.status(500).json({ message: err.message });
  }

  const newUser = new User({
    email: email,
    password: await bcrypt.hash(password, (saltOrRounds = 10)),
    role: isAdmin ? "admin" : "user"
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


exports.login = async (req, res) => {
  // Validate the input fields
  const { email, password } = req.body;
  
  if (!email && !password) {
    return res.status(400).json({emptyInput: { email: true, password: true }});
  }

  if (!email) {
    return res.status(400).json({emptyInput: { email: true, password: false }});
  }

  if (!password) {
    return res.status(400).json({emptyInput: { email: false, password: true }});
  }

  if (!validateEmail(email)) {
    return res.status(406).json({
      field: "email",
      message: "Please Enter valid email",
    });
  }
  if (!validatePassword(password)) {
    return res.status(406).json({
      field: "password",
      message: "Please Enter valid Password with length of 6 contain atleast one digit and special character",
    });
  }
  

try{
  const user = await User.findOne({email});

  if(!user){
    return res.status(401).json({message: "User not Found"})
  }

  const comparePassword = await bcrypt.compare(req.body.password, user.password);

    if (!comparePassword) {
      return res.status(401).json({field: "password", message: "Wrong password"});
    }    

  const accessToken = jwt.sign(
    {
        id: user._id,
    },
    process.env.JWT_SEC,
        {expiresIn:"3d"}
    );

    const { password, ...others } = user._doc;  
    res.status(200).json({...others, accessToken});   

  }catch(error){
    return res.status(500).json({ message: error.message });
  }
};




exports.getProfile = async (req, res) => {

  
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    const accessToken = jwt.sign(
      {
          id: user.id,
      },
      process.env.JWT_SEC);
      

    if (!user) {
      return res.status(404).json({
        message: "Unable to find User Please login Again",
      });
    }

    return res
      .status(200)
      .json({ message: "Logged In", user, accessToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

};

