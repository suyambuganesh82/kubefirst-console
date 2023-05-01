import React, { FunctionComponent, MouseEvent, ReactNode, useState } from 'react';
import Button from '@mui/material/Button';
import MenuMui from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ListItemIcon, ListItemText } from '@mui/material';

import Typography from '../typography';
import { VOLCANIC_SAND } from '../../constants/colors';

export interface MenuProps {
  label: string | ReactNode;
  options?: Array<{
    label: string;
    icon?: ReactNode;
    color?: string;
  }>;
  onClickMenu: (label: string) => void;
}

const Menu: FunctionComponent<MenuProps> = ({ label, options, onClickMenu }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickMenu = (label: string) => {
    handleClose();
    onClickMenu(label);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        disableRipple
      >
        {label}
      </Button>
      <MenuMui
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{ '& .MuiMenu-paper': { backgroundColor: 'white' } }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {options &&
          options.map(({ label, icon, color }) => {
            return (
              <MenuItem key={label} onClick={() => handleClickMenu(label)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText>
                  <Typography variant="body2" color={color || VOLCANIC_SAND}>
                    {label}
                  </Typography>
                </ListItemText>
              </MenuItem>
            );
          })}
      </MenuMui>
    </div>
  );
};

export default Menu;