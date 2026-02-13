import apiClient from "@/config/axios/axios";

const createApiFunction = (method, url) => async (data) => {
  let response;
  try {
    if (method.toLowerCase() === "get") {
      //GET requests
      response = await apiClient.get(url, { params: data });
    } else {
     // POST, PUT, PATCH
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

export default function Masterdata_ApiFood() {
  return {
    GetAllFoodList: createApiFunction("get", "masterdata/food/list"),
    GetAllActiveFoodList: createApiFunction("get", "masterdata/food/list-active"),
    GetFoodListByName: createApiFunction("get", "masterdata/food/list-search"),
    PostCreateFood: createApiFunction("post", "masterdata/food/create"),
    PutUpdateFood: createApiFunction("put", "masterdata/food/update"),
    PutDeleteFood: createApiFunction("put", "masterdata/food/delete"),
    GetDetailFood: createApiFunction("post", "masterdata/food/detail"),
  };
}
