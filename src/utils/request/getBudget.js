import api from "./apiRequest";


export default async function getBudget() {
    try {
        const url = `/api/budget/list`
        const { data } = await api.get(url);

        if (data.success) {
            return data.data.budgets
        }
        else {
            return [];
        }

    } catch (error) {

        console.log(error)
        return []

    }
}