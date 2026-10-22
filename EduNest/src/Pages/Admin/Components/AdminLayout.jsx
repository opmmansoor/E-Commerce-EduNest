
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {Sidebar, Menu, MenuItem} from "react-pro-sidebar";
import {LayoutDashboard,Package,Users,ShoppingBag,Menu as MenuIcon,
  LogOut,
  GraduationCap,
  Bell,
  ChevronLeft,
  Trash,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../../Slice/authSlice";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const navigate = useNavigate();

  let admin = null;

  try {
    admin = JSON.parse(
      localStorage.getItem("admin") || "null"
    );
  } catch {
    admin = null;
  }

  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("user");

    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={19} />,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: <Package size={19} />,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: <Users size={19} />,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: <ShoppingBag size={19} />,
    },
    {
      label: "Trashed List",
      path: "/admin/trash",
      icon: <Trash size={19} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        breakPoint="md"
        backgroundColor="#211B4D"
        rootStyles={{
          border: "none",
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        <div className="flex h-20 items-center justify-between px-4">
          {!collapsed && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 text-xl font-bold text-white"
            >
              <GraduationCap
                size={30}
                className="text-[#F7B801]"
              />
              EduNest
            </Link>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-lg p-2 text-white hover:bg-[#3D348B] md:block"
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <MenuIcon size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {!collapsed && (
          <p className="px-5 pb-3 pt-5 text-xs font-semibold uppercase tracking-widest text-purple-300">
            Main Menu
          </p>
        )}

        <Menu
          menuItemStyles={{
            button: ({ active }) => ({
              color: "#F9FAFB",
              margin: "5px 0",
              borderRadius: "10px",
              backgroundColor: active
                ? "#3D348B"
                : "transparent",
              "&:hover": {
                backgroundColor: "#3D348B",
              },
            }),
          }}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.path}
              icon={item.icon}
              component={<NavLink to={item.path} />}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>

        <div className="absolute bottom-4 left-0 w-full px-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-white hover:bg-[#3D348B]"
          >
            <LogOut size={19} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </Sidebar>

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b bg-white px-4 shadow-sm sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setToggled(true)}
              className="rounded-lg p-2 text-[#211B4D] hover:bg-gray-100 md:hidden"
              aria-label="Open sidebar"
            >
              <MenuIcon size={23} />
            </button>

            <div>
              <h1 className="text-lg font-bold text-[#211B4D] sm:text-xl">
                Admin Panel
              </h1>
              <p className="hidden text-sm text-gray-500 sm:block">
                Manage your EduNest store
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <button
              aria-label="Notifications"
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
            >
              <Bell size={21} />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7B801] font-bold text-[#211B4D]">
                {(admin?.firstName || "A")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">
                  {admin?.firstName || "Admin"}
                </p>
                <p className="text-xs text-gray-500">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Child pages render here */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
