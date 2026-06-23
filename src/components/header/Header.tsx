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
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<boolean>(false);
  const [isOpenNotification, setIsOpenNotification] = React.useState(false);

  const isSmallScreen = useMediaQuery("(max-width:450px)");
  const { empCode } = useSelector((state: any) => state?.auth);

  const handleOpenUserMenu = () => setAnchorElUser(true);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  React.useEffect(() => {
    if (empCode) {
      //@ts-ignore
      if (empCode === user?.id) {
        dispatch(setEmplyeeCode({ empCode: "" }));
        showToast("You cannot access your own profile with this method", "error");
        return;
      }
      navigate(`/employee/details/${empCode}`);
      setSearchText("");
    }
  }, [empCode]);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f1f5f9",
        py: 0.75,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 1 }}>

          {/* Desktop logo */}
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2, flexShrink: 0 }}>
            <img
              onClick={() => navigate("/")}
              src={logoImg}
              alt="mscorpres"
              className="cursor-pointer w-56"
            />
          </Box>

          {/* Mobile hamburger (non-home pages) */}
          {path === "/" ? null : (
            <Box sx={{ display: { xs: "flex", md: "none" }, flexShrink: 0 }}>
              <IconButton
                size="medium"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={toggleDrawerOpen}
                sx={{
                  color: "#64748b",
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#f1f5f9" },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "left" }}
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

          {/* Search bar — grows to fill center */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <CustomSearch
              ref={inputRef}
              width={isSmallScreen ? "18ch" : "58ch"}
              placeholder={
                isSmallScreen
                  ? "Search"
                  : "Search by Employee name or Employee code"
              }
              bgColor="#f1f5f9"
              bgOpacity={1}
              borderRadius={20}
              textColor="#475569"
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

          {/* Right actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>

            {/* Notification */}
            <IconButton
              onClick={() => setIsOpenNotification(true)}
              sx={{
                p: 1,
                borderRadius: 2,
                color: isOpenNotification ? "#2eacb3" : "#64748b",
                bgcolor: isOpenNotification ? "#e0f7fa" : "transparent",
                "&:hover": { bgcolor: "#e0f7fa", color: "#2eacb3" },
                transition: "all 0.2s",
              }}
            >
              <NotificationsIcon
                ref={notificationRef}
                sx={{ fontSize: 24 }}
              />
            </IconButton>

            {isOpenNotification && (
              <CustomPopover
                open={isOpenNotification}
                close={() => setIsOpenNotification(false)}
                //@ts-ignore
                anchorEl={notificationRef}
                width={400}
                isCone={true}
                coneColor="#1e8a8f"
              >
                <NotificationDropDown />
              </CustomPopover>
            )}

            {/* Profile avatar */}
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{
                p: 0.5,
                borderRadius: "50%",
                border: "2px solid transparent",
                "&:hover": { borderColor: "#2eacb3" },
                transition: "border-color 0.2s",
              }}
            >
              <Avatar
                ref={profileRef}
                //@ts-ignore
                alt={user?.name}
                //@ts-ignore
                src={user?.imgUrl}
                sx={{ backgroundColor: "#2eacb3", width: 36, height: 36 }}
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
