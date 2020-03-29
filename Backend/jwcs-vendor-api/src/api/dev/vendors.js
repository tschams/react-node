import { apiController } from "../../lib/utils";
import { Vendor } from "../../db";

export default apiController({
  async create(req, res) {
    // console.log("QUERY: ", req.query);
    // console.log("BODY: ", req.body);
    const item = await Vendor.create(req.body);
    res.json({
      item,
    });
  },
  async listAll(req, res) {
    const items = await Vendor.listAll();
    res.json({
      items,
    });
  },
  async update(req, res) {
    const item = await Vendor.update({
      ...req.body,
      id: req.params.id,
    });
    res.json({
      item,
    });
  },
});
