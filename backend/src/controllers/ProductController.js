const Product = require("../models/Product").model;

class ProductController {
  async index(req, res) {
    try {
      //PAGINATION
      const page = parseInt(req.query.page) || 0;
      const itemsPerPage = parseInt(req.query.itemsPerPage) || 50;
      //SEARCH
      let search = req.query.search || null;

      const total = await Product.countDocuments().lean();

      let options = {
        sort: { name: 1, createdAt: -1 },
        limit: itemsPerPage,
        skip: itemsPerPage * page
      };
      //FIND BY SEARCH IF EXISTS, ORDER BY NAME, CREATEDAT AND PAGINATE
      await Product.find(
        search ? { $text: { $search: search } } : null,
        null,
        options,
        (err, products) => {
          if (err) return res.status(400).json(err);
          return res.status(200).json({ products, totalProducts: total });
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  async show(req, res) {
    try {
      if (req.params.id) {
        return res
          .status(200)
          .json(await Product.findById(req.params.id).lean());
      }
    } catch (e) {
      return res.status(400).json(e);
    }
  }

  async update(req, res) {
    try {
      if (req.params.id) {
        let product = await Product.findOneAndUpdate(
          { _id: req.params.id },
          { ...req.body },
          { new: true }
        );
        return res.status(200).send(product);
      }
    } catch (e) {
      return res.status(400).json(e);
    }
  }

  async create(req, res) {
    try {
      const { name, description, price } = req.body;
      await Product.create({
        name,
        description,
        price
      })
        .then(product => res.status(200).json(product))
        .catch(err => {
          return res.status(400).json(err);
        });
    } catch (e) {
      return res.status(400).json(e);
    }
  }

  async delete(req, res) {
    try {
      await Product.findByIdAndRemove(req.params.id);

      return res.status(200).send({ success: true });
    } catch (e) {
      return res.status(400).json(e);
    }
  }
}

module.exports = new ProductController();
