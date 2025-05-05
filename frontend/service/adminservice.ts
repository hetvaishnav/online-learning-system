import axios from "axios";

export const getAllcource=async ()=>{
    try {
        let url=`http://localhost:3001/courses/allcourses`
        const response=await axios.get(url)
        return response
    } catch (error) {
        console.log(error);
    }
}

export const getAllusers=async()=>{
    try {
        let url=`http://localhost:3001/users`
        const response=await axios.get(url)
        return response
    } catch (error) {
        
    }
}