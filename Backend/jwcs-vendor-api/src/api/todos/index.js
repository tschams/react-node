import { apiController } from "../../lib/utils";
import { VendorTodo } from "../../db";

export default apiController({
  async createItem(req, res) {
    // console.log("QUERY: ", req.query);
    // console.log("BODY: ", req.body);
    const { vendorId, id: userId } = req.user;
    const item = await VendorTodo.create({
      ...req.body,
      vendorId,
      createdByVendorUserId: userId,
      updatedByVendorUserId: userId,
    });
    res.json({
      item,
    });
  },
  async find(req, res) {
    const { vendorId } = req.user;
    const items = await VendorTodo.findForVendor(vendorId, req.query);
    res.json({
      items,
    });
  },
  async removeItem(req, res) {
    await VendorTodo.remove(req.user.vendorId, req.params.id);
    res.status(200).end();
  },
  async updateItem(req, res) {
    const { id: itemId } = req.params;
    const { vendorId, id: userId } = req.user;
    const item = await VendorTodo.update({
      ...req.body,
      id: itemId,
      vendorId,
      updatedByVendorUserId: userId,
    });
    res.json({
      item,
    });
  },
});
