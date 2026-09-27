const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blacklist.model");

async function registerUserController(req, res) {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const isUserExisting = await userModel.findOne({
    $or: [{email}, {username}],
  });

  if (isUserExisting) {
    return res.status(400).json({ message: "User already exists!" });
  }
  // const newUser = new userModel({username, email, password})
  // await newUser.save()

  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "14d" },
  );

  res.cookie("token", token);
  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function loginUserController(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.json({
      message: "Invalid password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "14d" },
  );

  res.cookie("token", token);
  res.status(201).json({
    message: "User logged successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

// token blacklisting

async function logoutUserController(req, res){
    const token = req.cookies.token

    if(token){
        await tokenBlackListModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })
}


async function getMeController(req,res){
  
  const user = await userModel.findById(req.user.id)
  res.status(200).json({
    message: "user details fetched successfully"
    ,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  })
}



module.exports = {registerUserController, loginUserController, logoutUserController, getMeController};
