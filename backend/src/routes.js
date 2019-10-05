const routes = require("express").Router();

const authMiddleware = require("./middlewares/auth");

const ProductController = require("./controllers/ProductController");
const UserController = require("./controllers/UserController");

//USER AUTH ROUTES
routes.post("/register", UserController.register);
routes.post("/authenticate", UserController.authenticate);

//AUTH MIDDLEWARE - NEEDED TO BE AUTHENTICATED
routes.use(authMiddleware);
//PRODUCTS ROUTES
routes.get("/products", ProductController.index);
routes.post("/products", ProductController.create);
routes.get("/products/:id", ProductController.show);
routes.patch("/products/:id", ProductController.update);
routes.delete("/products/:id", ProductController.delete);

module.exports = routes;
