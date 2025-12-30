

export default async function getVenueCategories(){
    try {
        const url = `/api/venue/category/list?limit=100`
        let response = await fetch(url);
        response = await response.json();

        // console.log(response)
        if(response.success){
            return response.data.venueCategory;
        }
        else{
            return [];
        }
        
    } catch (error) {

        console.log(error)
        return []
        
    }
}