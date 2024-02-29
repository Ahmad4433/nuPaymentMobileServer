const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const Joi = require("joi");
var ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const { uploadImage } = require("../helpers/tools/fileUploader");
const { Review } = require("./Review");
const { Order } = require("./Order");
const OrderStatus = require("../helpers/consts/OrderStatus");
const { Portfolio } = require("./Portfolio");

const USER_TYPES = {
  Admin: "Admin",
  Shopper: "Shopper",
  ServiceProvider: "ServiceProvider",
};

const userSchema = new Schema(
  {
    address: {
      type: String,
      // unique: true,
      // required: true,
    },
    userName: {
      type: String,
      lowercase: true,
      // unique: true,
      // required: true,
    },
    email: {
      type: String,
      // unique: true,
    },
    password: {
      type: String,
    },
    bio: {
      type: String,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      default: USER_TYPES.Shopper,
    },

    otp: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isUserProfileComplete: {
      type: Boolean,
      default: false,
    },

    // Moralis
    userObjectId: {
      type: String,
    },
    sessionToken: {
      type: String,
    },

    //Only for service provider
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    skillTags: {
      type: String,
    },
    youtubeLink: {
      type: String,
    },
    portfolio: {
      type: Array,
    },
    basePlanDetails: {
      type: String,
    },
    basePlanPrice: {
      type: String,
    },
    plusPlanDetails: {
      type: String,
    },
    plusPlanPrice: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);

// Function to generate token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, address: this.address, role: this.role },
    process.env.JWTPRIVATEKEY
    // To expire the token in 1 hour
    // { expiresIn: 60 * 60 * 3 }
  );
  return token;
};

