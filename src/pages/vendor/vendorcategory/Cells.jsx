import React from 'react';
import { IconButton, Table, ButtonGroup } from 'rsuite';
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBin6Line } from "react-icons/ri";

const { Cell } = Table;



export const ActionCell = ({rowData,handleDelete,handleOpen,...props}) => {
  return (
    <Cell {...props} className="link-group">
      <ButtonGroup>
        <IconButton icon={<LiaEdit color='green'/>} size='sm' appearance='subtle' title='Edit' onClick={()=>handleOpen(rowData._id,rowData.name,rowData.slug,"Update")}/>
        <IconButton icon={<RiDeleteBin6Line color='red'/>} size='sm' appearance='subtle' title="Delete" onClick={()=>handleDelete(rowData._id)}/>
      </ButtonGroup>
    
    </Cell>
  );
};
