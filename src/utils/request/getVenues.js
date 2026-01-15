import { authApi } from "./apiRequest";


export default async function getVenues(id){
    try {
        // console.log(id)
        const url = `/api/venue/list?city_id=${id}&limit=1000`
       const {data} = await authApi.get(url);

        // console.log(response)
        if(data.success){
            return data.data.venues;
        }
        else{
            return [];
        }
        
    } catch (error) {
        console.log(error)
        return []
        
    }
}