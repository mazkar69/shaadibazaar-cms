//This will take the date and return the formatted date.

// Input => Wed Dec 20 2023 21:28:29 GMT+0530
// Outpur =>

const formatDate = (date)=>{
    
    let d = new Date(date).toString();

    // console.log(d)

    const newDate = `${d.slice(8,10)}-${d.slice(4,7)}-${d.slice(11,15)} ${d.slice(15,21)}` 

    return newDate;
    
}


export default formatDate;