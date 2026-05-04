const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Hàm tạo Token JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Thẻ có hạn trong 7 ngày
  });
};

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
};

// ĐĂNG KÝ TÀI KHOẢN
exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const newUser = await User.create({ email, password, role });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: { id: newUser._id, email: newUser.email, role: newUser.role },
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// ĐĂNG NHẬP
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Kiểm tra xem có nhập email và password không
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ email và mật khẩu" });
    }

    // 2. Tìm user và lấy luôn cả trường password (vì mặc định ta đã đặt select: false)
    const user = await User.findOne({ email }).select("+password");

    // 3. Kiểm tra user tồn tại và mật khẩu có đúng không (dùng hàm comparePassword đã viết ở Model)
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không chính xác" });
    }

    // 4. Nếu mọi thứ OK, gửi token về cho client
    const accessToken = signToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    // Lưu refresh token vào DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      accessToken,
      refreshToken,
      data: {
        user: { id: user._id, email: user.email, role: user.role },
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Không tìm thấy Refresh Token" });
    }

    // 1. Xác thực Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // 2. Kiểm tra Token có khớp với Token trong Database không
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(403)
        .json({ message: "Refresh Token không hợp lệ hoặc đã bị thu hồi" });
    }

    // 3. Cấp Access Token mới
    const newAccessToken = signToken(user._id);

    res.status(200).json({
      status: "success",
      accessToken: newAccessToken,
    });
  } catch (err) {
    res
      .status(403)
      .json({ message: "Refresh Token đã hết hạn, vui lòng đăng nhập lại" });
  }
};
