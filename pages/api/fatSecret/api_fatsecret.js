
import apiClient from "@/config/axios/axios";

const createApiFunction = (method, url) => async (data) => {
  let response;
  try {
    if (method.toLowerCase() === "get") {
      //GET requests
      response = await apiClient.get(url, { params: data });
    } else {
      // POST, PUT, PATCH
      response = await apiClient[method.toLowerCase()](url, data);
    }

    return response.data;
  } catch (err) {
    return err.response
      ? err.response.data
      : { status: 500, message: err.message || "Network Error", data: null };
  }
};

export default function ApiFatSecret() {
  return {
    getFoodDetailById: createApiFunction("get", "fatsecret/food-by-id"),
    searchFood: createApiFunction("get", "fatsecret/food-search"),
  };
}


