import axios from "axios";
const unNormalAxiosInstance = axios.create({
    headers: {
      token: localStorage.getItem("TOKEN") || ""
    }
  }
);
const files = {
  uploadFileForData(formData,url) {
    const instance = axios.create({
      // withCredentials: true,
      headers: {
        token: localStorage.getItem("TOKEN") || ""
      }
    });
    let promise = instance
      .post(url, formData);
    return promise;
  },
  exportFile(url, params) {
    return unNormalAxiosInstance.post(url, params, {
      action: "导出记录",
      responseType: 'blob'
    })
  }
};


export default files;
