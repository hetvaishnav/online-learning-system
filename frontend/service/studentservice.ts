import axios from "axios";

export const getAllCourses = async (limit: number, offset: number) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/courses/allcourses?limit=${limit}&offset=${offset}`
        const response = await axios.get(url)
        return response
    } catch (error) {
        console.log(error);
    }

}

export const searchCourse = async (title: string) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/courses/search?title=${title}`
        const response = await axios.get(url)
        return response
    } catch (error) {
        console.log(error);
    }

}

export const getEnrollStudent = async (studentId: string) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/enrollments/${studentId}`
        const respose = axios.get(url)
        return respose
    } catch (error) {
        console.log(error);
    }
}


export const getCourseById = async (courseId: string) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/courses/${courseId}`
        const response = await axios.get(url)
        return response
    } catch (error) {
        console.log(error);
    }

}