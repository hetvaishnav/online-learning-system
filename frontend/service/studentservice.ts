import axios from "axios";

export const getAllCourses=async(limit:number,offset:number)=>{
    try {
        let url=`http://localhost:3001/courses/allcourses?limit=${limit}&offset=${offset}`
        const response=await axios.get(url)
        return response
    } catch (error) {
        console.log(error);
    }

}

export const searchCourse=async(title:string)=>{
    try {
        let url=`http://localhost:3001/courses/search?title=${title}`
        const response=await axios.get(url)
        return response
    } catch (error) {
        console.log(error);
    }

}

export const getEnrollStudent=async(studentId:string)=>{
    try {
        let url=`http://localhost:3001/enrollments/${studentId}`
        const respose=axios.get(url)
        return respose
    } catch (error) {
        console.log(error);
    }
   }


export const getCourseById=async(courseId:string)=>{
    try {
        let url=`http://localhost:3001/courses/${courseId}`
        const response=await axios.get(url)
        return response
    } catch (error) {
        console.log(error);
    }

}