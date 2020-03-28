import { apiController } from "../../lib/utils";
import { VendorTodo } from "../../db";

export default apiController({
  async create(req, res) {
    // console.log("QUERY: ", req.query);
    // console.log("BODY: ", req.body);
    const { vendorId, id: userId } = req.user;
    const item = await VendorTodo.create(vendorId, userId, req.body);
    res.json({
      item,
    });
  },
  async find(req, res) {
    const { vendorId } = req.user;
    const items = await VendorTodo.find(vendorId, req.query);
    res.json({
      items,
    });
  },
  async getById(req, res) {
    const { vendorId } = req.user;
    const { id } = req.params;
    const item = await VendorTodo.getById(vendorId, id);
    res.json({
      item,
    });
  },
  async remove(req, res) {
    await VendorTodo.remove(req.user.vendorId, req.params.id);
    res.status(200).end();
  },
  async update(req, res) {
    const { id: itemId } = req.params;
    const { vendorId, id: userId } = req.user;
    const item = await VendorTodo.update(vendorId, userId, itemId, req.body);
    res.json({
      item,
    });
  },
});
