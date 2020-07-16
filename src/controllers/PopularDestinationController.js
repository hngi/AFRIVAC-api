const PopularDestinationService = require("./../services/PopularDestinationService");
const response = require("./../utils/response");

class PopularDestinationContoller {
  async add(req, res) {
    const data = await PopularDestinationService.craetePopularDestination(req.body)
    res.status(201).send(response("popular destination created", data));
  }

  async getMany(req, res) {
    const data = await PopularDestinationService.getAllPopularDestinations();
    res.status(200).send(response("Destinations", data));
  }

  async getById(req, res) {
    const data = await PopularDestinationService.getAllPopularDestinationsById(req.params.userId);
    res.status(200).send(response("Destinations", data));
  }

//   async update(req, res) {
//     const data = await UserService.update(req.params.userId, req.body);
//     res.status(200).send(response("User updated", data));
//   }

//   async delete(req, res) {
//     const data = await UserService.deleteOne(req.params.userId);
//     res.status(200).send(response("User deleted", data));
//   }
}

module.exports = new PopularDestinationContoller();
