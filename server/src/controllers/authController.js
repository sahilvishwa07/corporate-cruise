// import User from '../models/User.js';
// import Company from '../models/Company.js';
// import generateToken from '../utils/generateToken.js';

// // @desc    Register a new user
// // @route   POST /api/auth/register
// // @access  Public
// export const registerUser = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, companyId } = req.body;

//     if (!firstName || !lastName || !email || !password || !companyId) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const company = await Company.findById(companyId);
//     if (!company) {
//       return res.status(404).json({ message: 'Company not found' });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: 'Email already in use' });
//     }

//     const user = await User.create({
//       firstName,
//       lastName,
//       email,
//       password,
//       company: companyId,
//     });

//     const token = generateToken(user._id);

//     res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         company: company.name,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error during registration', error: error.message });
//   }
// };

// // @desc    Login a user
// // @route   POST /api/auth/login
// // @access  Public
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     const user = await User.findOne({ email }).select('+password');

//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = generateToken(user._id);

//     res.status(200).json({
//       token,
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error during login', error: error.message });
//   }
// };

// // @desc    Get current logged-in user
// // @route   GET /api/auth/me
// // @access  Private
// export const getMe = async (req, res) => {
//   res.status(200).json({ user: req.user });
// };
import User from "../models/User.js";
import Company from "../models/Company.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, companyId } = req.body;

  if (!firstName || !lastName || !email || !password || !companyId) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const company = await Company.findById(companyId);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error("Email already in use");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    company: companyId,
  });
  const token = generateToken(user._id);

  res.status(201).json({
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      company: company.name,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);

  res.status(200).json({
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user });
});
