
import { Popover, Whisper, Dropdown, IconButton, Table, Toggle, ButtonGroup } from 'rsuite';


import {BsThreeDots} from 'react-icons/bs'


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





const renderMenu = ({rowData,handleDelete,updateStatus,updateUser,onClose, left, top, className }, ref) => {

  const handleSelect = eventKey => {
    onClose();
    if(eventKey === "delete"){
      handleDelete(rowData._id);
    }
    else if(eventKey === "update"){
      console.log(rowData)
      updateUser(rowData)
    }
    else if(eventKey === "status"){
      updateStatus(rowData._id,rowData.status === "active" ? "inactive":"active")
    }
    console.log(eventKey);
  };
  return (
    <Popover ref={ref} className={className} style={{ left, top }} full>
      <Dropdown.Menu onSelect={handleSelect}>
        <Dropdown.Item eventKey={"delete"}>Delete</Dropdown.Item>
        <Dropdown.Item eventKey={"update"}>Update user</Dropdown.Item>
        <Dropdown.Item eventKey={"status"}>Make {rowData.status === "active" ? "Inactive" : "Active"}</Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  );
};

export const ActionCell = ({updateUser,updateStatus,handleDelete,rowData, ...props }) => {
  return (
    <Cell {...props} className="link-group">
      <ButtonGroup>
        <Whisper placement="autoVerticalEnd" trigger="click" speaker={({onClose, left, top, className },ref)=>{
            return (
              <>
              {renderMenu({rowData,handleDelete,updateStatus,updateUser,onClose, left, top, className },ref)}
              </>
            )          
        }}>
          <IconButton appearance="subtle" icon={<BsThreeDots />} size='sm' title="Menu" />
        </Whisper>
      </ButtonGroup>

    </Cell>
  );
};


export const CustomCell = ({ rowData, dataKey, ...props }) => {
  return (
    <Cell {...props} className='custom-cell'>
      <span>
        {rowData[dataKey]?.name}
      </span>
    </Cell>
  )
}

export const ToggleCell = ({ rowData, dataKey, handleToggle, ...props }) => {
  return (
    <Cell {...props} >
      <Toggle checked={rowData[dataKey]} onChange={value => handleToggle(value, dataKey, rowData._id)} size="sm" />
    </Cell>
  )

}