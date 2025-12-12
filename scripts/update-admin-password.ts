import "dotenv/config";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

async function updateAdminPassword() {
  try {
    const [, , usernameArg, newPasswordArg] = process.argv;
    const username = usernameArg || process.env.ADMIN_USERNAME || "admin@gmail.com";
    const newPassword = newPasswordArg || process.env.ADMIN_NEW_PASSWORD;

    if (!newPassword || newPassword.length < 10) {
      console.error("Usage: tsx scripts/update-admin-password.ts <username> <new-strong-password>\nOr set ADMIN_USERNAME and ADMIN_NEW_PASSWORD env vars.\nPassword must be at least 10 characters.");
      process.exit(1);
    }

    await dbConnect();

    const user = await User.findOne({ username });
    if (!user) {
      console.error(`Admin user not found for username: ${username}`);
      process.exit(2);
    }

    // If your model has a pre-save hash hook, setting plain password and saving is fine.
    // Otherwise, hash here to be safe (double-hashing is prevented because we overwrite the field).
    if (!user.schema.path("password")) {
      const hash = await bcrypt.hash(newPassword, 12);
      (user as any).password = hash;
    } else {
      (user as any).password = newPassword;
    }

    await user.save();

    // Invalidate any existing sessions by updating updatedAt (if present) or advise rotating NEXTAUTH_SECRET
    console.log("Admin password updated successfully for:", username);
    console.log("If using stateless JWT sessions, rotate NEXTAUTH_SECRET to invalidate old tokens.");
  } catch (err) {
    console.error("Error updating admin password:", (err as Error).message);
    process.exit(3);
  } finally {
    process.exit(0);
  }
}

updateAdminPassword();
