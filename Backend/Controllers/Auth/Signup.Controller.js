const { UserModel } = require("../../Models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const RegisterUser = async (req, res) => {
  const { email, name, username, gender } = req.body;
  let getbyemail = await UserModel.findOne({ email });
  if (getbyemail) {
    return res.send({ message: "User already exist" });
  }
  // ************************************************

  const password = Date.now();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rajendrapatelofficial@gmail.com",
      pass: "zxkyjqfuhiizmxrg",
    },
  });

  const mailOptions = {
    from: "rajendrapatelofficial@gmail.com",
    to: email,
    subject: `Account Details `,
    text: `This is your Password : ${password}. You can Even change this Password.`,
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.log("Smething");
      return res.send(error);
    }

    // ********************************************************

    const salt = await bcrypt.genSalt(10);
    const HashedPass = bcrypt.hash(password, salt);
    const newUser = new UserModel({
      email,
      HashedPass,
      name,
      username,
      gender,
    });

    try {
      let ReturnedUser = await newUser.save();
      let token = jwt.sign(
        {
          username: ReturnedUser.username,
          id: ReturnedUser._id,
        },
        process.env.JWT_KEY
      );
      res.send({ user: ReturnedUser, token: token, message: "Successful" });
    } catch (error) {
      res.send({ message: "server error" });
    }
  });
};

module.exports = { RegisterUser };
