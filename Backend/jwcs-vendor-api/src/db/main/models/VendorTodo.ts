import { mainDb } from "../mainDb";
import { updateStamp } from "../../../lib/utils";

export interface VendorTodo {
  id?: number;
  vendorId?: number;
  createdByVendorUserId?: number;
  updatedByVendorUserId?: number;
  done?: boolean;
  title?: string;
  concurrencyStamp?: string;
}

export const VendorTodo = {
  async create(values: VendorTodo): Promise<VendorTodo> {
    const concurrencyStamp = mainDb.raw("NEWID()");
    const [row] = await mainDb("VendorTodo")
      .returning("*")
      .insert({
        ...values,
        concurrencyStamp,
      });
    return row;
  },

  async findForVendor(
    vendorId: number,
    filter?: VendorTodo,
  ): Promise<VendorTodo[]> {
    let query = mainDb("VendorTodo")
      .select("*")
      .where({ vendorId });

    if (filter) {
      if (filter.title) {
        query = query.andWhere("title", "like", `%${filter.title}%`);
      }
      if (filter.done) {
        query = query.andWhere({ done: filter.done });
      }
    }

    query = query.orderBy("id");

    return await query;
  },

  async remove(vendorId: number, id: number): Promise<boolean> {
    // TODO: Implement soft-deletes where we simply update the row and set
    // a nullable "DeletedOn" date...
    const result = await mainDb("VendorTodo")
      .where({ id, vendorId })
      .del();
    return result === 1;
  },

  async update(values: VendorTodo): Promise<VendorTodo> {
    const {
      // Remove fields we don't update.
      id,
      concurrencyStamp,
      createdByVendorUserId, // eslint-disable-line
      vendorId,
      // Any other field is updated.
      ...updateValues
    } = values;
    const [row] = await mainDb("VendorTodo")
      .returning("*")
      .where({
        id,
        vendorId,
        concurrencyStamp, // If this changed, another user edited it.
      })
      .update({
        ...updateValues,
        concurrencyStamp: updateStamp(),
      });
    return row;
  },
};
