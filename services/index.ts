import axiosInstance from "../utils/axios-instance";

interface RequestOptions {
    path: string;
    id?: string | number;
    params?: Record<string, any>;
    token?: string;
}

const get = async ({ path, id, params = {}, token }: RequestOptions) => {
    const { data, status } = await axiosInstance.get(
        id ? `${path}/${id}` : path,
        {
            validateStatus: () => true,
            params,
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
    );
    return status >= 200 && status <= 300 ? data : null;
};

const post = async ({ path, params = {}, token }: RequestOptions) => {
    const { data, status } = await axiosInstance.post(path, params, {
        validateStatus: () => true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return status >= 200 && status <= 300 ? data : null;
};

const put = async ({ path, id, params = {}, token }: RequestOptions) => {
    if (!id) throw new Error("ID is required for PUT request");
    
    const { data, status } = await axiosInstance.put(`${path}/${id}`, params, {
        validateStatus: () => true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return status >= 200 && status <= 300 ? data : null;
};

const remove = async ({ path, id, token }: RequestOptions) => {
    if (!id) throw new Error("ID is required for DELETE request");
    
    const { data, status } = await axiosInstance.delete(`${path}/${id}`, {
        validateStatus: () => true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return status >= 200 && status <= 300 ? data : null;
};

export default { get, post, put, remove };