userSchema.statics.createUser = async function (userParams, image) {
  try {
    const { error } = validateCreate(userParams);
    if (error) throw error.details[0].message;

    const existingUserCheckUserId = await this.findOne({
      userName: userParams.userName,
    });
    if (existingUserCheckUserId) throw "User already exist with this Username";

    const existingUserCheckAddress = await this.findOne({
      address: userParams.address,
    });
    if (existingUserCheckAddress)
      throw "User already exist with this Wallet Public Address";

    const existingUserName = await this.findOne({
      userName: userParams.userName,
    });
    if (existingUserName) throw "User already exist with this username";

    // Check if image is provided
    if (image) {
      const file = image[0];

      const profileImage = await uploadImage({
        file: file,
        path: "ProfilePictures/",
      });

      userParams["image"] = profileImage;
    }

    //Create user
    const user = await this.create({ ...userParams, role: USER_TYPES.Shopper });
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.createUpdateMoralisUser = async function (
  userObjectId,
  sessionToken,
  address
) {
  try {
    const user = await this.updateOne(
      { address: address },
      { userObjectId, sessionToken, address },
      { upsert: true }
    );
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// To validate normal user
const validateCreate = (user) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().email().required(),
    bio: Joi.string().optional().allow(""),
  });
  return schema.validate(user);
};

userSchema.statics.getUserByAddress = async function (id) {
  try {
    const user = await this.findOne({ address: id });
    if (!user) throw "No user found with this smart contract id";
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.updateProfile = async function (id, userParams, image) {
  try {
    let user = await this.findOne({ _id: id });
    if (!user) throw "No user found";

    const userNameValid = await this.findOne({
      userName: userParams.userName,
      _id: { $ne: ObjectId(id) },
    });

    if (userNameValid) {
      throw "Username already exist";
    }

    // Check if image is provided
    if (image) {
      const file = image[0];

      const profileImage = await uploadImage({
        file: file,
        path: "profilePictures/",
        existingImage: user.image,
      });

      userParams["image"] = profileImage;
    }
    user = await this.findByIdAndUpdate(id, { ...userParams }, { new: true });
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUserById = async function (id) {
  try {
    const user = await this.findOne({ _id: id });
    if (!user) throw "No service provider found with this id";

    const avgRatings = await Review.aggregate([
      {
        $match: { user: ObjectId(id) },
      },
      {
        $group: {
          _id: null,
          ratings: { $avg: "$ratings" },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0 } },
    ]);

    const lastOrder = await Order.findOne({
      seller: ObjectId(user._id),
      orderStatus: OrderStatus.Complete,
    }).sort({ createdAt: -1 });
    const recentDelivery = lastOrder ? lastOrder._doc.createdAt : null;
    const portfolios = await Portfolio.getPortfoliosByUserId(id);

    return {
      ...user._doc,
      ratings: avgRatings[0]?.ratings,
      ratingsCount: avgRatings[0]?.count,
      recentDelivery,
      portfolios,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// To get details of a service provider
userSchema.statics.getServiceProviderById = async function (id) {
  try {
    const user = await this.findOne({
      _id: id,
      role: USER_TYPES.ServiceProvider,
    });
    if (!user) throw "No service provider found with this id";

    const avgRatings = await Review.aggregate([
      {
        $match: { user: ObjectId(id) },
      },
      {
        $group: {
          _id: null,
          ratings: { $avg: "$ratings" },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0 } },
    ]);

    const lastOrder = await Order.findOne({
      seller: ObjectId(user._id),
      orderStatus: OrderStatus.Complete,
    }).sort({ createdAt: -1 });
    const recentDelivery = lastOrder ? lastOrder._doc.createdAt : null;

    return {
      ...user._doc,
      ratings: avgRatings[0]?.ratings,
      ratingsCount: avgRatings[0]?.count,
      recentDelivery,
    };
  } catch (error) {
    throw error;
  }
};

// To get details of a service provider by username
userSchema.statics.getUserByUsername = async function (username) {
  try {
    const user = await this.findOne({ userName: username });
    if (!user) throw "No service provider found with this username";

    const avgRatings = await Review.aggregate([
      {
        $match: { user: ObjectId(user.id) },
      },
      {
        $group: {
          _id: null,
          ratings: { $avg: "$ratings" },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0 } },
    ]);

    const lastOrder = await Order.findOne({
      seller: ObjectId(user._id),
      orderStatus: OrderStatus.Complete,
    }).sort({ createdAt: -1 });
    const recentDelivery = lastOrder ? lastOrder._doc.createdAt : null;
    const portfolios = await Portfolio.getPortfoliosByUserId(user._id);

    return {
      ...user._doc,
      ratings: avgRatings[0]?.ratings,
      ratingsCount: avgRatings[0]?.count,
      recentDelivery,
      portfolios,
    };
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUsers = async function () {
  try {
    const users = await this.aggregate([
      {
        $match: {
          $or: [
            { role: USER_TYPES.ServiceProvider },
            { role: USER_TYPES.Shopper },
          ],
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "user",
          as: "c_reviews",
        },
      },
      {
        $project: {
          userName: 1,
          image: 1,
          ratings: {
            $avg: "$c_reviews.ratings",
          },
          ratingsCount: {
            $size: "$c_reviews",
          },
          skillTags: 1,
          basePlanPrice: 1,
          document: "$$ROOT",
        },
      },
    ]);
    return users;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.deleteByUserById = async function (id) {
  try {
    const result = await this.deleteOne({ _id: id });
    return result;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.createAdminUser = async function (userParams) {
  try {
    const { error } = validateCreate(userParams);
    if (error) throw error.details[0].message;

    const existingUserCheckUserId = await this.findOne({
      userName: userParams.userName,
    });
    if (existingUserCheckUserId) throw "User already exist with this Username";

    const existingUserCheckAddress = await this.findOne({
      address: userParams.address,
    });
    if (existingUserCheckAddress)
      throw "User already exist with this Wallet Public Address";

    // Encryt password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const enc_password = await bcrypt.hash(userParams.password, salt);

    //Create user
    const user = await this.create({
      ...userParams,
      password: enc_password,
      role: USER_TYPES.Admin,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.isUserExist = async function ({ address }) {
  try {
    if (!address || address === "") throw "Wallet address not found";

    const user = await this.findOne({ address: address });
    return {
      isUserExist: user ? true : false,
      isPasswordSet: user ? (user.password ? true : false) : false,
      userId: user ? user._id : null,
    };
  } catch (error) {
    throw error;
  }
};

const validateSetUserPassword = (user, userId) => {
  const schema = Joi.object({
    password: Joi.string().required(),
    address: userId ? Joi.string().optional() : Joi.string().required(),
  });
  return schema.validate(user);
};

userSchema.statics.createUserOrSetPassword = async function (
  userId,
  userParams
) {
  try {
    let user;
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const password = await bcrypt.hash(userParams.password, salt);
    
    if (userId) {
      // User created account but didn't set password for the first time
      const { error } = validateSetUserPassword(userParams, userId);
      if (error) throw error.details[0].message;

      user = await this.findById(ObjectId(userId));
      console.log(user, password, userParams.password);
      if (user && user.password) {
        throw "Passcode is already set for the user.";
      }

      user = await this.findByIdAndUpdate(ObjectId(userId), {
        ...userParams,
        password: password,
      });
    } else {
      // User wants to create an account
      const { error } = validateSetUserPassword(
        { ...userParams, password: password },
        userId
      );
      if (error) throw error.details[0].message;

      user = await this.findOne({ address: { $regex : new RegExp(userParams.address, "i") } });
      if (user) {
        if(user.password) {
          throw "Passcode is already set for the user.";
        }
        user.password = password
        user.save()
      } else {
        user = await this.create({password: password, address: userParams.address.toLowerCase()});
      }
    }

    return {
      token: user.generateAuthToken(),
      userId: user._id
    };
  } catch (error) {
    throw error;
  }
};

// Login simple user
userSchema.statics.login = async function (userParams) {
  try {
    const { error } = validateLogin(userParams);
    if (error) throw error.details[0].message;

    const user = await this.findOne({
      address: { $regex : new RegExp(userParams.address, "i") },
      $or: [{ role: USER_TYPES.ServiceProvider }, { role: USER_TYPES.Shopper }],
    });
    if (!user) throw "Invalid wallet address";

    if(!user.password) {
      throw ("Please set password first")
    }
    // Compare passwords
    const validPassword = await bcrypt.compare(
      userParams.password,
      user.password
    );

    if (!validPassword) throw "Invalid password";

    // Create token
    const token = user.generateAuthToken();

    return {
      role: user.role,
      token,
      isUserProfileComplete: user.isUserProfileComplete,
      userId: user._id,
    };
  } catch (error) {
    throw error;
  }
};

const validateLogin = (user) => {
  const schema = Joi.object({
    address: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
};

// Login simple user
userSchema.statics.serverLogin = async function (userParams) {
  try {
    const { error } = validateServerLogin(userParams);
    if (error) throw error.details[0].message;

    const user = await this.findOne({
      userObjectId: userParams.userObjectId,
      sessionToken: userParams.sessionToken,
      $or: [{ role: USER_TYPES.ServiceProvider }, { role: USER_TYPES.Shopper }],
    });

    if (!user) throw "User not found";

    if (!user.isActive) throw "Your account is deactivated by admin.";

    // Create token
    const token = user.generateAuthToken();

    return {
      role: user.role,
      token,
      isUserProfileComplete: user.isUserProfileComplete,
    };
  } catch (error) {
    throw error;
  }
};

const validateServerLogin = (user) => {
  const schema = Joi.object({
    userObjectId: Joi.string().required(),
    sessionToken: Joi.string().required(),
  });
  return schema.validate(user);
};

userSchema.statics.loginAdmin = async function (userParams) {
  try {
    const { error } = validateAdminLogin(userParams);
    if (error) throw error.details[0].message;

    const user = await this.findOne({
      userName: userParams.userName,
      role: USER_TYPES.Admin,
    });
    if (!user) throw "Invalid username or password";

    if (!user.isActive) throw "Your account is not active.";

    // Compare passwords
    const validPassword = await bcrypt.compare(
      userParams.password,
      user.password
    );

    if (!validPassword) throw "Invalid username or password";

    // Create token
    const token = user.generateAuthToken();

    return { role: user.role, token };
  } catch (error) {
    throw error;
  }
};

const validateAdminLogin = (user) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
};

userSchema.statics.updateProfileShopper = async function (
  id,
  userParams,
  image
) {
  try {
    const { error } = validateUpdateShopper(userParams);
    if (error) throw error.details[0].message;

    const userNameValid = await this.findOne({
      userName: userParams.userName,
      _id: { $ne: ObjectId(id) },
    });

    if (userNameValid) {
      throw "Username already exist";
    }

    // Check if image is provided
    if (image) {
      const file = image[0];

      const profileImage = await uploadImage({
        file: file,
        path: "profilePictures/",
      });

      userParams["image"] = profileImage;
    }

    const user = await this.findByIdAndUpdate(
      id,
      { ...userParams, isUserProfileComplete: true },
      { new: true }
    );
    if (user) {
      // Create token
      const token = user.generateAuthToken();

      return { status: true, user, token };
    } else {
      throw "User doen't exist";
    }
  } catch (error) {
    throw error;
  }
};

// To validate service profile
const validateUpdateShopper = (user) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    bio: Joi.string().optional().allow(""),
    role: Joi.string()
      .optional()
      .allow(USER_TYPES.ServiceProvider, USER_TYPES.Shopper),
  });
  return schema.validate(user);
};

userSchema.statics.updateProfileServiceProvider = async function (
  id,
  userParams,
  image
) {
  try {
    const { error } = validateUpdateServiceProviderData(userParams);
    if (error) throw error.details[0].message;

    const userNameValid = await this.findOne({
      userName: userParams.userName,
      _id: { $ne: ObjectId(id) },
    });

    if (userNameValid) {
      throw "Username already exist";
    }

    // Check if image is provided
    if (image) {
      const file = image[0];

      const profileImage = await uploadImage({
        file: file,
        path: "profilePictures/",
      });

      userParams["image"] = profileImage;
    }

    const user = await this.findByIdAndUpdate(
      id,
      { ...userParams, role: userParams.role ?? USER_TYPES.ServiceProvider, isUserProfileComplete: true },
      { new: true }
    );

    // Create token
    const token = user.generateAuthToken();

    return { status: true, user, token };
  } catch (error) {
    throw error;
  }
};

// To validate service profile
const validateUpdateServiceProviderData = (user) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    bio: Joi.string().optional().allow(""),
    category: Joi.string().required(),
    skillTags: Joi.string().required(),
    youtubeLink: Joi.string().required(),
    role: Joi.string()
      .optional()
      .allow(USER_TYPES.ServiceProvider, USER_TYPES.Shopper),
  });
  return schema.validate(user);
};

userSchema.statics.updateProfilePlans = async function (id, userParams) {
  const { error } = validateUpdatePlans(userParams);
  if (error) throw error.details[0].message;

  const user = await this.findByIdAndUpdate(id, userParams, { new: true });

  return { status: true, user };
};

// To validate service provider plans
const validateUpdatePlans = (user) => {
  const schema = Joi.object({
    basePlanDetails: Joi.string().required(),
    basePlanPrice: Joi.number().required(),
    plusPlanDetails: Joi.string().required(),
    plusPlanPrice: Joi.number().required(),
  });
  return schema.validate(user);
};

userSchema.statics.getRandomServiceProviders = async function (n) {
  try {
    let serviceProviders = await this.aggregate([
      {
        $match: { role: USER_TYPES.ServiceProvider },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "user",
          as: "c_reviews",
        },
      },
      {
        $project: {
          userName: 1,
          image: 1,
          ratings: {
            $avg: "$c_reviews.ratings",
          },
          ratingsCount: {
            $size: "$c_reviews",
          },
          skillTags: 1,
          basePlanPrice: 1,
        },
      },
      {
        $sample: { size: n },
      },
    ]);

    return serviceProviders;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getPaginatedServiceProviders = async function (params) {
  try {
    const { error } = validateGetServiceProviders(params);
    if (error) throw error.details[0].message;

    const { page, perPage, q, category, skillTags } = params;

    const options = {
      page: parseInt(page) + 1,
      limit: perPage,
      sort: { ratings: "asc" },
    };

    let categoryFilter = {};
    if (category) {
      const catArray = category.split(",");
      const categoryFilters = catArray.map((category) => {
        return { category: ObjectId(category) };
      });
      categoryFilter = {
        $or: categoryFilters,
      };
    }
    let skillTagsFilter = { $addFields: { result: true } };
    if (skillTags) {
      const skillTagsArray = skillTags.split(",");
      const skillTagsFilters = skillTagsArray.map((skillTag) => {
        return {
          $regexMatch: {
            input: "$skillTags",
            regex: `${skillTag}`,
            options: "i",
          },
          // $regexMatch: { input: "$skillTags", regex: `${skillTag}`, options: "i" }
          // $regex: `$${skillTag}$`
        };
      });
      skillTagsFilter = { $addFields: { result: { $and: skillTagsFilters } } };
    }

    const aggregate = this.aggregate([
      skillTagsFilter,
      {
        $match: {
          role: USER_TYPES.ServiceProvider,
          ...categoryFilter,
          result: true,
          userName: { $regex: q, $options: "g" },
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "user",
          as: "c_reviews",
        },
      },
      {
        $project: {
          userName: 1,
          image: 1,
          ratings: {
            $avg: "$c_reviews.ratings",
          },
          ratingsCount: {
            $size: "$c_reviews",
          },
          skillTags: 1,
          basePlanPrice: 1,
          category: 1,
        },
      },
    ]);

    const res = await this.aggregatePaginate(aggregate, options);
    return {
      serviceProviders: res.docs,
      rowCount: res.totalDocs,
      pages: res.totalPages,
    };
  } catch (error) {
    throw error;
  }
};

const validateGetServiceProviders = (pageParams) => {
  const schema = Joi.object({
    page: Joi.number().min(0).required(),
    perPage: Joi.number().min(1).required(),
    q: Joi.string().allow("").optional(),
    category: Joi.string().allow("").optional(),
    skillTags: Joi.string().allow("").optional(),
  });

  return schema.validate(pageParams);
};

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  USER_TYPES,
};
