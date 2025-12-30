import React, { useRef } from 'react';

import {
  Dropdown,
  Popover,
  Whisper,
  Stack,
  Avatar,
  IconButton,
} from 'rsuite';
import GearIcon from '@rsuite/icons/Gear';
import HelpOutlineIcon from '@rsuite/icons/HelpOutline';
import { useNavigate } from 'react-router';

const renderAdminSpeaker = ({ onClose, left, top, className }, ref,handleSignOut) => {


  const handleSelect = eventKey => {
    onClose();
    console.log(eventKey);
  };
  return (
    <Popover ref={ref} className={className} style={{ left, top }} full>
      <Dropdown.Menu onSelect={handleSelect}>
        <Dropdown.Item panel style={{ padding: 10, width: 160 }}>
          <p>Signed in as</p>
          <strong>Administrator</strong>
        </Dropdown.Item>
        <Dropdown.Item divider />
        <Dropdown.Item>Set status</Dropdown.Item>
        <Dropdown.Item>Profile & account</Dropdown.Item>
        <Dropdown.Item>Feedback</Dropdown.Item>
        <Dropdown.Item divider />
        <Dropdown.Item>Settings</Dropdown.Item>
        <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
        <Dropdown.Item
          icon={<HelpOutlineIcon />}
          href="https://rsuitejs.com"
          target="_blank"
          as="a"
        >
          Help{' '}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  );
};

const renderSettingSpeaker = ({ onClose, left, top, className }, ref) => {
  const handleSelect = eventKey => {
    onClose();
    console.log(eventKey);
  };
  return (
    <Popover ref={ref} className={className} style={{ left, top }} full>
      <Dropdown.Menu onSelect={handleSelect}>
        <Dropdown.Item panel style={{ padding: 10, width: 160 }}>
          <strong>Settings</strong>
        </Dropdown.Item>
        <Dropdown.Item>Applications</Dropdown.Item>
        <Dropdown.Item>Projects</Dropdown.Item>
        <Dropdown.Item divider />
        <Dropdown.Item>Members</Dropdown.Item>
        <Dropdown.Item>Teams</Dropdown.Item>
        <Dropdown.Item>Channels</Dropdown.Item>
        <Dropdown.Item divider />
        <Dropdown.Item>Integrations</Dropdown.Item>
        <Dropdown.Item>Customize</Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  );
};


const Header = () => {
  const trigger = null;

  const navigate = useNavigate();


  //Remove the token from the sessionStroage and navigate user to login page
  const handleSignOut = () => {

    //Remove token from the session stroage
    localStorage.removeItem("x4976gtylCC");

    //Navigate to login page
    navigate("/login")


  }


  return (
    <Stack className="header" spacing={8}>


      {/* <Whisper placement="bottomEnd" trigger="click" ref={trigger} speaker={renderNoticeSpeaker}>
        <IconButton
          icon={
            <Badge content={5}>
              <NoticeIcon style={{ fontSize: 20 }} />
            </Badge>
          }
        />
      </Whisper> */}

      <Whisper placement="bottomEnd" trigger="click" ref={trigger} speaker={renderSettingSpeaker}>
        <IconButton icon={<GearIcon style={{ fontSize: 20 }} />} />
      </Whisper>

      <Whisper placement="bottomEnd" trigger="click" ref={trigger} speaker={(props,ref)=>renderAdminSpeaker(props,ref,handleSignOut)}>
        <Avatar
          size="sm"
          circle
          src="/logo/logo.png"
          alt="shaadibazaar"
          style={{ marginLeft: 8 }}
        />
      </Whisper>
    </Stack>
  );
};

export default Header;
