import client from "./client";

export const authApi = {
  login: (credentials) => client.post("/Auth/login", credentials)
};

export default authApi;