import axiosInstance from "../utils/axiosInstace"

const get = async ({ path, id, params = {}, token }) => {
    console.log(path, id);
    const { data, status } = await axiosInstance.get(
        id ? `${path}/${id}` : path,
        {
            validateStatus: false,
            params,
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return status >= 200 && status <= 300 ? data : null;
};

const post = async ({ path, params = {}, token }) => {
    const { data, status } = await axiosInstance.post(path, params, { 
        validateStatus: false,
        headers: { Authorization: `Bearer ${token}` },
    });
    return status >= 200 && status <= 300 ? data : null;
};

const put = async ({ path, id, params = {}, token }) => {
    const { data, status } = await axiosInstance.put(`${path}/${id}`, params, { 
        validateStatus: false,
        headers: { Authorization: `Bearer ${token}` },
    });
    return status >= 200 && status <= 300 ? data : null;
};

const remove = async ({ path, id, token }) => {
    const { data, status } = await axiosInstance.delete(`${path}/${id}`, { 
        validateStatus: false,
        headers: { Authorization: `Bearer ${token}` },
    });
    return status >= 200 && status <= 300 ? data : null;
};

export default { get, post, put, remove };
