// import { jwtDecode } from "jwt-decode";

// export const verifyToken = (token) => {
//   return jwtDecode(token);
// };

import { jwtDecode } from "jwt-decode";

export const verifyToken = (token) => {
  if (typeof token !== "string") {
    console.log("Invalid token: must be a string");
    throw new Error("Invalid token: must be a string");
  }
  return jwtDecode(token);
};
