import { Popover, Whisper, Dropdown, IconButton, Table, ButtonGroup } from 'rsuite';
import { BsThreeDots } from "react-icons/bs";
import { GrView } from "react-icons/gr";

const { Cell } = Table;

export const ActionCell = ({ rowData, handleUpdateStatus, handleView, ...props }) => {
    return (
        <Cell {...props} className="link-group">
            <ButtonGroup>
                <IconButton
                    icon={<GrView color='blue' />}
                    size='sm'
                    appearance='subtle'
                    title="View"
                    onClick={() => handleView(rowData)}
                />

                <Whisper placement="autoVerticalEnd" trigger="click"
                    speaker={({ onClose, left, top, className }, ref) => {
                        const handleSelect = eventKey => {
                            onClose();
                            handleUpdateStatus(rowData._id, eventKey);
                        };
                        return (
                            <Popover ref={ref} className={className} style={{ left, top }} full>
                                <Dropdown.Menu onSelect={handleSelect}>
                                    <Dropdown.Item eventKey={"pending"}>Pending</Dropdown.Item>
                                    <Dropdown.Item eventKey={"reviewed"}>Reviewed</Dropdown.Item>
                                    <Dropdown.Item eventKey={"resolved"}>Resolved</Dropdown.Item>
                                </Dropdown.Menu>
                            </Popover>
                        );
                    }}
                >
                    <IconButton appearance="subtle" icon={<BsThreeDots />} size='sm' title="Update Status" />
                </Whisper>
            </ButtonGroup>
        </Cell>
    );
};
