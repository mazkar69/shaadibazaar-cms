

export default async function getBudget(){
    try {
        const url = `/api/budget/list`
        let response = await fetch(url);
        response = await response.json();

        // console.log(response)
        if(response.success){
            return response.data.budgets
        }
        else{
            return [];
        }
        
    } catch (error) {

        console.log(error)
        return []
        
    }
}