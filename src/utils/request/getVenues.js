

export default async function getVenues(id){
    try {
        // console.log(id)
        const url = `/api/venue/list?city_id=${id}&limit=1000`
        let response = await fetch(url);
        response = await response.json();

        // console.log(response)
        if(response.success){
            return response.data.venues;
        }
        else{
            return [];
        }
        
    } catch (error) {
        console.log(error)
        return []
        
    }
}