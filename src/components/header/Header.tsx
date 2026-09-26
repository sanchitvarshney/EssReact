import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuItem from "@mui/material/MenuItem";
import CustomSearch from "../reuseable/CustomSearch";

import { useMediaQuery } from "@mui/material";
import { useDrawerContext } from "../../contextapi/DrawerContextApi";
import SearchBarComponent from "../dropdowns/SearchBarComponent";

import CustomPopover from "../reuseable/CustomPopover";
import NotificationDropDown from "../dropdowns/NotificationDropDown";
import LogoutButton from "../dashboard/LogoutButton";
import { useLocation, useNavigate } from "react-router-dom";
import logoImg from "../../assets/img/hrms_mscorpres_logo.png";
import { useAuth } from "../../contextapi/AuthContext";
import { useMyCompany } from "../../hooks/useMyCompany";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../hooks/useToast";
import { setEmplyeeCode } from "../../slices/authSlices";

const pages = ["Products", "Pricing", "Blog"];


function Header({ variant = "default" }: { variant?: "default" | "dashboard" }) {
  const isDash = variant === "dashboard";
  const path = useLocation().pathname;
  const { user, searchValueLength } = useAuth();
  const { company, branch } = useMyCompany();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = React.useRef(null);
  const notificationRef = React.useRef(null);

  const [searchText, setSearchText] = React.useState("");
  const [openSearch, setOpenSearch] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const { toggleDrawerOpen } = useDrawerContext();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [isOpenNotification, setIsOpenNotification] = React.useState(false);

  const isSmallScreen = useMediaQuery("(max-width:450px)");
  const { empCode } = useSelector((state: any) => state?.auth);

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
      dispatch(setEmplyeeCode({ empCode: "" }));
      setSearchText("");
    }
  }, [empCode]);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={
        isDash
          ? {
              background: "linear-gradient(120deg, #0f2f3a 0%, #0b5563 45%, #00a0a0 100%)",
              borderRadius: "14px",
              py: 0.75,
              px: { xs: 1, sm: 2 },
            }
          : {
              backgroundColor: "#ffffff",
              borderBottom: "1px solid #f1f5f9",
              py: 0.75,
            }
      }
    >
      <Container maxWidth={isDash ? false : "xl"} disableGutters={isDash}>
        <Toolbar disableGutters sx={{ gap: 1 }}>

          {/* Desktop logo (the dashboard shows a welcome message instead) */}
          {isDash ? (
            <Box sx={{ mr: 2, flexShrink: 0, color: "#fff", minWidth: 0 }}>
              <Typography
                noWrap
                sx={{ fontSize: { xs: 14, sm: 16 }, fontWeight: 700, lineHeight: 1.25, maxWidth: { xs: 140, sm: 320 } }}
              >
                {company || "ESS Portal"}
              </Typography>
              <Typography noWrap sx={{ fontSize: 11, opacity: 0.8, maxWidth: { xs: 140, sm: 320 } }}>
                {branch || "Employee Self Service"}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2, flexShrink: 0 }}>
              <img
                onClick={() => navigate("/")}
                src={logoImg}
                alt="mscorpres"
                className="cursor-pointer w-56"
              />
            </Box>
          )}

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
              width={isSmallScreen ? "18ch" : isDash ? "44ch" : "58ch"}
              placeholder={
                isSmallScreen
                  ? "Search"
                  : isDash
                    ? "Search members..."
                    : "Search by Employee name or Employee code"
              }
              bgColor={isDash ? "#ffffff" : "#f1f5f9"}
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

            {/* Notification */}
            <IconButton
              onClick={() => setIsOpenNotification(true)}
              sx={{
                ml: 1,
                p: 1,
                borderRadius: 2,
                color: isDash ? "#fff" : isOpenNotification ? "#00a0a0" : "#64748b",
                bgcolor: isOpenNotification ? (isDash ? "rgba(255,255,255,0.2)" : "#e0f6f6") : "transparent",
                "&:hover": isDash
                  ? { bgcolor: "rgba(255,255,255,0.2)" }
                  : { bgcolor: "#e0f6f6", color: "#00a0a0" },
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
                coneColor="#007f86"
              >
                <NotificationDropDown />
              </CustomPopover>
            )}
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

            {/* Employee name + code */}
            <Box sx={{ display: { xs: "none", md: "block" }, textAlign: "right", color: "#fff", mr: 1, lineHeight: 1.25, minWidth: 0 }}>
              <Typography noWrap sx={{ fontSize: 13, fontWeight: 700, maxWidth: 200 }}>
                {/* @ts-ignore */}
                {user?.name}
              </Typography>
              <Typography sx={{ fontSize: 11, opacity: 0.8 }}>
                {/* @ts-ignore */}
                {user?.id}
              </Typography>
            </Box>

            <LogoutButton />
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
