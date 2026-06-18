import { betterAuth } from "better-auth";

export const auth = betterAuth({
  //...other options
  emailAndPassword: {
    enabled: true,
  },
});
