import request from "supertest";
import { GlobalVars } from "@config/index";
import { connectServices, closeServices } from "@root/appServices";
import { httpServer as app } from "@root/app";
import { IUserNewPublic } from "@models/entities/users/users.interface";
import { UserType } from "@models/entities/users/users.interface";

const baseUrl = "/api";

beforeAll(async () => {
  await connectServices(GlobalVars.db);
});

afterAll(async () => {
  await closeServices();
});

const mockedUser: IUserNewPublic = {
  email: `mock-name-${new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/:/g, "-")}@mock-domain.com`,
  firstName: "mock-name",
  lastName: "mock-last-name",
  password: "holisholis",
};

const authUrl = `${baseUrl}/auth`;
describe("Auth", () => {
  const authSignup = `${authUrl}/signup`;
  describe("POST | public sign up", () => {
    it("should create a new user as type USER", done => {
      request(app)
        .post(authSignup)
        .send(mockedUser)
        .set("Accept", "application/json")
        .expect("Content-Type", /application\/json/)
        .expect(201)
        .then(response => {
          const user = response.body;

          expect(user).toBeDefined();
          expect(user.email).toBe(mockedUser.email);
          expect(user.firstName).toBe(mockedUser.firstName);
          expect(user.lastName).toBe(mockedUser.lastName);
          expect(user.type).toBe(UserType.USER);
          expect(user.currentCart).toBeDefined();
          expect(user.password).not.toBeDefined();

          done();
        })
        .catch(done);
    });
  });

  const authLogin = `${authUrl}/login`;
  describe(authLogin, () => {
    describe("POST | user login", () => {
      it("should receive a token when logged in", done => {
        const { email, password } = mockedUser;

        request(app)
          .post(authLogin)
          .send({ email, password })
          .set("Accept", "application/json")
          .expect("Content-Type", /application\/json/)
          .expect(200)
          .then(response => {
            const { token } = response.body;

            expect(typeof token).toBe("string");
            expect(token).toMatch(/\w{1,}.\w{1,}.\w{1,}/);

            done();
          })
          .catch(done);
      });
    });
  });
});
