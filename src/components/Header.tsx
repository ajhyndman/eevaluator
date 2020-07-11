import Link from 'next/link';
import React, { useState } from 'react';

import { AppBar, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MenuIcon from '@material-ui/icons/Menu';

const Header = () => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement>();
  const handleOpen = (event: any) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleClose = () => {
    setMenuAnchor(undefined);
  };
  const isLargeScreen = useMediaQuery('only screen and (min-width: 1024px)');

  return (
    <AppBar color="secondary" position="static">
      <Toolbar variant="dense">
        <Typography variant="h6">Eevaluator</Typography>
        <div style={{ flexGrow: 1 }} />
        {isLargeScreen ? (
          <>
            <Link href="/" passHref>
              <Button component="a" color="inherit">
                Damage Calculator
              </Button>
            </Link>
            <Link href="/cram-o-matic" passHref>
              <Button component="a" color="inherit">
                Cram-O-Matic
              </Button>
            </Link>
          </>
        ) : (
          <>
            <IconButton color="inherit" onClick={handleOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              keepMounted
              open={Boolean(menuAnchor)}
              onClose={handleClose}
            >
              <Link href="/" passHref>
                <MenuItem component="a" onClick={handleClose}>
                  Damage Calculator
                </MenuItem>
              </Link>
              <Link href="/cram-o-matic" passHref>
                <MenuItem component="a" onClick={handleClose}>
                  Cram-O-Matic
                </MenuItem>
              </Link>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
