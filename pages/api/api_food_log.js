
import apiClient from "@/config/axios/axios";

const createApiFunction = (method, url) => async (data) => {
  let response;
  try {
    if (method.toLowerCase() === "get") {
      //GET requests
      response = await apiClient.get(url, { params: data });
    }else if (method.toLowerCase() === "delete") {
      //DELETE requests
      response = await apiClient.delete(url, { data: data });
    } 
    else {
      //POST, PUT, PATCH
      response = await apiClient[method.toLowerCase()](url, data);
    }

    return response.data;
  } catch (err) {
    return err.response
      ? err.response.data
      : { status: 500, message: err.message || "Network Error", data: null };
  }
};

export default function ApiFoodLog() {
  return {
    GetFoodList: createApiFunction("get", "foodlog/list"),
    GetActiveFoodList: createApiFunction("get", "foodlog/list-active"),
    PostCreateFoodLog: createApiFunction("post", "foodlog/create"),
    PutUpdateFoodLog: createApiFunction("put", "foodlog/update"),
    PutDeleteFoodLog: createApiFunction("delete", "foodlog/delete"),
    GetDetailFoodLogListByIdUser: createApiFunction("post", "foodlog/detail")
  };
}
