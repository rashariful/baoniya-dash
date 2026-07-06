import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, setUser } from "@/redux/features/authSlice";
import { getUserInfo } from "@/utils/auth";

const PrivateRoute = ({ children, role }) => {
  const dispatch = useDispatch();
  const userInfo = getUserInfo();


  if (role !== undefined && role !== userInfo?.user?.role) {


    dispatch(logout());
    return <Navigate to="/login" replace={true} />;
  }
  if (!userInfo) {


    return <Navigate to="/login" replace={true} />;
  }

  dispatch(setUser(userInfo));
  return children;
};

export default PrivateRoute;


// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useTypedSelector } from "@/redux/hooks";

// interface PrivateRouteProps {
//   children: React.ReactNode;
//   role?: string | string[];
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {

//   const { user, isLoading } = useTypedSelector((state) => state.auth);
//   const location = useLocation();

//   console.log(user?.role , "user role check from rdux");

//   if (isLoading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (role) {
//     const roles = Array.isArray(role) ? role : [role];

//     if (!roles.includes(user?.role)) {
//       return <Navigate to="/login" replace />;
//     }
//   }

//   return <>{children}</>;
// };

// export default PrivateRoute;