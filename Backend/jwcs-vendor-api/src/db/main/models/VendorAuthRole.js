import { mainDb } from "../mainDb";

/**
 * @typedef {object} VendorAuthRole
 * @property {number} [id]
 * @property {string} [name]
 * @property {string} [normalizedName]
 * @property {string} [concurrencyStamp]
 */

const table = "VendorAuthRole";
const userTable = "VendorUserRole";

export const VendorAuthRole = {
  table,

  /**
   * @param {VendorAuthRole} values
   * @returns {Promise<VendorAuthRole>}
   */
  async create(values) {
    const [row] = await mainDb(table)
      .returning("*")
      .insert(values);
    return row;
  },
  /**
   * @param {string} name
   * @returns {Promise<VendorAuthRole>}
   */
  async findByName(name) {
    const row = await mainDb(table)
      .first()
      .where({
        normalizedName: ("" + name).trim().toUpperCase(),
      });
    return row;
  },
  /** @returns {Promise<VendorAuthRole[]>} */
  async findRoleNamesByUserId(id) {
    return mainDb(table)
      .innerJoin(userTable, `${table}.id`, `${userTable}.roleId`)
      .where(`${userTable}.userId`, "=", mainDb.raw("?", [id]))
      .select(`${table}.name`);
  },
  /** @returns {Promise<VendorAuthRole[]>} */
  async listAll() {
    return mainDb(table).select();
  },
  /**
   * @param {VendorAuthRole} values
   * @returns {Promise<VendorAuthRole>}
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
