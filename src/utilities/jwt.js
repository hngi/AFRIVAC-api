const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const UserRepo = require('./../data/repository/UserRepo');
const {
    promisify
} = require('util');

exports.signToken = id => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new BadRequestError('You are not logged in! Please log in to get access.')
        );
    };

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // 3) Check if user still exists
    const currentUser = await UserRepo.findUserById(decoded.id);
    if (!currentUser) {
        return next(
            new BadRequestError(
                'The user belonging to this token does no longer exist.'
            )
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
})