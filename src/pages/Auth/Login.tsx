"use client";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useLoginMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.jpeg";
import { storeUserInfo } from "@/utils/auth";
import { verifyToken } from "@/utils/jwt";
import { BookOpen, GraduationCap, Users } from "lucide-react";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = async (values) => {
    try {
      const { identifier, password } = values;

      // 🔥 identifier ta email na phone eta detect kora
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

      const payload = isEmail
        ? { email: identifier.toLowerCase(), password }
        : { phone: identifier, password };

      const res = await login(payload).unwrap();
      const decoded = verifyToken(res?.data?.accessToken);
      const role = decoded.role;

      dispatch(setUser({ user: { ...res.data, role }, token: res?.data?.accessToken }));
      storeUserInfo({ accessToken: res?.data?.accessToken });

      // 🔥 mustChangePassword check — password change page e redirect
      if (res?.data?.user?.mustChangePassword) {
        message.info("Please change your password to continue.");
        navigate("/change-password", { replace: true });
        return;
      }

      message.success("Welcome back to your learning journey!");

      const roleBasePath = {
        admin: "/dashboard",
        mentor: "/mentor",
        teacher: "/teacher",
        student: "/student",
      };

      const from = location.state?.from?.pathname || roleBasePath[role] || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      message.error(err?.data?.message || "Invalid credentials!");
    }
  };

  return (
    <div className="min-h-screen bg-[#033320] flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(#CF962C 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <Card
          className="shadow-2xl border-t-4 border-t-[#CF962C] rounded-2xl overflow-hidden"
          bodyStyle={{ padding: "40px" }}
        >
          <div className="text-center mb-8">
            <img src={logo} alt="Logo" className="shadow-xl drop-shadow rounded-full w-20 h-20 mx-auto mb-4 object-contain" />
            <Title level={3} className="!text-[#033320] font-bold">আবদুল জলিল উচ্চ বিদ্যালয়</Title>
            <Text className="text-slate-500">Log in to continue your education</Text>
          </div>

          <Form name="login" onFinish={onFinish} layout="vertical">
            <Form.Item
              name="identifier"
              rules={[
                { required: true, message: "Please enter your phone or email" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-slate-400" />}
                size="large"
                placeholder="Phone Number or Email"
              />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: "Please enter your password" }]}>
              <Input.Password
                prefix={<LockOutlined className="text-slate-400" />}
                size="large"
                placeholder="Password"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="w-full h-12 bg-[#014B27] hover:bg-[#033320] border-0 shadow-lg font-semibold text-white mt-2"
            >
              Access School
            </Button>
          </Form>

          <div className="flex justify-center gap-6 mt-8 text-[#6b9b7b]">
            <div className="flex flex-col items-center"><BookOpen size={20} /><span className="text-[10px] mt-1 uppercase font-bold">Curriculum</span></div>
            <div className="flex flex-col items-center"><GraduationCap size={20} /><span className="text-[10px] mt-1 uppercase font-bold">Certified</span></div>
            <div className="flex flex-col items-center"><Users size={20} /><span className="text-[10px] mt-1 uppercase font-bold">Community</span></div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// "use client";
// import { LockOutlined, MailOutlined } from "@ant-design/icons";
// import { Button, Card, Form, Input, Typography, message } from "antd";
// import { useLoginMutation } from "@/redux/api/authApi";
// import { setUser } from "@/redux/features/authSlice";
// import { useDispatch } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import { motion } from "framer-motion";
// import logo from "@/assets/logo.jpeg"; // Replace with your School/Academy Logo
// import { storeUserInfo } from "@/utils/auth";
// import { verifyToken } from "@/utils/jwt";
// import { BookOpen, GraduationCap, Users } from "lucide-react"; // Updated Icons

// const { Title, Text } = Typography;

// export default function LoginPage() {
//   const [login, { isLoading }] = useLoginMutation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const onFinish = async (values) => {
//     try {
//       const res = await login(values).unwrap();
//       const decoded = verifyToken(res?.data?.accessToken);
//       const role = decoded.role;

//       dispatch(setUser({ user: { ...res.data, role }, token: res?.data?.accessToken }));
//       storeUserInfo({ accessToken: res?.data?.accessToken });

//       message.success("Welcome back to your learning journey!");

//       const roleBasePath = {
//         admin: "/dashboard",
//         mentor: "/mentor",
//         teacher: "/teacher",
//       };

//       const from = location.state?.from?.pathname || roleBasePath[role] || "/dashboard";
//       navigate(from, { replace: true });
//     } catch (err) {
//       message.error(err?.data?.message || "Invalid credentials!");
//     }
//   };

//   return (
//     // Academic Deep Blue / Teal Theme
//     <div className="min-h-screen bg-[#033320] flex items-center justify-center p-4 relative overflow-hidden">
      
//       {/* Subtle Geometric Pattern */}
//       <div className="absolute inset-0 opacity-[0.05]" 
//            style={{ backgroundImage: "radial-gradient(#CF962C 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

//       <motion.div 
//         initial={{ opacity: 0, scale: 0.95 }} 
//         animate={{ opacity: 1, scale: 1 }}
//         className="w-full max-w-md z-10"
//       >
//         <Card 
//           className="shadow-2xl border-t-4 border-t-[#CF962C] rounded-2xl overflow-hidden"
//           bodyStyle={{ padding: "40px" }}
//         >
//           <div className="text-center mb-8">
//             <img src={logo} alt="Logo" className="w-20 h-20 mx-auto mb-4 object-contain" />
//             <Title level={3} className="!text-[#033320] font-bold">Al-Noor Academy</Title>
//             <Text className="text-slate-500">Log in to continue your education</Text>
//           </div>

//           <Form name="login" onFinish={onFinish} layout="vertical">
//             <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
//               <Input prefix={<MailOutlined className="text-slate-400" />} size="large" placeholder="Institutional Email" />
//             </Form.Item>

//             <Form.Item name="password" rules={[{ required: true }]}>
//               <Input.Password prefix={<LockOutlined className="text-slate-400" />} size="large" placeholder="Password" />
//             </Form.Item>

//             <Button 
//               type="primary" 
//               htmlType="submit" 
//               loading={isLoading} 
//               className="w-full h-12 bg-[#014B27] hover:bg-[#033320] border-0 shadow-lg font-semibold text-white mt-2"
//             >
//               Access Classroom
//             </Button>
//           </Form>

//           {/* Educational Trust Badges */}
//           <div className="flex justify-center gap-6 mt-8 text-[#6b9b7b]">
//             <div className="flex flex-col items-center"><BookOpen size={20} /><span className="text-[10px] mt-1 uppercase font-bold">Curriculum</span></div>
//             <div className="flex flex-col items-center"><GraduationCap size={20} /><span className="text-[10px] mt-1 uppercase font-bold">Certified</span></div>
//             <div className="flex flex-col items-center"><Users size={20} /><span className="text-[10px] mt-1 uppercase font-bold">Community</span></div>
//           </div>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }

// "use client";
// import { LockOutlined, MailOutlined } from "@ant-design/icons";
// import { Button, Card, Form, Input, Typography, message } from "antd";
// import { useLoginMutation } from "@/redux/api/authApi";
// import { setUser } from "@/redux/features/authSlice";
// import { useDispatch } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import { motion } from "framer-motion";
// import logo from "@/assets/logo.jpeg";
// import { storeUserInfo } from "@/utils/auth";
// import { verifyToken } from "@/utils/jwt";
// import { Package, Truck, ShieldCheck } from "lucide-react";

// const { Title, Text } = Typography;

// export default function LoginPage() {
//   const [login, { isLoading }] = useLoginMutation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = location.state?.from?.pathname || "/dashboard";

//  const onFinish = async (values) => {
//   try {
//     const res = await login(values).unwrap();
//     const decoded = verifyToken(res?.data?.accessToken);
//     console.log(decoded)
//     const role = decoded.role;

//     dispatch(setUser({ user: { ...res.data, role }, token: res?.data?.accessToken }));
//     storeUserInfo({ accessToken: res?.data?.accessToken });

//     message.success("Login successful!");

//     // role অনুযায়ী base path ঠিক করা
//     const roleBasePath = {
//       admin: "/dashboard",
//       mentor: "/mentor",
//       teacher: "/teacher",
//     };

//     const from = location.state?.from?.pathname || roleBasePath[role] || "/dashboard";
//     navigate(from, { replace: true });
//   } catch (err) {
//     message.error(err?.data?.message || "Login failed!");
//   }
// };

//   return (
//     // Clean, Professional Slate Background
//     <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
//       {/* Subtle Pattern/Background Elements */}
//       <div className="absolute inset-0 opacity-[0.03]" 
//            style={{ backgroundImage: "radial-gradient(#f97316 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

//       <motion.div 
//         initial={{ opacity: 0, y: 20 }} 
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-md z-10"
//       >
//         <Card 
//           className="shadow-2xl border-t-4 border-t-orange-500 rounded-xl overflow-hidden"
//           bodyStyle={{ padding: "40px" }}
//         >
//           <div className="text-center mb-8">
//             <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />
//             <Title level={3} className="!text-slate-800 font-bold">Welcome Back</Title>
//             <Text className="text-slate-500">Sign in to your B2B Portal</Text>
//           </div>

//           <Form name="login" onFinish={onFinish} layout="vertical">
//             <Form.Item name="email" rules={[{ required: true }]}>
//               <Input prefix={<MailOutlined className="text-slate-400" />} size="large" placeholder="Email Address" />
//             </Form.Item>

//             <Form.Item name="password" rules={[{ required: true }]}>
//               <Input.Password prefix={<LockOutlined className="text-slate-400" />} size="large" placeholder="Password" />
//             </Form.Item>

//             <Button 
//               type="primary" 
//               htmlType="submit" 
//               loading={isLoading} 
//               className="w-full h-12 bg-orange-500 hover:bg-orange-600 border-0 shadow-lg font-semibold text-white mt-2"
//             >
//               Sign In
//             </Button>
//           </Form>

//           {/* Simple Trust Badges */}
//           <div className="flex justify-center gap-6 mt-8 text-slate-400">
//             <div className="flex flex-col items-center"><Package size={20} /><span className="text-[10px] mt-1">Fast Shipping</span></div>
//             <div className="flex flex-col items-center"><ShieldCheck size={20} /><span className="text-[10px] mt-1">Certified</span></div>
//             <div className="flex flex-col items-center"><Truck size={20} /><span className="text-[10px] mt-1">Logistics</span></div>
//           </div>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }


// "use client";
// import { LockOutlined, MailOutlined } from "@ant-design/icons";
// import { Button, Card, Form, Input, Typography, message } from "antd";
// import { useLoginMutation } from "@/redux/api/authApi";
// import { setUser } from "@/redux/features/authSlice";
// import { useDispatch } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import { motion } from "framer-motion";
// import logo from "@/assets/logo.jpg";
// import { storeUserInfo } from "@/utils/auth";
// import { verifyToken } from "@/utils/jwt";

// const { Title, Text } = Typography;

// export default function LoginPage() {
//   const [login, { isLoading }] = useLoginMutation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = location.state?.from?.pathname || "/dashboard";

// const onFinish = async (values) => {
//   try {
//     const deviceId = localStorage.getItem("deviceId");
//     const loginData = {
//       email: values.email,
//       password: values.password,
//       ...(deviceId && { deviceId }),
//     };

//     const res = await login(loginData).unwrap();
//     console.log(res, "after login info");

//     const decoded = verifyToken(res?.data?.accessToken);
//     console.log("Decoded user:", decoded);

//     // ✅ Enhanced user object with proper name
//     const userPayload = {
//       id: decoded.id || res.data.userId,
//       name: res.data.name ,// email থেকে name বানানো
//       email: res.data.email,
//       role: decoded.role?.toLowerCase(),
//     };

//     console.log("Final userPayload for Redux:", userPayload);

//     // Dispatch to Redux
//     dispatch(setUser({
//       user: userPayload,
//       token: res?.data?.accessToken
//     }));

//     // Store token
//     storeUserInfo({ accessToken: res?.data?.accessToken });
//     localStorage.setItem("accessToken", res?.data?.accessToken);
//     if (res?.data?.deviceId) localStorage.setItem("deviceId", res?.data?.deviceId);

//     // Role-based navigation
//     const role = decoded.role?.toLowerCase();
//     if (role === "admin") navigate("/dashboard", { replace: true });
//     else if (role === "mentor") navigate("/mentor", { replace: true });
//     else if (role === "student") navigate("/student", { replace: true });
//     else navigate(from, { replace: true });

//     message.success("Login successful!");
//   } catch (err) {
//     console.error(err);
//     message.error(err?.data?.message || "Login failed!");
//   }
// };

//   // const onFinish = async (values) => {
//   //   try {
//   //     const deviceId = localStorage.getItem("deviceId");
//   //     const loginData = {
//   //       email: values.email,
//   //       password: values.password,
//   //       ...(deviceId && { deviceId }),
//   //     };

//   //     const res = await login(loginData).unwrap();
//   //     console.log(res, "after login info")
//   //     const user = verifyToken(res?.data?.accessToken);
//   //     console.log("Decoded user:", user);

//   //     dispatch(setUser({ user, token: res?.data?.accessToken }));
//   //     storeUserInfo({ accessToken: res?.data?.accessToken });
//   //     localStorage.setItem("accessToken", res?.data?.accessToken);
//   //     if (res?.data?.deviceId) localStorage.setItem("deviceId", res?.data?.deviceId);

//   //     // Role-based navigation
//   //     if (user?.role === "admin") navigate("/dashboard", { replace: true });
//   //     else if (user?.role === "mentor") navigate("/mentor", { replace: true });
//   //     else if (user?.role === "user") navigate("/user", { replace: true });
//   //     else if (user?.role === "student") navigate("/student", { replace: true });
//   //     else navigate(from, { replace: true });

//   //     message.success("Login successful!");
//   //   } catch (err) {
//   //     console.error(err);
//   //     message.error(err?.message || "Login failed!");
//   //     // message.error(err?.data?.message || "Login failed!");
//   //   }
//   // };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="mb-8 flex flex-col items-center"
//       >
//         <div className="w-20 h-20 shadow-2xl rounded-full">
//           <img src={logo} alt="Logo" className="mb-4 w-20 h-20 rounded-full border-4 border-blue-200" />
//         </div>
//       </motion.div>

//       <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
//         <Card className="shadow-xl rounded-2xl overflow-hidden border-0" bodyStyle={{ padding: "40px" }}>
//           <div className="text-center mb-8">
//             <Title level={3} className="text-gray-800 mb-1">
//               Welcome Back
//             </Title>
//             <Text type="secondary" className="text-sm">
//               Sign in to your dashboard
//             </Text>
//           </div>

//           <Form name="login" onFinish={onFinish} layout="vertical" autoComplete="off">
//             <Form.Item
//               name="email"
//               label="Email Address"
//               rules={[
//                 { required: true, message: "Please input your email!" },
//                 { type: "email", message: "Please enter a valid email!" },
//               ]}
//               className="mb-4"
//             >
//               <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="your@email.com" size="large" className="py-3 px-4 rounded-lg" />
//             </Form.Item>

//             <Form.Item
//               name="password"
//               label="Password"
//               rules={[
//                 { required: true, message: "Please input your password!" },
//                 { min: 6, message: "Password must be at least 6 characters!" },
//               ]}
//               className="mb-2"
//             >
//               <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" size="large" className="py-3 px-4 rounded-lg" />
//             </Form.Item>

//             <div className="flex justify-between items-center mb-6">
//               <a href="/forgot-password" className="text-sm text-primary hover:text-primary/90 hover:underline">
//                 Forgot password?
//               </a>
//             </div>

//             <Form.Item className="mb-4">
//               <Button type="primary" htmlType="submit" loading={isLoading} className="w-full h-12 font-medium text-lg bg-primary hover:bg-primary/60 rounded-lg shadow-md hover:shadow-lg transition-all" disabled={isLoading}>
//                 {isLoading ? "Signing In..." : "Sign In"}
//               </Button>
//             </Form.Item>

//             <div className="text-center text-sm text-gray-600">
//               Don't have an account?{" "}
//               <a href="/register" className="text-primary hover:text-primary/90 font-medium hover:underline">
//                 Sign up
//               </a>
//             </div>
//           </Form>
//         </Card>
//       </motion.div>

//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className="mt-8 text-center text-xs text-gray-500">
//         © {new Date().getFullYear()} <strong>Upayon.</strong> All rights reserved.
//         <br />
//         <a href="https://sbglobalbd.org/privacy-policy-policy" className="hover:underline text-primary">
//           Privacy Policy
//         </a>{" "}
//         •{" "}
//         <a href="https://sbglobalbd.org/terms-of-service" className="hover:underline text-primary">
//           Terms of Service
//         </a>
//       </motion.div>
//     </div>
//   );
// }
