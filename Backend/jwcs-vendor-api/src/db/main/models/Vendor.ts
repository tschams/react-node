import { mainDb } from "../mainDb";

export class Vendor {
  id?: number;
  name?: string;

  constructor(values?: Vendor) {
    Object.assign(this, values);
  }

  static async create(values: Vendor): Promise<Vendor> {
    const [row] = await mainDb("Vendor")
      .returning("*")
      .insert(values);
    return row;
  }

  static async listAll(): Promise<Vendor[]> {
    return mainDb("Vendor").select();
  }

  static async update(values: Vendor): Promise<Vendor> {
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
