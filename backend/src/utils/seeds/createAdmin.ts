import { GlobalVars } from "@config/globalVars";
import { connectToMongo } from "@models/index";
import { UserType } from "@models/entities/users/users.interface";
import UsersService from "@services/users";

const {
  seed: {
    SEED_MONGODB_URL,
    SEED_MONGODB_DB,
    SEED_MONGODB_USER,
    SEED_MONGODB_PASSWORD,
    SEED_ADMIN_EMAIL,
    SEED_ADMIN_PASSWORD,
  },
} = GlobalVars;

(async () => {
  try {
    // Connect to services
    await Promise.all([
      connectToMongo({
        URL: SEED_MONGODB_URL,
        DB: SEED_MONGODB_DB,
        USER: SEED_MONGODB_USER,
        PASSWORD: SEED_MONGODB_PASSWORD,
      }),
    ])
      .then(console.log)
      .catch(e => {
        console.error(e);
        console.log("Exiting...");
        process.exit(1);
      });

    const admin = await UsersService.create({
      email: SEED_ADMIN_EMAIL,
      password: SEED_ADMIN_PASSWORD,
      firstName: "admin",
      lastName: "",
      type: UserType.ADMIN,
    });
    console.log("admin created successfully");
    console.log(admin);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
})();
