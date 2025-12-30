

export default async function getCities(){
    try {
        const url = `/api/city/list?limit=100`
        let response = await fetch(url);
        response = await response.json();

        // console.log(response)
        if(response.success){
            return response.data.cities
        }
        else{
            return [];
        }
        
    } catch (error) {

        console.log(error)
        return []
        
    }
}