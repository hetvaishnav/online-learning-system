import axios from "axios";

export const registerUser = async (userData: any) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/register`;
        const response = await axios.post(url, userData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const loginUser = async (loginData: any) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`;
        const response = await axios.post(url, loginData);
        if (response.data.access_token) {
            localStorage.setItem("token", response.data.access_token);
            if (response.data.user) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }
        }
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
};
