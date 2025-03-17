import methods from "@/services/index";

const BASE_PATH = "auth/reset-password-request";
const BASE_PATH_PASSWORD = "auth/reset-password";

const post = (params: Record<string,any>) => {
  return methods.postPasswordRequest({ path: BASE_PATH, params });
};

const postPassword = (params: Record<string,any>) => {
  return methods.postPasswordRequest({ path: BASE_PATH_PASSWORD, params });
};

export default { post, postPassword };