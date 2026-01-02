import axios from "axios";

export const getTeacherCources = async (teacherid: string) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/courses/teacher/${teacherid}`
        const response = await axios.get(url)
        return response
    } catch (error) {
        console.log(error);
    }

}
export const getCoursebyId = async (teacherid: string) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/courses/${teacherid}`
        const response = await axios.get(url)
        return response
    } catch (error) {
        console.log(error);
    }

}
export const addCourse = async (payload: any) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/courses`
        const response = await axios.post(url, payload)
        return response
    } catch (error) {
        console.log(error);
    }
}


export const deleteCourse = async (courseId: string) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/courses/${courseId}`
        const response = axios.delete(url)
        return response
    } catch (error) {
        console.log(error);
    }
}


export const updateCource = async (courseId: string, payload: any) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/courses/${courseId}`
        const response = axios.put(url, payload)
        return response
    } catch (error) {
        console.log(error);
    }
}


export const addLesson = async (payload: any) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/lessons`
        const response = axios.post(url, payload)
        return response
    } catch (error) {

    }
}


export const addvideo = async (payload: any) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/courses/upload-video`
        const response = axios.post(url, payload)
        return response
    } catch (error) {

    }
}

export const getEnrollStudent = async (courseId: string) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/enrollments/course/${courseId}`
        const response = await axios.get(url)
        return response
    } catch (error) {
        console.log(error);
    }

}

export const getAddedLesson = async (courseId: string) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/lessons/course/${courseId}`
        const response = await axios.get(url)
        return response
    } catch (error) {
        console.log(error);
    }

}