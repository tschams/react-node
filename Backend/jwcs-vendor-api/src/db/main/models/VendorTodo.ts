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

  async listForVendor(filter?: VendorTodo): Promise<VendorTodo[]> {
    return await mainDb("VendorTodo")
      .select("*")
      .where(filter);
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
