const upload = require("../config/multerConfig");

module.exports = (field) => {
     return upload.single(field);
}
