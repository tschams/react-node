import { PasswordUtils } from "../../../lib/security/passwords";
import { mainDb } from "../mainDb";
import { Vendor } from "./Vendor";
import { VendorAuthRole } from "./VendorAuthRole";
import { VendorUserRole } from "./VendorUserRole";

export interface VendorUser {
  id?: number;
  vendorId?: number;
  userName?: string;
  normalizedUserName?: string;
  email?: string;
  normalizedEmail?: string;
  emailConfirmed?: boolean;
  passwordHash?: string;
  securityStamp?: string;
  concurrencyStamp?: string;
  phoneNumber?: string;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled?: boolean;
  lockoutEnd?: Date | string;
  lockoutEnabled?: boolean;
  accessFailedCount?: number;

  // Input and related data

  roles?: string[];
  vendorName?: string;
}

export const VendorUser = {
  async create({
    vendorId,
    email,
    password,
    role,
  }: {
    vendorId: number;
    email: string;
    password: string;
    role: string;
  }): Promise<VendorUser> {
    email = (email || "").trim();
    password = (password || "").trim();
    if (!email || !password) {
      // TODO: Do better validation.
      // TODO: Validate email is an email and password is a good password.
      // TODO: Add some fields to the error so the API can return errors
      // in a structured way...
      throw new Error("Invalid email or password.");
    }

    // Normalize inputs. Generate other fields.
    const normalizedEmail = email.toUpperCase();
    const passwordHash = await PasswordUtils.hash(password);
    const securityStamp = await PasswordUtils.randomByteString();
    const concurrencyStamp = await PasswordUtils.randomByteString();

    const [user] = await mainDb("VendorUser")
      .returning("*")
      .insert({
        vendorId,
        userName: email,
        normalizedUserName: normalizedEmail,
        email,
        normalizedEmail,
        emailConfirmed: true,
        passwordHash,
        securityStamp,
        concurrencyStamp,
        phoneNumberConfirmed: false,
        twoFactorEnabled: false,
        lockoutEnabled: false,
        accessFailedCount: 0,
      });

    if (role) {
      const authRole = await VendorAuthRole.findByName(role);
      await VendorUserRole.create({ userId: user.id, roleId: authRole.id });
      user.roles = [authRole.name];
    }

    return user;
  },

  async findForLogin(email: string): Promise<VendorUser> {
    const normalizedEmail = (email || "").trim().toUpperCase();
    const user: VendorUser = await mainDb("VendorUser")
      .first()
      .where({ normalizedEmail });
    const roles = await VendorAuthRole.findRoleNamesByUserId(user.id);
    user.roles = roles.map(r => r.name);
    const vendor = await Vendor.getForUserLogin(user.vendorId);
    user.vendorName = vendor.name;
    return user;
  },

  async getAll(): Promise<VendorUser[]> {
    return mainDb("VendorUser").select();
  },

  async assignAuthRoleToUser(roleName: string, id: number): Promise<string[]> {
    const role = await VendorAuthRole.findByName(roleName);
    if (!role) {
      return undefined;
    }
    const roles = (await VendorAuthRole.findRoleNamesByUserId(id)).map(
      r => r.name,
    );
    if (roles.map(name => name.toUpperCase()).includes(roleName.toUpperCase()))
      return roles;
    await mainDb("VendorUserRole").insert({
      userId: id,
      roleId: role.id,
    });
    return roles.concat(roleName);
  },

  async getAuthRolesOfUser(id: number): Promise<string[]> {
    const roles = (await VendorAuthRole.findRoleNamesByUserId(id)).map(
      r => r.name,
    );
    return roles;
  },

  async removeAuthRoleFromUser(roleName: string, id: number): Promise<void> {
    const role = await VendorAuthRole.findByName(roleName);
    if (!role) {
      return;
    }
    await mainDb("VendorUserRole")
      .delete()
      .where({ userId: id, roleId: role.id });
  },
};
