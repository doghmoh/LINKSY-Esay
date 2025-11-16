const routerV1 = require("express").Router();
const authRotutes = require("../../modules/auth/auth.route");

routerV1.use("/auth", authRotutes);

module.exports = routerV1;
