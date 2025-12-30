import React from 'react';
import { Popover, Whisper, Dropdown, IconButton, Table, Toggle, ButtonGroup } from 'rsuite';
import { LiaEdit } from "react-icons/lia";
import {MdOutlineAddPhotoAlternate} from 'react-icons/md'
import { RiDeleteBin6Line } from "react-icons/ri";
import Link from '../../../components/Link.jsx';

const { Cell } = Table;

export const NameCell = ({ rowData, dataKey, ...props }) => {
  const speaker = (
    <Popover title="Description">
      <p>
        <b>Name:</b> {rowData.name}
      </p>
      <p>
        <b>Gender:</b> {rowData.gender}
      </p>
      <p>
        <b>City:</b> {rowData.city}
      </p>
      <p>
        <b>Street:</b> {rowData.street}
      </p>
    </Popover>
  );

  return (
    <Cell {...props}>
      <Whisper placement="top" speaker={speaker}>
        <a>{dataKey ? rowData[dataKey] : null}</a>
      </Whisper>
    </Cell>
  );
};





const renderMenu = ({ onClose, left, top, className }, ref) => {
  const handleSelect = eventKey => {
    onClose();
    console.log(eventKey);
  };
  return (
    <Popover ref={ref} className={className} style={{ left, top }} full>
      <Dropdown.Menu onSelect={handleSelect}>
        <Dropdown.Item eventKey={1}>Update Images</Dropdown.Item>
        <Dropdown.Item eventKey={2}>Update Phone</Dropdown.Item>
        <Dropdown.Item eventKey={3}>Update Meta</Dropdown.Item>
        <Dropdown.Item eventKey={4}>Update FAQs</Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  );
};

export const ActionCell = ({rowData,handleDelete,...props}) => {
  return (
    <Cell {...props} className="link-group">
      <ButtonGroup>
        <IconButton icon={<LiaEdit color='green' />} href={`/vendor/update/${rowData._id}`} size='sm' as={Link} appearance='subtle' title='Edit' />
        <IconButton icon={<RiDeleteBin6Line color='red'/>} size='sm' appearance='subtle' title="Delete" onClick={()=>handleDelete(rowData._id)}/>
        <IconButton icon={<MdOutlineAddPhotoAlternate color='blug' />} href={`/vendor/update-image/${rowData._id}`} size='sm' as={Link} appearance='subtle' title="Upload image" />

        {/* <Whisper placement="autoVerticalEnd" trigger="click" speaker={renderMenu} >
        <IconButton appearance="subtle" icon={<BsThreeDots />}   size='sm' title="Menu"/>
      </Whisper> */}
      </ButtonGroup>
    
    </Cell>
  );
};


export const CustomCell = ({ rowData, dataKey , ...props }) => {
  return(
   <Cell {...props} className='custom-cell'>
    <span>
      {rowData[dataKey]?.name}
    </span>
   </Cell> 
  )
}

export const ToggleCell = ({rowData,dataKey,handleToggle,...props})=>{
  return(
    <Cell {...props} >
    <Toggle checked={rowData[dataKey]} onChange={value=>handleToggle(value,dataKey,rowData._id)} size="sm"/>
  </Cell>
  )
 
}