const email = process.env.EMAIL;
const password = process.env.PASSWORD;

module.exports = {
    service: "gmail",
    auth: {
        user: email,
       pass: password
    }
}