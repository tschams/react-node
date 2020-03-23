import { PasswordUtils } from "../../../lib/security/passwords";
import { mainDb } from "../mainDb";
import { VendorAuthRole } from "./VendorAuthRole";

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
}

export const VendorUser = {
  async create({
    vendorId,
    email,
    password,
  }: {
    vendorId: number;
    email: string;
    password: string;
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

    return user;
  },

  async findByEmail(email: string): Promise<VendorUser> {
    const normalizedEmail = (email || "").trim().toUpperCase();
    const user: VendorUser = await mainDb("VendorUser")
      .first()
      .where({ normalizedEmail });
    const roles = await VendorAuthRole.findRoleNamesByUserId(user.id);
    user.roles = roles.map(r => r.name);
    return user;
  },

  async getAll(): Promise<VendorUser[]> {
    return mainDb("VendorUser").select();
  },
};
