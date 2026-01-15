import { authApi } from "./apiRequest";


export default async function getVendorCategories() {
    try {
        const url = `/api/vendor/category/list?limit=100`
        let { data } = await authApi.get(url);

        // console.log(response)
        if (data.success) {
            return data.data.vendorCategory;
        }
        else {
            return [];
        }

    } catch (error) {

        console.log(error)
        return []

    }
}