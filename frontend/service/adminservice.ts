import axios from "axios";

export const getAllcource = async () => {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/courses/allcourses`
        const response = await axios.get(url)
        return response
    } catch (error) {
        console.log(error);
    }
}

export const getAllusers = async () => {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users`
        const response = await axios.get(url)
        return response
    } catch (error) {
        console.log(error);
    }
}   