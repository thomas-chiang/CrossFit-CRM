import React from "react";
import { ProSidebar, Menu, MenuItem, SidebarContent } from "react-pro-sidebar";

export default function Aside({ setSection, role }) {
  return (
    <ProSidebar>
      <SidebarContent>
        <Menu iconShape="circle">
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <MenuItem onClick={() => setSection("personal info")}>Personal Information</MenuItem>

          {role >= 2 ? (
            <>
              <MenuItem onClick={() => setSection("performance")}>Record Performances</MenuItem>
              <MenuItem onClick={() => setSection("enroll and checkout")}>
                {role == 2 ? "Enroll Users" : "Enroll & Checkout Users"}
              </MenuItem>
            </>
          ) : (
            <></>
          )}

          {role >= 3 ? (
            <>
              <MenuItem onClick={() => setSection("member")}>Manage Users</MenuItem>
            </>
          ) : (
            <></>
          )}

          <MenuItem onClick={() => setSection("points")}>View Point Histories</MenuItem>

          {role >= 2 ? (
            <>
              <MenuItem onClick={() => setSection("movement")}>Manage Movements</MenuItem>
              <MenuItem onClick={() => setSection("workout")}>Manage Workouts</MenuItem>
            </>
          ) : (
            <></>
          )}

          {role >= 3 ? (
            <>
              <MenuItem onClick={() => setSection("create course")}>Create Courses</MenuItem>
              <MenuItem onClick={() => setSection("calendar")}>Update Courses</MenuItem>
            </>
          ) : (
            <></>
          )}
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
}
