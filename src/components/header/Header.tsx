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
// import Badge from "@mui/material/Badge";
import CustomSearch from "../reuseable/CustomSearch";

import { useMediaQuery } from "@mui/material";
import { useDrawerContext } from "../../contextapi/DrawerContextApi";
import SearchBarComponent from "../dropdowns/SearchBarComponent";

import CustomPopover from "../reuseable/CustomPopover";
import NotificationDropDown from "../dropdowns/NotificationDropDown";
import ProfileDropDown from "../dropdowns/ProfileDropDown";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/img/hrms_mscorpres_logo.png";
import { useAuth } from "../../contextapi/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../hooks/useToast";
import { setEmplyeeCode } from "../../slices/authSlices";


const pages = ["Products", "Pricing", "Blog"];

function Header() {
  const path = window.location.pathname;
  const { user, searchValueLength } = useAuth();
 const { showToast } = useToast();
const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = React.useRef(null);

  const notificationRef = React.useRef(null);
  const profileRef = React.useRef(null);
  const [searchText, setSearchText] = React.useState("");
  const [openSearch, setOpenSearch] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const { toggleDrawerOpen } = useDrawerContext();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<boolean>(false);

  const [isOpenNotification, setIsOpenNotification] = React.useState(false);

  const isSmallScreen = useMediaQuery("(max-width:450px)");
  const { empCode } = useSelector((state: any) => state?.auth);


  const handleOpenUserMenu = () => {
    setAnchorElUser(true);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  React.useEffect(() => {
    if (empCode) {
      //@ts-ignore
      if (empCode === user?.id) {
         dispatch(setEmplyeeCode({ empCode: "" }));
        showToast("You cannot access your own profile with this method", "error");
        return
      }
      navigate(`/employee/details/${empCode}`);
      setSearchText("");
    }
  }, [empCode]);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#ffffff",
        paddingTop: 1.5,
        paddingBottom: 1.5,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <img
              onClick={() => navigate("/")}
              src={logoImg}
              alt="mscorpres"
              className="cursor-pointer w-65"
            />
          </Box>

          {path === "/" ? null : (
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={toggleDrawerOpen}
                color="inherit"
              >
                <MenuIcon sx={{ color: "#4a4a4aff" }} />
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
          )}

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
              mr: 2,
            }}
          >
            <CustomSearch
              ref={inputRef}
              width={isSmallScreen ? "20ch" : "60ch"}
              placeholder={`${
                isSmallScreen
                  ? "Search"
                  : "Search by Employee name or Employee code"
              }`}
              onChange={(e) => {
                const value = e.target.value;
                setSearchText(value);
                setOpenSearch(value.trim().length >= 3);
                setSelectedIndex(-1);
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (!openSearch) return;
                if (e.key === "ArrowDown") {
                  setSelectedIndex((prev) =>
                    prev < searchValueLength - 1 ? prev + 1 : 0
                  );
                  e.preventDefault();
                } else if (e.key === "ArrowUp") {
                  setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                  e.preventDefault();
                } else if (e.key === "Enter") {
                  // On Enter, select the highlighted item or the first item if none is highlighted
                  if (searchValueLength > 0) {
                    const event = new CustomEvent("selectSearchResult", {
                      detail: { selectedIndex },
                    });
                    window.dispatchEvent(event);
                    setOpenSearch(false);
                  }
                  e.preventDefault();
                }
              }}
              bgColor="#8c8c8c80"
              textColor="#8e8b8bff"
              value={searchText}
            />
            {searchText && (
              <SearchBarComponent
                open={openSearch}
                close={() => setOpenSearch(false)}
                searchQuary={searchText}
                anchorRef={inputRef}
                width={`${isSmallScreen ? "180px" : "400px"}`}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                onSelect={() => setOpenSearch(false)}
              />
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {/* {!isSmallScreen && ( */}
            <>
              <IconButton
                onClick={() => setIsOpenNotification(true)}
                sx={{ mr: 2 }}
              >
                {/* <Badge badgeContent={0} color="error" sx={{ p: 0, mr: 2 }}> */}
                <NotificationsIcon
                  ref={notificationRef}
                  sx={{ fontSize: 30, color: "#4a4a4aff" }}
                />
                {/* </Badge> */}
              </IconButton>

              {isOpenNotification && (
                <CustomPopover
                  open={isOpenNotification}
                  close={() => setIsOpenNotification(false)}
                  //@ts-ignore
                  anchorEl={notificationRef}
                  width={400}
                  // height={360}
                  isCone={true}
                  coneColor="#1e8a8f"
                >
                  <NotificationDropDown />
                </CustomPopover>
              )}
            </>
            {/* )} */}

            <IconButton
              onClick={handleOpenUserMenu}
              sx={{
                p: 0,
              }}
            >
              <Avatar
                ref={profileRef}
                //@ts-ignore
                alt={user?.name}
                //@ts-ignore
                src={user?.imgUrl}
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
                coneColor="#1e8a8f"
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
