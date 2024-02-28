
const express = require("express");
const router = express.Router();
const {
    onGetUserById,
    onCreateUser,
    onGetAllUsers,
    onDeleteUserById,
    onGetUserBySmartContractId,
    onUpdateUserProfile,
    onCreateAdminUser,
    onUpdateUserServiceProfile,
    onGetRandomServiceProviders,
    onUpdateUserPlanDetails,
    onUpdateUserShopper,
    onGetMyDetails,
    onGetAllServiceProviders,
    onGetServiceProviderById,
    onGetServiceProviderByUsername,
    onGetUserByUsername,
} = require("../controllers/user.js");
const auth = require("../middleware/auth.js");
const { USER_TYPES } = require("../models/User.js");
// , auth(USER_TYPES.Admin)
router
    .get('/', onGetAllUsers)
    .get('/getMyDetails', auth([USER_TYPES.ServiceProvider, USER_TYPES.Shopper]), onGetMyDetails)
    .post('/', onCreateUser)
    .post('/createAdminUser', auth(USER_TYPES.Admin), onCreateAdminUser)
    .get('/getMyDetails', auth([USER_TYPES.Shopper, USER_TYPES.ServiceProvider]), onGetMyDetails)
    .get('/getUserbySmartContractId/:id', onGetUserBySmartContractId)
    .get('/getRandomServiceProviders/:n', onGetRandomServiceProviders)
    .get('/getServiceProviders', onGetAllServiceProviders)
    .get('/getServiceProviderByUsername/:username', onGetServiceProviderByUsername)
    .get('/getUserByUsername/:username', onGetUserByUsername)
    .get('/getServiceProvider/:id', auth([USER_TYPES.Shopper, USER_TYPES.ServiceProvider]), onGetServiceProviderById)
    .get('/:id', auth([USER_TYPES.Shopper, USER_TYPES.ServiceProvider, USER_TYPES.Admin]), onGetUserById)
    .put('/updateMyProfile', auth(USER_TYPES.Shopper), onUpdateUserProfile)
    .put('/updateMyShopperProfile', auth([USER_TYPES.Shopper, USER_TYPES.ServiceProvider]), onUpdateUserShopper)
    .put('/updateMyServiceProfile', auth([USER_TYPES.Shopper, USER_TYPES.ServiceProvider]), onUpdateUserServiceProfile)
    .put('/updateUserPlanDetails', auth([USER_TYPES.Shopper, USER_TYPES.ServiceProvider]), onUpdateUserPlanDetails)
    .delete('/:id', auth(USER_TYPES.Admin), onDeleteUserById)

module.exports = router;