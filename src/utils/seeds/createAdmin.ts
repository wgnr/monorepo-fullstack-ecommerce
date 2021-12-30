import { GlobalVars } from "@config/globalVars";
import { UserType } from "@models/entities/users/users.interface";
import UsersService from "@services/users";
import { connectServices, closeServices } from "@root/appServices";

const {
  seed: {
    SEED_MONGODB_URL,
    SEED_MONGODB_DB,
    SEED_MONGODB_USER,
    SEED_MONGODB_PASSWORD,
    SEED_ADMIN_EMAIL,
    SEED_ADMIN_PASSWORD,
  },
  db: MongoDBConfig,
  IS_TEST,
} = GlobalVars;

(async () => {
  try {
    // Connect to services
    await connectServices(
      IS_TEST
        ? MongoDBConfig
        : {
            URL: SEED_MONGODB_URL,
            DB: SEED_MONGODB_DB,
            USER: SEED_MONGODB_USER,
            PASSWORD: SEED_MONGODB_PASSWORD,
          }
    );

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
    await closeServices();
    process.exit();
  }
})();
