
import PrivateRoute from "@/components/PrivateRoute/PrivateRoute";

export const routesGenerator = (items) => {
  console.log(items ,"item menu generator")
  return items.flatMap((item) => {
    if (item.children) {
      return routesGenerator(item.children);
    }

    // Wrap with ProtectedRoute only if role is defined
    const element = item.role ? (
      <PrivateRoute role={item.role}>{item.element}</PrivateRoute>
    ) : (
      item.element
    );

    return [
      {
        path: item.path,
        element,
      },
    ];
  });
};




// previwes version ata chilo 

// export const routesGenerator = (items) => {
//   const routes = items.reduce((acc, item) => {
//     if (item.path && item.element) {
//       acc.push({
//         path: item.path,
//         element: item.element,
//       });
//     }
//     if (item.children) {
//       item.children.forEach((child) => {
//         acc.push({
//           path: child.path,
//           element: child.element,
//         });
//       });
//     }
//     return acc;
//   }, []);
//   return routes;
// };
