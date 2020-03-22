/**
 * @file Password utilities.
 *
 * See https://gist.github.com/xfoxfu/a2803b293ade63b314fe7c9e5ea21cad
 * See also: https://github.com/williamtayeb/aspnetcore-identity-password-hasher
 */

import { promisify } from "util";

const crypto = {
  randomBytes: promisify(require("crypto").randomBytes),
  pbkdf2: promisify(require("crypto").pbkdf2),
};

const DEFAULT_ITERATIONS = 20000;

const PBKDF2Algorithm = {
  0: "sha1",
  1: "sha256",
  2: "sha512",
};

const PBKDF2Params = {
  /**
   * Version 2:
   * PBKDF2 with HMAC-SHA1, 128-bit salt, 256-bit subkey, 1000 iterations.
   * (See also: SDL crypto guidelines v5.1, Part III)
   * Format: { 0x00, salt, subkey }
   */
  0(hashedPasswordBytes) {
    var salt = Buffer.alloc(16);
    hashedPasswordBytes.copy(salt, 0, 1, 17);
    var subkey = Buffer.alloc(32);
    hashedPasswordBytes.copy(subkey, 0, 17, 49);
    return {
      hashAlgorithm: "sha1",
      subkey,
      salt,
      iteration: 1000,
    };
  },
  /**
   * Version 3:
   * PBKDF2 with HMAC-SHA256, 128-bit salt, 256-bit subkey, 10000 iterations.
   * Format: { 0x01, prf (UInt32), iter count (UInt32), salt length (UInt32), salt, subkey }
   * (All UInt32s are stored big-endian.)
   */
  1(hashedPasswordBytes) {
    var prf = hashedPasswordBytes.readUInt32BE(1);
    var iter = hashedPasswordBytes.readUInt32BE(5);
    var saltLength = hashedPasswordBytes.readUInt32BE(9);
    var salt = Buffer.alloc(saltLength);
    hashedPasswordBytes.copy(salt, 0, 13, 13 + saltLength);
    var subkey = Buffer.alloc(32);
    hashedPasswordBytes.copy(subkey, 0, 13 + saltLength, 13 + saltLength + 32);
    return {
      iteration: iter,
      salt,
      subkey,
      hashAlgorithm: getPBKDF2Algorithm(prf),
    };
  },
};

function getPBKDF2Algorithm(prf) {
  const algo = PBKDF2Algorithm[prf];
  if (!algo) {
    throw new Error(`Unsupported prf "${prf}".`);
  }
  return algo;
}

function getPBKDF2Params(hashedPasswordBytes) {
  const firstByte = hashedPasswordBytes[0];
  const getParams = PBKDF2Params[firstByte];
  if (!getParams) {
    throw new Error(`Invalid version "${hashedPasswordBytes[0]}".`);
  }
  return getParams(hashedPasswordBytes);
}

function writeNetworkByteOrder(buffer, offset, value) {
  buffer[offset + 0] = value >> 24;
  buffer[offset + 1] = value >> 16;
  buffer[offset + 2] = value >> 8;
  buffer[offset + 3] = value >> 0;
}

export const PasswordUtils = {
  async compare(hash, password) {
    const hashBuffer = Buffer.from(hash, "base64");
    const data = getPBKDF2Params(hashBuffer);
    // console.log("DATA: ", {
    //   iteration: data.iteration,
    //   salt: data.salt.toString("base64"),
    //   subkey: data.subkey.toString("base64"),
    //   hashAlgorithm: data.hashAlgorithm,
    // });
    const result = await crypto.pbkdf2(
      password,
      data.salt,
      data.iteration,
      data.subkey.length,
      data.hashAlgorithm,
    );
    return result.equals(data.subkey);
  },
  async hash(password) {
    const saltSize = 128 / 8;
    const numBytesRequested = 256 / 8;
    const prf = 1;
    const algo = PBKDF2Algorithm[prf];
    let salt = await crypto.randomBytes(saltSize);
    let subkey = await crypto.pbkdf2(
      password,
      salt,
      DEFAULT_ITERATIONS,
      numBytesRequested,
      algo,
    );

    let outputBytes = Buffer.alloc(13 + salt.byteLength + subkey.byteLength);

    outputBytes[0] = 0x01; // Format maker
    writeNetworkByteOrder(outputBytes, 1, prf);
    writeNetworkByteOrder(outputBytes, 5, DEFAULT_ITERATIONS);
    writeNetworkByteOrder(outputBytes, 9, saltSize);

    salt.copy(outputBytes, 13, 0, salt.byteLength);
    subkey.copy(outputBytes, 13 + saltSize, 0, subkey.byteLength);

    return outputBytes.toString("base64");
  },
  async randomByteString(length = 32, format = "hex") {
    const bytes = await crypto.randomBytes(length);
    return bytes.toString(format);
  },
};
