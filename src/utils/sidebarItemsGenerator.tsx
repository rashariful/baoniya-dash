import { NavLink } from "react-router-dom";
import { Tooltip } from 'antd';
export const sidebarItemsGenerator = (items, role, collapsed) => {
  const sidebarItems = items.reduce((acc, item) => {
    // Check if the item should be shown based on the user's role
    console.log(items, role,"from sidebaritemgenerator" )
    if (item.roles && !item.roles.includes(role) || item.sidebar === false) {
      return acc; // Skip this item if the user's role is not allowed
    }

    // Add the main item to the sidebar
    if (item.path && item.name) {
      acc.push({
        key: item.name,
        label: (
          <Tooltip title={collapsed ? item.name : ""} placement="right">
            <NavLink
              className="flex items-center gap-2 !text-gray-600 !text-md"
              to={`/${item.path}`}>
              {item.icon}
              {collapsed ? null : item.name}
            </NavLink>
          </Tooltip>
        ),
      });
    }

    // Add children items if they exist and check roles for children too
    if (item.children) {
      const children = item.children
        .filter(child => !child.roles || child.roles.includes(role))
        .map((child) => {
          if (child.name) {
            return {
              key: child.name,
              label: (
                <NavLink
                  className="flex items-center gap-2 !text-gray-600"
                  to={`/${child.path}`}>
                  {child.icon} {child.name}
                </NavLink>
              ),
            };
          }
        });

      if (children.length > 0) {
        acc.push({
          key: item.name,
          label: (
            <span className="flex items-center gap-2 !text-gray-600">
              {item.icon} {
                collapsed ? null : item.name
              }
            </span>
          ),
          children,
        });
      }
    }

    return acc;
  }, []);

  return sidebarItems;
};










