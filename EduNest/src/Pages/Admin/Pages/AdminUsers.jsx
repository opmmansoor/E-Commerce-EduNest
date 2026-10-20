import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import { getUsers, updateUserStatus } from '../../../Api/adminUserApi';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Search, ShieldBan, ShieldCheck, UsersIcon } from 'lucide-react';

export default function AdminUsers() {

    const PAGE_SIZE = 5

    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);

// Fetch users
    const {
        data: users = [], isLoading, isError, error 
    } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });

//Block / unblock users Mutation
    const statusMutation = useMutation({
        mutationFn: updateUserStatus,

        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });

            toast.success(
                updatedUser.isBlocked
                 ? "User blocked successfully"
                 : "User unblocked successfully"
            );
        },

        onError: () => {
            toast.error("Failed to update user status");
        },
    });

// Search and filter    
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const fullName = 
            `${user.firstName ?? ""} ${user.secondName ?? ""}`;

            const matchesSearch = 
              fullName.toLowerCase().includes(search.toLowerCase()) || 
              (user.email ?? "").toLowerCase().includes(search.toLowerCase());

              const matchesStatus = 
              status === "all" ||
              (status === "blocked" && user.isBlocked === true) ||
              (status === "active" && user.isBlocked !== true);

              return matchesSearch && matchesStatus;
        });
    },[users, search, status]);


    const totalPages = Math.max(
        1, Math.ceil(filteredUsers.length / PAGE_SIZE)
    );

    const currentPage = Math.min(page, totalPages);

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handleStatusChange  = (user) => {
        const action = user.isBlocked ? "unblock" : "block";

        if (
            !window.confirm(`Are you sure you want to ${action} this user?`)
        ) {
            return;
        }
        statusMutation.mutate(user);
    };

    if (isLoading) {
        return (
            <div className="p-8 text-center text-gray-500">
                 Loading users...
            </div>
        );
    }

    if ( isError ) {
        return (
        <div className="p-8 text-center text-red-600">
             Failed to load users: {error.message}
         </div>
        );
    }


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#211B4D] sm:text-3xl">
            User Managment
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage registered EduNest customers.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm text-gray-500">Total Users</p>
                   <h2 className="mt-2 text-3xl font-bold">
                        {users.filter((user) => user.role === "user").length}
                   </h2> 
                </div>

                <UsersIcon size={30} 
                        className="text-[#3D348B]"/>
            </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Blocked User</p>
                    <h2 className="mt-2 text-3xl font-bold text-red-600">
                        {users.filter((user) => user.isBlocked).length}
                    </h2>
                </div>

                <ShieldBan size={30} 
                        className="text-red-500"/> 
            </div>
        </div>
      </div>

{/* Table       */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                    Registered User
                </h2>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex items-center gap-2 rounded-lg border px-3">
                        <Search size={18} 
                                className="text-gray-400"/>
                        <input 
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder='Search name or email'
                                className="w-full py-2 text-sm outline-none sm:w-52" />
                    </div>

                    <select value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPage(1);
                            }}
                            className="rounded-lg border px-3 py-2 text-sm outline-none">
                    
                        <option value="all">All Users</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-5 py-4">User</th>
                            <th className="px-5 py-4">Email</th>
                            <th className="px-5 py-4">Role</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {paginatedUsers.map((user) => (
                            <tr
                              key={user.id}
                                  className="transition hover:bg-gray-50"
                                  >
                                <td className='px-5 py-4'>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3D348B]/10 font-semibold text-[#3D348B]">
                                            {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                        <span className="font-medium text-gray-800">
                                            {user.firstName}{user.secondName}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-5 py-4 text-gray-600">
                                    {user.email}
                                </td>

                                <td className='px-5 py-4'>
                                    <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium capitalize">
                                        {user.role || "User"}
                                    </span>
                                </td>

                                <td className="px-5 py-4">
                                    <span 
                                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            user.isBlocked
                                                ? "bg-red-100 text-red-700"
                                                : "bg-green-100 text-green-700"
                                          }`}>
                                        {user.isBlocked ? "Blocked" : "Active"}    
                                    </span>
                                </td>

                                <td>
                                    {user.role === "admin" ? (
                                        <span className="text-xs text-gray-400">
                                            Admin account
                                        </span>
                                    ) : (
                                        <button
                                                onClick={() => handleStatusChange(user)}
                                                disabled={statusMutation.isPending}
                                                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 
                                                            ${ user.isBlocked
                                                                ? "bg-green-600 hover:bg-green-700"
                                                                : "bg-red-500 hover:bg-red-600"

                                                            }`}>

                                                                {user.isBlocked ? (
                                                                    <ShieldCheck size={15} />
                                                                ) : (
                                                                    <ShieldBan size={15} />
                                                                )}

                                                                {statusMutation.isPending
                                                                ? "Updating..."
                                                                : user.isBlocked
                                                                    ? "Unblock"
                                                                    : "Block"}

                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}


                        {paginatedUsers.length === 0 && (
                            <tr>
                                <td colSpan={5}
                                    className="px-5 py-12 text-center text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


{/* Pagination */}   
            <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                    {filteredUsers.length === 0 
                      ? "No users to display"
                      : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(
                        currentPage * PAGE_SIZE,
                        filteredUsers.length
                      )} of ${filteredUsers.length} users`}
                </p>
                <div className="flex items-center gap-3">
                    <button
                            disabled={currentPage === 1}
                            onClick={() => setPage ((previous) => previous - 1)}
                            className="rounded-lg border p-2 disabled:opacity-40"
                            aria-label='Previous Page'>
                        <ChevronLeft size={18} />
                    </button>

                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                            disabled={currentPage === totalPages}
                            onClick={() => setPage ((previous) => previous + 1)}
                            className="rounded-lg border p-2 disabled:opacity-40"
                            aria-label='Next Page'>
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}
