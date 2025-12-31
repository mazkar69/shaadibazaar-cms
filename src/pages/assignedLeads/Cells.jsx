
import { Popover, Whisper, Dropdown, IconButton, Table, Toggle, ButtonGroup } from 'rsuite';
import { LiaEdit } from "react-icons/lia";
import { BsThreeDots } from "react-icons/bs";

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


// const renderMenu = ({ onClose, left, top, className }, ref) => {
//   const handleSelect = eventKey => {
//     // onClose();
//     // console.log(handleUpdateStatus)
//     console.log(eventKey);
//   };
//   return (
//     <Popover ref={ref} className={className} style={{ left, top }} full>
//       <Dropdown.Menu onSelect={handleSelect}>
//         <Dropdown.Item eventKey={"pending"}>Pending</Dropdown.Item>
//         <Dropdown.Item eventKey={"resolved"}>Resolved</Dropdown.Item>
//         <Dropdown.Item eventKey={"reject"}>Reject</Dropdown.Item>
//       </Dropdown.Menu>
//     </Popover>
//   );
// };

export const ActionCell = ({ rowData, handleDelete, handleUpdateStatus, handleOpen, ...props }) => {
  return (
    <Cell {...props} className="link-group">
      <ButtonGroup>
        
        {/* <IconButton icon={<LiaEdit color='green'/>} size='sm' appearance='subtle' title='Edit'/>
        <IconButton icon={<RiDeleteBin6Line color='red'/>} size='sm' appearance='subtle' title="Delete" onClick={()=>handleDelete(rowData._id)}/> */}

        <IconButton icon={<LiaEdit color='green' />} size='sm' appearance='subtle' title='Edit' onClick={() => {
          handleOpen(rowData._id,
            rowData.name,
            rowData.phone,
            rowData.event_date ? new Date(rowData.event_date) : null,
            rowData.no_of_guest,
            rowData.city,
            rowData.location,
            rowData.assigned_to,
            rowData.remark,
            "Update"
          )
        }} />

        <Whisper placement="autoVerticalEnd" trigger="click"
          speaker={({ onClose, left, top, className }, ref) => {
            const handleSelect = eventKey => {
              onClose();
              handleUpdateStatus(rowData._id, eventKey)
              // console.log(handleUpdateStatus)
              console.log(eventKey);
            };
            return (
              <Popover ref={ref} className={className} style={{ left, top }} full>
                <Dropdown.Menu onSelect={handleSelect}>
                  <Dropdown.Item eventKey={"pending"}>Pending</Dropdown.Item>
                  <Dropdown.Item eventKey={"resolve"}>Resolve</Dropdown.Item>
                  <Dropdown.Item eventKey={"reject"}>Reject</Dropdown.Item>
                </Dropdown.Menu>
              </Popover>
            );
          }}
        >
          <IconButton appearance="subtle" icon={<BsThreeDots />} size='sm' title="Menu" />
        </Whisper>
      </ButtonGroup>

    </Cell >
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