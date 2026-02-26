import { Popover, Whisper, Dropdown, IconButton, Table, ButtonGroup } from 'rsuite';
import { GrView } from "react-icons/gr";

const { Cell } = Table;

export const ActionCell = ({ rowData, handleView, ...props }) => {
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
            </ButtonGroup>
        </Cell>
    );
};
