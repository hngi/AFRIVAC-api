const User = require("./../models/user");
const CustomError = require("./../utils/CustomError");
const MailService = require("./MailService");
const GenerateToken = require("./GenerateToken")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class UserService {
  async add(data) {
    const userExist = await User.findOne({ email: data.email })
    if (userExist) throw new CustomError("Email already exists");

    const {resetToken,resetExpires} = new GenerateToken(10).generate();

    data.passwordResetToken = resetToken
    data.passwordResetExpires = resetExpires

    const user = new User(data);
    const token = await jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    await user.save();

    //send mail
    await new MailService(user, resetToken).sendActivate();

    return data = {
      uid: user._id,
      email: user.email,
      role: user.role,
      token: token
    };
  }

  async authenticate(data) {
    if (!data.email) throw new CustomError("Email is required");
    if (!data.password) throw new CustomError("Password is required");

    const user = await User.findOne({ email: data.email }).select('+password');
    console.log(user)
    if (!user) throw new CustomError("Incorrect email or password");
    
    const isCorrect = await bcrypt.compare(data.password, user.password)
    if (!isCorrect) throw new CustomError("Incorrect email or password");

    const token = await jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    return data = {
      uid: user._id,
      email: user.email,
      role: user.role,
      token: token
    };
  }

  async confirmToken(data) {
     // 1) Get user based on the token
     const ResetToken = data.token

     const user = await User.findOne({
     passwordResetToken: ResetToken,
     passwordResetExpires: { $gt: Date.now() }
     });
 
     // 2) If token has not expired, and there is user, set the new password
     if (!user) throw new CustomError("Token is invalid or has expired");

     await User.findByIdAndUpdate(user._id, { passwordResetToken: undefined,
     passwordResetExpires: undefined, isActive: true},function(err, result) {
       if (err)throw new CustomError("An error occured! Try again later");
     })

     const token = await jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

     return data = {
      uid: user._id,
      token
    };
  };

  async resend() {};
  async getMany() {
    const user = await User.find({}, { password: 0 });
    return user
  }

  async getById(userId) {
    const user = await User.findOne({ _id: userId }, { isActive: 0, createdAt: 0, updatedAt: 0 });
    return user;
  }

  async update(userId, data) {
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      data,
      { new: true, }
    );

    if (!user) throw new CustomError("User dosen't exist", 404);
    
      
      const {_id,email,username,name,country,number} = user
      
    return {_id,email,username,name,country,number};
  }

  async deleteOne(userId) {
    const user = await User.findOne({ _id: userId });
    user.remove()
    return null
  }

  async uploadProfilePicture(userId,photo){
    const fieldsToUpdate = {}

  if (photo) fieldsToUpdate.profileImageUrl = photo.location

    let user = await User.findOne({ _id: userId })

    if (!user) {
      throw new CustomError('Profile not found', 404)
    }

    await User.findOneAndUpdate(
      { userId: userId },
      { $set: fieldsToUpdate },
      {
        new: true
      }
    )
    return photo.location
  }
}

module.exports = new UserService();
