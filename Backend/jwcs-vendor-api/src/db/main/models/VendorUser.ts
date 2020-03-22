import { PasswordUtils } from "../../../lib/security/passwords";
import { mainDb } from "../mainDb";

export class VendorUser {
  id?: number;
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

  constructor(values?: VendorUser) {
    Object.assign(this, values);
  }

  static async create(email: string, password: string): Promise<VendorUser> {
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

    const data = new VendorUser({
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

    const [user] = await mainDb("VendorUser")
      .returning("*")
      .insert(data);

    return user;
  }

  static async findByEmail(email: string): Promise<VendorUser> {
    const normalizedEmail = (email || "").trim().toUpperCase();
    return mainDb("VendorUser")
      .where({ normalizedEmail })
      .first();
  }

  static async getAll(): Promise<VendorUser[]> {
    return mainDb("VendorUser").select();
  }
}
