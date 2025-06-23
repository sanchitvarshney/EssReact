import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import CustomSearch from "../reuseable/CustomSearch";

import { useMediaQuery } from "@mui/material";
import { useDrawerContext } from "../../contextapi/DrawerContextApi";
import SearchBarComponent from "../dropdowns/SearchBarComponent";

import { customColor } from "../../constants/themeConstant";

import CustomPopover from "../reuseable/CustomPopover";
import NotificationDropDown from "../dropdowns/NotificationDropDown";
import ProfileDropDown from "../dropdowns/ProfileDropDown";
import { useNavigate } from "react-router-dom";

const pages = ["Products", "Pricing", "Blog"];

function Header() {
  const navigate = useNavigate();
  const inputRef = React.useRef(null);
  const notificationRef = React.useRef(null);
  const profileRef = React.useRef(null);
  const [searchText, setSearchText] = React.useState("");
  const [openSearch, setOpenSearch] = React.useState(false);
  const { toggleDrawerOpen } = useDrawerContext();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<boolean>(false);

  const [isOpenNotification, setIsOpenNotification] = React.useState(false);
  const isSmallScreen = useMediaQuery("(max-width:450px)");

  const handleOpenUserMenu = () => {
    setAnchorElUser(true);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: customColor.bgColor,
        paddingTop: 1.5,
        paddingBottom: 1.5,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <img
              onClick={() => navigate("/")}
              src="https://hrms.mscorpres.online/assets/images/hrms_logo.png"
              alt="mscorpres"
              className="cursor-pointer"
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawerOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: "center" }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" }, flexGrow: 1, mr: 2 }}>
            <img
            
              src="https://hrms.mscorpres.online/assets/images/hrms_logo.png"
              alt="mscorpres"
            />
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CustomSearch
              ref={inputRef}
              width={"60ch"}
              placeholder="Search by Employee Name, Designation or Department"
              onChange={(e) => {
                const value = e.target.value;

                setSearchText(value);
                setOpenSearch(value.trim().length > 0);
              }}
            />
            {searchText && (
              <SearchBarComponent
                open={openSearch}
                close={() => setOpenSearch(false)}
                searchQuary={searchText}
                anchorRef={inputRef}
              />
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {!isSmallScreen && (
              <>
                <IconButton onClick={() => setIsOpenNotification(true)}>
                  <Badge badgeContent={4} color="error" sx={{ p: 0, mr: 3 }}>
                    <NotificationsIcon
                      ref={notificationRef}
                      sx={{ fontSize: 30, color: "#fff" }}
                    />
                  </Badge>
                </IconButton>

                {isOpenNotification && (
                  <CustomPopover
                    open={isOpenNotification}
                    close={() => setIsOpenNotification(false)}
                    //@ts-ignore
                    anchorEl={notificationRef}
                    width={400}
                    height={350}
                    isCone={true}
                  >
                    <NotificationDropDown />
                  </CustomPopover>
                )}
              </>
            )}

            <IconButton
              onClick={handleOpenUserMenu}
              sx={{
                p: 0,
              }}
            >
              <Avatar
                ref={profileRef}
                alt="Remy Sharp"
                src="/static/images/avatar/2.jpg"
                sx={{ backgroundColor: "#2eacb3" }}
              />
            </IconButton>

            {anchorElUser && (
              <CustomPopover
                open={anchorElUser}
                close={() => setAnchorElUser(false)}
                anchorEl={profileRef}
                width={240}
                isCone={true}
              >
                <ProfileDropDown close={() => setAnchorElUser(false)} />
              </CustomPopover>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
