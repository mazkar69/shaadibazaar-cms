import { authApi } from "./apiRequest";


export default async function getVenueCategories() {
    try {
        const url = `/api/venue/category/list?limit=100`
        const { data } = await authApi.get(url);
        // console.log(data);

        // console.log(response)
        if (data.success) {
            return data.data.venueCategory;
        }
        else {
            return [];
        }

    } catch (error) {

        console.log(error)
        return []

    }
}