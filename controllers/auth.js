const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const config = require("config");
const dotenv = require("dotenv");
const { User } = require("../models/User");
const nodemailer = require("nodemailer");
let refreshTokens = [];
dotenv.config();

const authController = {
  transporter: nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  }),

  sendMail: async (req, res) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const user = await User.findById(req.params.id);
    user.otp = otp;
    await user.save();
    console.log(user);
    const username = user.username;
    const email = user.email;
    const mailOptions = {
      from: "Timphongtro.vn",
      to: email,
      subject: "[Timphongtro.vn] Mã xác thực Timphongtro.vn của bạn",
      html: `<h1>Mã xác thực bí mật Timphongtro.vn</h1>
      <h2>${username} thân mến,</h2>
      <p>Đây là mã xác thực bí mật của bạn: <strong>${otp}</strong></p>
      <p>Mã bí mật này không nên được chia sẻ với bất kỳ ai. Cám ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
      <p>Trân trọng,</p>
      <p>Timphongtro.vn</p> 
      `,
    };

    authController.transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return res.status(400).json(err);
      } else {
        console.log("Verification email is sent your gmail account");
        return res.status(200).json(info);
      }
    });
  },

  verifyEmail: async (req, res) => {
    const id = req.params.id;
    const otp = req.body.otp;
    const user = await User.findById(id);
    if (user.otp === parseInt(otp)) {
      user.isVerify = true;
      const newUser = await user.save();
      return res.status(200).json({ newUser });
    } else {
      return res.status(400).json("Email is not verified");
    }
  },
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30s" }
    );
  },
  // GENERATE REFRESH TOKEN
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },
  adminSignIn: async (req, res) => {
    if (req.body.username === "") {
      return res.status(400).json({ message: "Invalid username!" });
    }
    if (req.body.password === "") {
      return res.status(400).json({ message: "Invalid password!" });
    }
    try {
      const username = req.body.username;
      const password = req.body.password;

      const alreadyExistUser = await User.findOne({
        username: username,
      });

      if (!alreadyExistUser) {
        return res.status(400).json({ message: "User don't exist!" });
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        alreadyExistUser.password
      );
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect password!" });
      }
      if (!alreadyExistUser.admin) {
        return res.status(400).json({ message: "You are not an admin" });
      }
      if (alreadyExistUser && isPasswordCorrect && alreadyExistUser.admin) {
        const accessToken =
          authController.generateAccessToken(alreadyExistUser);
        const refreshToken =
          authController.generateRefreshToken(alreadyExistUser);
        // Lưu refreshToken vào mảng
        refreshTokens.push(refreshToken);
        res.cookie("refresh_token", refreshToken, {
          domain: "https://timphongtro-vn.vercel.app",
          secure: true,
          path: "/quan-tri-vien",
          sameSite: "none",
          httpOnly: false,
        });
        return res
          .status(200)
          .json({ user: alreadyExistUser, refreshToken, accessToken });
      }
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
  adminSignUp: async (req, res) => {
    try {
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;
      const hashPassword = await bcrypt.hash(password, 12);
      const existingEmail = await User.findOne({ email });
      const existingUsername = await User.findOne({ username });
      const memberCode = Math.floor(100000 + Math.random() * 900000);

      if (existingUsername) {
        return res.status(400).json("Username existed!");
      }
      if (existingEmail) {
        return res.status(400).json("Email existed!");
      }
      if (!password || password.length < 8) {
        return res.status(400).json("Invalid password!");
      }
      const user = await User.create({
        username: req.body.username,
        password: hashPassword,
        email: req.body.email,
        memberCode: "QTV" + memberCode,
        admin: true,
        isVerify: true,
      });
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  signInController: async (req, res) => {
    if (req.body.googleAccessToken) {
      // gogole-auth
      const { googleAccessToken } = req.body;
      axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo/", {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
            Accept: "application / json",
          },
        })
        .then(async (response) => {
          const memberCode = Math.floor(100000 + Math.random() * 900000);
          const fullName =
            response.data.family_name + " " + response.data.given_name;
          const username = response.data.email;
          const email = response.data.email;
          const profilePicture =
            response.data.picture ||
            "https://scontent-hkg4-2.xx.fbcdn.net/v/t39.30808-6/248794374_1491385281237517_7930428664753935404_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=174925&_nc_ohc=5lauKy6zDsMAX9wvFT6&tn=VeXMx7MBEtEDqia-&_nc_ht=scontent-hkg4-2.xx&oh=00_AT9zAmle7fzxSbIGPvrXOsjlUnIraF6SkS8peSiVHZ7rAA&oe=63302978";
          const typeAccount = "google";
          const existingUser = await User.findOne({ email });

          if (!existingUser) {
            const user = await User.create({
              email,
              fullName,
              username,
              profilePicture,
              typeAccount,
              isVerify: true,
              memberCode: "TPT" + memberCode,
              balance: 0,
            });
            console.log(user);
            const refreshToken = authController.generateRefreshToken(user);
            const accessToken = jwt.sign(
              {
                email: user.email,
                id: user._id,
              },
              config.get("JWT_SECRET"),
              { expiresIn: "365d" }
            );
            return res.status(200).json({ user, accessToken, refreshToken });
          } else {
            const refreshToken =
              authController.generateRefreshToken(existingUser);
            // Lưu refreshToken vào mảng
            refreshTokens.push(refreshToken);
            res.cookie("cookie_user", refreshToken, {
              domain: "https://timphongtro-vn.vercel.app",
              secure: true,
              sameSite: "none",
              httpOnly: false,
              // domain: "localhost:3000",
            });

            // access token
            const accessToken = jwt.sign(
              {
                email: existingUser.email,
                id: existingUser._id,
              },
              config.get("JWT_SECRET"),
              { expiresIn: "365d" }
            );
            return res
              .status(200)
              .json({ user: existingUser, accessToken, refreshToken });
          }
        });
      // .catch((error) => {
      //   return res.json({ error });
      // });
    } else {
      if (req.body.username === "") {
        return res.status(400).json({ message: "Invalid username!" });
      }
      if (req.body.password === "") {
        return res.status(400).json({ message: "Invalid password!" });
      }
      try {
        const username = req.body.username;
        const password = req.body.password;

        const alreadyExistUser = await User.findOne({
          username: username,
        });

        if (!alreadyExistUser) {
          return res.status(400).json({ message: "User don't exist!" });
        }

        const isPasswordCorrect = await bcrypt.compare(
          req.body.password,
          alreadyExistUser.password
        );
        if (!isPasswordCorrect) {
          return res.status(400).json({ message: "Incorrect password!" });
        }

        if (alreadyExistUser && isPasswordCorrect) {
          const accessToken =
            authController.generateAccessToken(alreadyExistUser);
          const refreshToken =
            authController.generateRefreshToken(alreadyExistUser);
          // Lưu refreshToken vào mảng
          refreshTokens.push(refreshToken);
          res.cookie("cookie_user", refreshToken, {
            domain: "https://timphongtro-vn.vercel.app",
            secure: true,
            sameSite: "none",
            httpOnly: false,
          });
          res
            .status(200)
            .json({ user: alreadyExistUser, refreshToken, accessToken });
        }
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }
  },

  signUpController: async (req, res) => {
    try {
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;
      const fullName = req.body.fullName;
      const { dateOfBirth } = req.body;
      const { gender } = req.body;
      const { address } = req.body;
      const { phoneNumber } = req.body;

      const hashPassword = await bcrypt.hash(password, 12);
      const existingEmail = await User.findOne({ email });

      const existingUsername = await User.findOne({ username });
      const memberCode = Math.floor(100000 + Math.random() * 900000);

      if (existingUsername) {
        return res.status(400).json("Username existed!");
      } else if (existingEmail) {
        return res.status(400).json("Email existed!");
      } else if (!password || password.length < 8) {
        return res.status(400).json("Invalid password!");
      }

      const user = await User.create({
        username: req.body.username,
        password: hashPassword,
        email: req.body.email,
        memberCode: "TPT" + memberCode,
        fullName,
        dateOfBirth,
        address,
        gender,
        phoneNumber,
        isVerify: true,
        balance: 0,
      });

      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
    // }
  },

  requestRefreshToken: async (req, res) => {
    // Lấy refreshToken từ user
    const cookie_user = req.cookies.cookie_user;

    if (!cookie_user) {
      return res.status(401).json("You are not authenticated!");
    }

    // Nếu mảng không chứa refresh token cũ thì báo lỗi
    if (!refreshTokens.includes(cookie_user)) {
      return res.status(403).json("Refresh token is not valid!");
    }
    // Verify refreshToken. Nếu lỗi thì báo lỗi, nếu không lỗi thì sau khi accessToken hết hạn (30s),
    // thì sẽ dùng refreshToken cũ để tạo accessToken và refreshToken mới.
    jwt.verify(cookie_user, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      // Lọc mảng để xóa refreshToken cũ
      refreshTokens = refreshTokens.filter((token) => token !== cookie_user);
      // Create new refreshToken, accessToken
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      // Thêm newRefreshToken vào mảng
      refreshTokens.push(newRefreshToken);
      res.cookie("cookie_user", newRefreshToken, {
        domain: "https://timphongtro-vn.vercel.app",
        secure: true,
        sameSite: "none",
        httpOnly: false,

        // domain: "localhost:3000",
        // sameSite: "strict",
      });

      return res.status(200).json({ accessToken: newAccessToken });
    });
  },
  requestRefreshTokenAdmin: async (req, res) => {
    // Lấy refreshToken từ user
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      return res.status(401).json("You are not authenticated!");
    }

    // Nếu mảng không chứa refresh token cũ thì báo lỗi
    if (!refreshTokens.includes(refresh_token)) {
      return res.status(403).json("Refresh token is not valid!");
    }
    // Verify refreshToken. Nếu lỗi thì báo lỗi, nếu không lỗi thì sau khi accessToken hết hạn (30s),
    // thì sẽ dùng refreshToken cũ để tạo accessToken và refreshToken mới.
    jwt.verify(refresh_token, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      // Lọc mảng để xóa refreshToken cũ
      refreshTokens = refreshTokens.filter((token) => token !== refresh_token);
      // Create new refreshToken, accessToken
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      // Thêm newRefreshToken vào mảng
      refreshTokens.push(newRefreshToken);
      res.cookie("refresh_token", newRefreshToken, {
        domain: "https://timphongtro-vn.vercel.app",
        secure: true,
        path: "/quan-tri-vien",
        sameSite: "none",
        httpOnly: false,

        // domain: "localhost:3000",
        // sameSite: "strict",
      });

      return res.status(200).json({ accessToken: newAccessToken });
    });
  },
  logoutUser: async (req, res) => {
    res.clearCookie("cookie_user");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    return res.status(200).json("Logged out!");
  },
  logoutAdmin: async (req, res) => {
    res.clearCookie("refresh_token");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    return res.status(200).json("Logged out!");
  },

  updatePassword: async (req, res) => {
    try {
      const id = req.params.id;
      const { oldPassword } = req.body;
      const { newPassword } = req.body;
      console.log(oldPassword, newPassword);
      const user = await User.findById(id);
      if (oldPassword) {
        const comparePassword = await bcrypt.compare(
          oldPassword,
          user.password
        );
        if (comparePassword) {
          user.password = await bcrypt.hash(newPassword, 12);
          await user.save();
          return res.status(200).json({ user });
        }
        if (!comparePassword) {
          return res.status(500).json("incorrect password");
        }
      }

      if (!oldPassword && newPassword) {
        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();
        return res.status(200).json({ user });
      }
    } catch (error) {
      return res.status(500).json("incorrect password");
    }
  },
};

module.exports = authController;
