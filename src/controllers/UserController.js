const UserService = require("./../services/UserService");
const response = require("./../utils/response");

class UserContoller {
  async add(req, res) {
    const data = await UserService.add(req.body);
    res.status(201).send(response("user created", data));
  }

  async authenticate(req, res) {
    const data = await UserService.authenticate(req.body);
    res.status(200).send(response("User signed in", data));
  }

  async confirmToken(req, res) {
    const data = await UserService.confirmToken(req.body);
    res.status(200).send(response("Confirmation Successful", data));
  }

  async resendToken(req, res) {
    const data = await this.resend(req.body); 
    res.status(200).send(response("Token sent Successfully", data));
  }

  async getMany(req, res) {
    const data = await UserService.getById();
    res.status(200).send(response("Users", data));
  }

  async getById(req, res) {
    const data = await UserService.getById(req.params.userId);
    res.status(200).send(response("User", data));
  }

  async update(req, res) {
    const data = await UserService.update(req.params.userId, req.body);
    res.status(200).send(response("User updated", data));
  }

  async delete(req, res) {
    const data = await UserService.deleteOne(req.params.userId);
    res.status(200).send(response("User deleted", data));
  }

  async uploadProfilePicture(req, res) {
    const data = await UserService.uploadProfilePicture(req.params.userId, req.file);
    res.status(200).send(response("User Profile Phtot Updated Successfully", data));
  }
}

module.exports = new UserContoller();
