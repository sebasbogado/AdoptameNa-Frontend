import methods from "@/services/index";

const BASE_PATH = "auth/reset-password-request";

const post = (params: Record<string,any>) => {
  return methods.postPasswordRequest({ path: BASE_PATH, params });
};

export default { post };