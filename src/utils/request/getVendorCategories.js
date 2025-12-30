

export default async function getVendorCategories(){
    try {
        const url = `/api/vendor/category/list?limit=100`
        let response = await fetch(url);
        response = await response.json();

        // console.log(response)
        if(response.success){
            return response.data.vendorCategory;
        }
        else{
            return [];
        }
        
    } catch (error) {

        console.log(error)
        return []
        
    }
}