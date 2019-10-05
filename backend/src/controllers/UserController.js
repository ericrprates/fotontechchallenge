const User = require("../models/User").model;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, type: user.type },
    process.env.SECRET,
    {
      expiresIn: 8600
    }
  );
}

class UserController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (await User.findOne({ email }))
        return res.status(400).send({ error: "User already exists." });
      await User.create({
        name,
        email,
        password,
        type: "user"
      })
        .then(user => {
          user.password = undefined;
          return res
            .status(200)
            .send({ profile: user, token: generateToken(user) });
        })
        .catch(err => {
          console.log(err);
          return res.status(400).send({ error: "Registration failed." });
        });
    } catch (err) {
      console.log(err);
    }
  }

  async authenticate(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).send({ error: "User not found" });
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).send({ error: "Invalid password" });

    user.password = undefined;

    res.status(200).send({ profile: user, token: generateToken(user) });
  }
}

module.exports = new UserController();
