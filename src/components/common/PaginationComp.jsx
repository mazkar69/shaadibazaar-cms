import { Pagination } from "rsuite";


export default function PaginationComp({count,limit,page,setPage,handleChangeLimit}){

    return(
        <div style={{ padding: "10px 20px", }}>
        <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size="xs"
            layout={['total', '-', 'limit', '|', 'pager', 'skip']}
            total={count}
            limitOptions={[10, 30, 50]}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
            onChangeLimit={handleChangeLimit}
        />
    </div>
    )
}