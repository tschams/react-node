import { mainDb } from "../mainDb";

export interface Vendor {
  id?: number;
  name?: string;
}

export const Vendor = {
  async create(values: Vendor): Promise<Vendor> {
    const [row] = await mainDb("Vendor")
      .returning("*")
      .insert(values);
    return row;
  },

  async listAll(): Promise<Vendor[]> {
    return mainDb("Vendor").select();
  },

  async update(values: Vendor): Promise<Vendor> {
    const {
      // Remove fields we don't update.
      id,
      // Any other field is updated.
      ...updateValues
    } = values;
    const [row] = await mainDb("Vendor")
      .returning("*")
      .where({ id })
      .update(updateValues);
    return row;
  }
}
