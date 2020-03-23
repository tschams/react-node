import { mainDb } from "../mainDb";

/**
 * @typedef {object} VendorUserRole
 * @property {number} [userId]
 * @property {number} [roleId]
 */

const table = "VendorUserRole";

export const VendorUserRole = {
  table,

  /**
   * @param {VendorUserRole} values
   * @returns {Promise<VendorUserRole>}
   */
  async create(values) {
    const [row] = await mainDb(table)
      .returning("*")
      .insert(values);
    return row;
  },
  /** @returns {Promise<VendorUserRole[]>} */
  async listAll() {
    return mainDb(table).select();
  },
  /**
   * @param {VendorUserRole} values
   * @returns {Promise<VendorUserRole>}
   */
  async update(values) {
    const {
      // Remove fields we don't update.
      id,
      // Any other field is updated.
      ...updateValues
    } = values;
    const [row] = await mainDb(table)
      .returning("*")
      .where({ id })
      .update(updateValues);
    return row;
  },
};
