var sanitize = require('mongo-sanitize');
const axios = require('axios')
// models
const { User, USER_TYPES, validateCreate } = require('../models/User.js');

// To create a user
const onCreateUser = async (req, res) => {
    try {

        const user = await User.createUser(req.body, req.files.image);

        const protocol = req.protocol
        const host = req.get('host')
        const domain =`${protocol}://${host}/`
            
      if(user){
        const response = await axios.post(
            "https://nu-payment-server-web.vercel.app/user/register",
            {
              name: user.userName,
              email: user.email,
              image:domain+'undefined'+user.image,
              address: user.address,
              bio: user.bio,
              password:'1234'
            }
          );



      }
 

        return res.status(200).json({ success: true, user });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
}

// To create an Admin user
const onCreateAdminUser = async (req, res) => {
    try {

        const user = await User.createAdminUser(req.body);
        return res.status(200).json({ success: true, user });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
}

// Get user by ID
const onGetUserById = async (req, res) => {
    try {
        const user = await User.getUserById(req.params.id);
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

// Get service provider by ID
const onGetServiceProviderById = async (req, res) => {
    try {
        const user = await User.getServiceProviderById(req.params.id);
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

// Get service provider by username
const onGetServiceProviderByUsername = async (req, res) => {
    try {
        const user = await User.getUserByUsername(sanitize(req.params.username));
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

// Get user by username
const onGetUserByUsername = async (req, res) => {
    try {
        const user = await User.getUserByUsername(sanitize(req.params.username));
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

// Get user details without ID
const onGetMyDetails = async (req, res) => {
    try {
        const user = await User.getUserById(req.user._id);
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

// Get user by smart contract ID
const onGetUserBySmartContractId = async (req, res) => {
    try {
        const user = await User.getUserBySmartContractId(req.params.id);
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

// Update user profile
const onUpdateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.updateProfile(userId, req.body, req.files.image);
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

// Update user shopper
const onUpdateUserShopper = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.updateProfileShopper(userId, req.body, req.files?.image);
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}


// Update user service profile
const onUpdateUserServiceProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.updateProfileServiceProvider(userId, req.body, req.files.image);
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

// Update user service profile
const onUpdateUserPlanDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.updateProfilePlans(userId, req.body);
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}


// Get all users
const onGetAllUsers = async (req, res) => {
    try {

        const users = await User.getUsers();
        
        const array = users.map((user)=>{
            const protocol = req.protocol
            const host = req.get('host')
            const domain =`${protocol}://${host}/`
            return {...user,image:domain+'undefined'+user.image}
        })
        return res.status(200).json({ success: true, users:array });


    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "An error occured" });
    }
}

// Get all service providers
const onGetAllServiceProviders = async (req, res) => {
    try {

        const users = await User.getPaginatedServiceProviders(req.query);
        return res.status(200).json({ success: true, ...users });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

// Get service providers
const onGetRandomServiceProviders = async (req, res) => {
    try {

        const users = await User.getRandomServiceProviders(parseInt(req.params.n));
        return res.status(200).json({ success: true, users });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "An error occured" });
    }
}

// To delete a user 
const onDeleteUserById = async (req, res) => {
    try {
        const user = await User.deleteByUserById(req.params.id);
        return res.status(200).json({
            success: true,
            message: `Deleted a count of ${user.deletedCount} user.`
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

module.exports = {
    onCreateUser,
    onGetUserById,
    onGetMyDetails,
    onGetAllUsers,
    onDeleteUserById,
    onGetUserBySmartContractId,
    onUpdateUserProfile,
    onUpdateUserShopper,
    onUpdateUserServiceProfile,
    onUpdateUserPlanDetails,
    onCreateAdminUser,
    onGetRandomServiceProviders,
    onGetMyDetails,
    onGetAllServiceProviders,
    onGetServiceProviderById,
    onGetServiceProviderByUsername,
    onGetUserByUsername
}