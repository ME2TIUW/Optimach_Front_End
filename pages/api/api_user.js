
import apiClient from "@/config/axios/axios";

const createApiFunction = (method, url) => async (data) => {
  let response;
  try {
    if (method.toLowerCase() === "get") {
      //GET requests
      response = await apiClient.get(url, { params: data });
    } else {
      //POST, PUT, PATCH
      console.log("masuk sini -> ");
      response = await apiClient[method.toLowerCase()](url, data);
    }
    return response.data;
  } catch (err) {
    return err.response
      ? err.response.data
      : { status: 500, message: err.message || "Network Error", data: null };
  }
};

export default function ApiUser() {
  return {
    getAllUsers: createApiFunction("get", "user/list"),
    getAllactiveUsers: createApiFunction("get", "user/active"),
    putUpdateUser: createApiFunction("put", "user/update"),
    putSoftDeleteStatusUser: createApiFunction("put", "user/delete"),
    postGetDetailUser: createApiFunction("post", "user/detail"),
  };
}
