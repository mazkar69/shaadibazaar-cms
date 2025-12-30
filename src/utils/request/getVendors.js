

export default async function getVendors(id,vendor_category_id){
    try {
        // console.log(id)
        const url = `/api/vendor/list?city_id=${id}&vendor_category_id=${vendor_category_id}&limit=1000`
        let response = await fetch(url);
        response = await response.json();

        // console.log(response)
        if(response.success){
            return response.data.vendors;
        }
        else{
            return [];
        }
        
    } catch (error) {
        console.log(error)
        return []
        
    }
}