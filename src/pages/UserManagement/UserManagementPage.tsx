import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  UserPlus,
  Shield,
  User,
  GraduationCap,
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lock,
  Unlock,
  Mail,
  Phone,
  UserCheck,
  UserX,
} from "lucide-react";

const API_ROOT =
  import.meta.env.VITE_REACT_APP_ROOT || "http://localhost:5000/api/v1";
import  {apiFetch}  from "@/utils/apiClient";

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [selectedUser, setSelectedUser] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    status: "active",
    phone: "",
    bio: "",
  });

  // Filter and search
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  
  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${API_ROOT}/auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(response, "user response")

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      console.log(data, "user data")
      setUsers(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const createUser = async (userData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`${API_ROOT}/auth/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Failed to create user");

      const newUser = await response.json();
      setUsers([newUser.data, ...users]);
      setSuccess("User created successfully!");
      setTimeout(() => setSuccess(""), 3000);
      closeModal();
    } catch (err) {
      setError(err.message);
      console.error("Error creating user:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken")

      // Prepare update data - remove password if empty
      const updatePayload = { ...userData };
      if (!updatePayload.password || updatePayload.password.trim() === "") {
        delete updatePayload.password;
      }

      const response = await fetch(`${API_ROOT}/auth/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      const updatedUser = await response.json();
      setUsers(
        users.map((user) => (user._id === id ? updatedUser.data : user)),
      );
      setSuccess("User updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      closeModal();
    } catch (err) {
      setError(err.message);
      console.error("Error updating user:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`${API_ROOT}/auth/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers(users.filter((user) => user._id !== id));
      setSuccess("User deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Error deleting user:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle user status (block/unblock)
  const toggleUserStatus = async (user) => {
    const newStatus = user.status === "active" ? "blocked" : "active";
    const action = newStatus === "active" ? "unblocked" : "blocked";

    if (!window.confirm(`Are you sure you want to ${action} ${user.name}?`))
      return;

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`${API_ROOT}/auth/${user._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error(`Failed to ${action} user`);

      setUsers(
        users.map((u) =>
          u._id === user._id ? { ...u, status: newStatus } : u,
        ),
      );
      setSuccess(`User ${action} successfully!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Error toggling user status:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update user role
  const updateUserRole = async (id, newRole) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`${API_ROOT}/auth/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error("Failed to update role");

      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, role: newRole } : user,
        ),
      );
      setSuccess("User role updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Error updating role:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for create
  const openCreateModal = () => {
    setModalMode("create");
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "student",
      status: "active",
      phone: "",
      bio: "",
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
      phone: user.phone || "",
      bio: user.bio || "",
    });
    setIsModalOpen(true);
  };

  // Open modal for view
  const openViewModal = (user) => {
    setModalMode("view");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "student",
      status: "active",
      phone: "",
      bio: "",
    });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "create") {
      createUser(formData);
    } else if (modalMode === "edit") {
      updateUser(selectedUser._id, formData);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield size={18} className="text-purple-600" />;
      case "instructor":
        return <BookOpen size={18} className="text-blue-600" />;
      case "mentor":
        return <Users size={18} className="text-green-600" />;
      case "student":
        return <GraduationCap size={18} className="text-orange-600" />;
      default:
        return <User size={18} className="text-gray-600" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1 w-fit">
            <CheckCircle size={12} /> Active
          </span>
        );
      case "blocked":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1 w-fit">
            <XCircle size={12} /> Blocked
          </span>
        );
      case "suspended":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit">
            <AlertCircle size={12} /> Suspended
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Paginate
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Fetch users on mount
useEffect(() => {
  console.log("UserManagementPage mounted");
  fetchUsers();
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
            <CheckCircle size={20} />
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Role Filter */}
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 appearance-none bg-white"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="instructor">Instructor</option>
                  <option value="mentor">Mentor</option>
                  <option value="student">Student</option>
                </select>
                <Filter
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Create User Button */}
            <button
              onClick={openCreateModal}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <UserPlus size={20} />
              Create User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
            <button
              onClick={fetchUsers}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {loading && users.length === 0 ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            </div>
          ) : currentUsers.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No users found. Create your first user!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Email Verified
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Last Login
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <select
                            value={user.role}
                            onChange={(e) =>
                              updateUserRole(user._id, e.target.value)
                            }
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="student">Student</option>
                            <option value="mentor">Mentor</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {user.phone || "—"}
                      </td>
                      <td className="px-6 py-4">
                        {user.isEmailVerified ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle size={14} /> Verified
                          </span>
                        ) : (
                          <span className="text-yellow-600 flex items-center gap-1">
                            <AlertCircle size={14} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openViewModal(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.status === "active"
                                ? "text-red-600 hover:bg-red-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                            title={
                              user.status === "active"
                                ? "Block User"
                                : "Unblock User"
                            }
                          >
                            {user.status === "active" ? (
                              <Lock size={18} />
                            ) : (
                              <Unlock size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2  hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed 
               px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white  hover:shadow-lg transition-all flex items-center gap-2
                "
              >
                Previews
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2  hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed 
               px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white  hover:shadow-lg transition-all flex items-center gap-2
                "
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit/View */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-900">
                {modalMode === "create" && "Create New User"}
                {modalMode === "edit" && "Edit User"}
                {modalMode === "view" && "User Details"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {modalMode === "view" && selectedUser ? (
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">
                      {selectedUser.name}
                    </h4>
                    <p className="text-gray-600">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Role</label>
                    <p className="font-medium flex items-center gap-2 mt-1">
                      {getRoleIcon(selectedUser.role)}
                      {selectedUser.role?.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedUser.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="font-medium">{selectedUser.phone || "—"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Email Verified
                    </label>
                    <p className="font-medium">
                      {selectedUser.isEmailVerified ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-gray-500">Bio</label>
                    <p className="font-medium mt-1">
                      {selectedUser.bio || "No bio added"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Created At</label>
                    <p className="font-medium">
                      {new Date(selectedUser.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Last Login</label>
                    <p className="font-medium">
                      {selectedUser.lastLogin
                        ? new Date(selectedUser.lastLogin).toLocaleString()
                        : "Never"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={modalMode === "edit"}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {modalMode === "create"
                        ? "Password *"
                        : "Password (leave blank to keep current)"}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={modalMode === "create"}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role *
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="student">Student</option>
                        <option value="mentor">Mentor</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading
                      ? "Processing..."
                      : modalMode === "create"
                        ? "Create User"
                        : "Update User"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
