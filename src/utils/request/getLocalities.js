import { authApi } from "./apiRequest";


export default async function getLocalities(id) {
    try {

        if (!id) {
            return [];
        }
        // console.log(id)
        const url = `/api/location/admin/list?city_id=${id}&limit=1000`
        const { data } = await authApi.get(url);


        // console.log(response)
        if (data.success) {
            return data.data.locations;
        }
        else {
            return [];
        }

    } catch (error) {
        console.log(error)
        return []

    }
}