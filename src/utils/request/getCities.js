import { authApi } from "./apiRequest";


export default async function getCities() {
    try {
        const url = `/api/city/list?limit=100`
        const { data } = await authApi.get(url);

        // console.log(response)
        if (data.success) {
            return data.data
        }
        else {
            return [];
        }

    } catch (error) {

        console.log(error)
        return []

    }
}