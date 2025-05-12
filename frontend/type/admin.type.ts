export type Course= {
    id: string;
    title: string;
    description: string;
    price: number;
    teacher:{
      fullName:string,
      email:string
    }
  }
  
  export type User= {
    id: string;
    fullName: string;
    email: string;
    role: string;
  }

  export type Lesson={
    id:string,
    title:string,
    description:string,
    lessonOrder:number,
    contentType:string,
    contentUrl:string
  }