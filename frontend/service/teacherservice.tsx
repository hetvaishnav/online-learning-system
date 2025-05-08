import axios from "axios";

export const getTeacherCources=async(teacherid:string)=>{
    try {
        let url=`http://localhost:3001/courses/teacher/${teacherid}`
        const response=await axios.get(url)
        return response
    } catch (error) {
        console.log(error);
    }

}
export const getCoursebyId=async(teacherid:string)=>{
    try {
        let url=`http://localhost:3001/courses/${teacherid}`
        const response=await axios.get(url)
        return response
    } catch (error) {
        console.log(error);
    }

}
export const addCourse=async(payload:any)=>{
    try {
        let url=`http://localhost:3001/courses`
        const response=await axios.post(url,payload)
        return response
    } catch (error) {
        console.log(error);
    }
}


// export const getEnrollStudent=async(studentId:string)=>{
//     try {
//         let url=`http://localhost:3001/enrollments/${studentId}`
//         const respose=axios.get(url)
//         return respose
//     } catch (error) {
//         console.log(error);
//     }
// }


export const deleteCourse=async(courseId:string)=>{
    try {
        let url=`http://localhost:3001/courses/${courseId}`
        const response=axios.delete(url)
        return response
    } catch (error) {
        console.log(error);
    }
}


export const updateCource=async(courseId:string,payload:any)=>{
    try {
        let url=`http://localhost:3001/courses/${courseId}`
        const response=axios.put(url,payload)
        return response
    } catch (error) {
        console.log(error);
    }
}


export const addLesson=async(payload:any)=>{
    try {
        let url=`http://localhost:3001/lessons`
        const response=axios.post(url,payload)
        return response
    } catch (error) {
        
    }
}


export const addvideo=async(payload:any)=>{
    try {
        let url=`http://localhost:3001/courses/upload-video`
        const response=axios.post(url,payload)
        return response
    } catch (error) {
        
    }
}

export const getEnrollStudent=async(courseId:string)=>{
    try {
        let url=`http://localhost:3001/enrollments/course/${courseId}`
        const response=await axios.get(url)
        return response
    } catch (error) {
        console.log(error);
    }

}