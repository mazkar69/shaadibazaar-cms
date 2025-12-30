import React from 'react';
import { Popover, Dropdown, IconButton, Table, ButtonGroup } from 'rsuite';
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBin6Line } from "react-icons/ri";
import Link from '../../../components/Link.jsx';

const { Cell } = Table;


const renderMenu = ({ onClose, left, top, className }, ref) => {
  const handleSelect = eventKey => {
    // onClose();
    // console.log(handleUpdateStatus)
    console.log(eventKey);
  };
  return (
    <Popover ref={ref} className={className} style={{ left, top }} full>
      <Dropdown.Menu onSelect={handleSelect}>
        <Dropdown.Item eventKey={"pending"}>Pending</Dropdown.Item>
        <Dropdown.Item eventKey={"resolved"}>Resolved</Dropdown.Item>
        <Dropdown.Item eventKey={"reject"}>Reject</Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  );
};


export const ActionCell = ({ rowData, handleDelete, handleOpen, ...props }) => {
  return (
    <Cell {...props} className="link-group">
      <ButtonGroup>

        <IconButton icon={<LiaEdit color='green' />} size='sm' appearance='subtle' title='Edit' href={`/vendor-page/update/${rowData._id}`} as={Link} />

        <IconButton icon={<RiDeleteBin6Line color='red' />} size='sm' appearance='subtle' title="Delete" onClick={() => handleDelete(rowData._id)} />
        {/* <Whisper placement="autoVerticalEnd" trigger="click" speaker={renderMenu}>
          <IconButton appearance="subtle" icon={<BsThreeDots />} size='sm' title="Menu" />
        </Whisper> */}
      </ButtonGroup>

    </Cell>
  );
};
