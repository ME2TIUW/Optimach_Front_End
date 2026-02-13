
import apiClient from "@/config/axios/axios";

const createAPIFunction = (method, url) => async (data) => {
  return apiClient[method](`${process.env.NEXT_PUBLIC_SELF_HOST}/${url}`, data);
};

export default function apiAuth() {
  return {
    postLoginUser: createAPIFunction("post", "auth/login"),
    putUpdatePassword: createAPIFunction("put", "auth/change-password"),
    postLogoutUser: createAPIFunction("post", "auth/logout"),
    postCreateUser: createAPIFunction("post", "auth/register"),
  };
}
