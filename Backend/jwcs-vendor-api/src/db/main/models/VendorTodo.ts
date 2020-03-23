import { mainDb } from "../mainDb";
import { updateStamp } from "../../../lib/utils";

export class VendorTodo {
  id?: number;
  vendorId?: number;
  createdByVendorUserId?: number;
  updatedByVendorUserId?: number;
  done?: boolean;
  title?: string;
  concurrencyStamp?: string;

  constructor(values?: VendorTodo) {
    Object.assign(this, values);
  }

  static async create(values: VendorTodo): Promise<VendorTodo> {
    const [row] = await mainDb("Vendor")
      .returning("*")
      .insert(values);
    return row;
  }

  static async listForVendor(filter?: VendorTodo): Promise<VendorTodo[]> {
    return await mainDb("Vendor")
      .select("*")
      .where(filter);
  }

  static async remove(vendorId: number, id: number): Promise<boolean> {
    // TODO: Implement soft-deletes where we simply update the row and set
    // a nullable "DeletedOn" date...
    var result = await mainDb("Vendor").where({ id, vendorId }).del();
    return result === 1;
  }

  static async update(values: VendorTodo): Promise<VendorTodo> {
    const {
      // Remove fields we don't update.
      id,
      concurrencyStamp,
      createdByVendorUserId,
      vendorId,
      // Any other field is updated.
      ...updateValues
    } = values;
    const [row] = await mainDb("Vendor")
      .returning("*")
      .where({ id, vendorId, concurrencyStamp })
      .update({
        ...updateValues,
        concurrencyStamp: updateStamp(),
      });
    return row;
  }
}
