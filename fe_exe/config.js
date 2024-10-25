import Constants from "expo-constants";

const rentEaseApi = Constants.expoConfig.extra.rentEaseApi;

console.log(rentEaseApi)
const apiConfig = {
  baseURL: rentEaseApi ,
  headers: {
    "Content-Type": "application/json",
  },
};

export default apiConfig;
