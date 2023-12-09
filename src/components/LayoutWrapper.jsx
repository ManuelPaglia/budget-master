import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Link,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
} from "@nextui-org/react";
import { AcmeLogo } from "../assets/AcmeLogo.jsx";
import { authService, pb } from "../services/pocketbase.js";
import { useNavigate, NavLink, Outlet, useLocation } from "react-router-dom";

export default function LayoutWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pathName, setPathName] = useState(location.pathname);

  const menuItems = [
    { name: "Home", path: "/home" },
    { name: "Tabelle", path: "/table" },
    { name: "Grafici", path: "/graphic" },
    { name: "Logout", path: "/access" },
  ];

  function logout() {
    authService.logout();
    navigate("/access");
  }

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/access");
    }
  });

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [pathName]);

  const isActiveLocation = (loc) => {
    if (location.pathname === loc) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Navbar isBordered onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand className="mr-4">
            <AcmeLogo />
            <p className="hidden sm:block font-bold text-inherit">ACME</p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive>
            <Link
              to="/home"
              as={NavLink}
              isBlock
              color={isActiveLocation("/home") ? "secondary" : "foreground"}
            >
              Home
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link
              as={NavLink}
              to="/table"
              isBlock
              color={isActiveLocation("/table") ? "secondary" : "foreground"}
            >
              Tabelle
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link
              to="/graphic"
              as={NavLink}
              isBlock
              color={isActiveLocation("/graphic") ? "secondary" : "foreground"}
            >
              Grafici
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent as="div" className="items-center" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">mnlpaglia@gmail.com</p>
                {/* <p className="font-semibold">{pb.authStore.model.email}</p> */}
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={logout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <Link
                size="lg"
                className="w-full"
                to={item.path}
                as={NavLink}
                onPress={() => {
                  if (item.path === "/access") {
                    logout();
                  }
                }}
                isBlock
                color={
                  index === menuItems.length - 1
                    ? "danger"
                    : isActiveLocation(item.path)
                    ? "secondary"
                    : "foreground"
                }
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
