const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connectToDatabase } = require("../../config/dbConn");

const handleLogin = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("User");
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password must be provided" });
  }

  const foundUser = await collection.findOne({ email });

  if (!foundUser) {
    return res
      .sendStatus(401)
      .json({ message: "User not found in our records." });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const role = foundUser.role;
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email,
          role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "300s" }
    );

    const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    foundUser.refreshToken = refreshToken;

    const result = await collection.updateOne(
      { _id: foundUser._id },
      { $set: { refreshToken } }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } else {
    return res.sendStatus(401);
  }
};

module.exports = { handleLogin };
