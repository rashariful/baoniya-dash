import { Provider } from "react-redux";
import { store } from "@/redux/store";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";

// import router from "./routes/router"; // <-- এখানে createBrowserRouter import

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />  {/* <-- AppRoutes এর জায়গায় */}
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;


// import { Provider } from "react-redux";
// import { store } from "@/redux/store";

// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter } from "react-router-dom";
// import AppRoutes from "./routes/routes";

// const queryClient = new QueryClient();

// const App = () => (
//   <Provider store={store}>
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <AppRoutes />
//         </BrowserRouter>
//       </TooltipProvider>
//     </QueryClientProvider>
//   </Provider>
// );

// export default App;
