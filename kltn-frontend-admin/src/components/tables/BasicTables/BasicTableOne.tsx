import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useQuery } from "@tanstack/react-query";
import Badge from "../../ui/badge/Badge";
import { getAllUsers } from "@/services/useUserService";
import { UserResponse } from "@/types/responses/authResponse";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { getAllUsersRequest } from "@/types/requests/userRequest";
import { createParser, parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";
import EditUserModal from "./EditUserModal";
import { useModal } from "@/hooks/useModal";
import { useState } from "react";


const parseAsState = createParser<"" | "true" | "false">({
  parse: (value) => (value === "true" || value === "false" ? value : ""),
  serialize: (value) => value,
});

export default function BasicTableOne() {
  const { authUser } = useAuthStore();
  const { isOpen: isEditModalOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  
  const [query, setQuery] = useQueryStates(
    {
      keyword: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
      state: parseAsState.withDefault(""),
    },
    { history: "replace" }
  );

  const searchParams: getAllUsersRequest = {
    searchTerm: query.keyword,
    stateParam: query.state,
    currentPage: query.page - 1, 
    itemsPerPage: query.limit,
  };

  const { data, isError, error } = useQuery({
    queryKey: ["users", searchParams],
    queryFn: () => getAllUsers(searchParams),
    staleTime: 5 * 60 * 1000,
    enabled: !!authUser,
  });

  const users: UserResponse[] = data?.users || [];
  const totalPages = data?.total_page || 0;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setQuery({ page });
    }
  };

  const handleSearch = (searchTerm: string) => {
    setQuery({ keyword: searchTerm, page: 1 });
  };

  const handleEditUser = (user: UserResponse) => {
    setSelectedUser(user);
    openEditModal();
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      query.page - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            i === query.page
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  const convertDate = (date: string) : string => {
      const [month, day, year] = date.split("/");
      return  `${day}-${month}-${year}`;
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-red-500">
        Error loading users: {error?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name, email, username..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
              value={query.keyword}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {query.keyword && (
              <button
                onClick={() => handleSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors appearance-none cursor-pointer"
              value={query.state}
              onChange={(e) => setQuery({ state: e.target.value as "" | "true" | "false", page: 1 })}
            >
              <option value="">All Users</option>
              <option value="true">Active Users</option>
              <option value="false">Inactive Users</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Items per page */}
          <div className="relative sm:w-32">
            <select
              className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors appearance-none cursor-pointer text-sm"
              value={query.limit}
              onChange={(e) => setQuery({ limit: Number(e.target.value), page: 1 })}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Total: {users.length} users</span>
          </div>
          {query.state === "true" && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
              <UserCheck className="h-4 w-4" />
              <span>Active only</span>
            </div>
          )}
          {query.state === "false" && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
              <UserX className="h-4 w-4" />
              <span>Inactive only</span>
            </div>
          )}
          {query.keyword && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
              <Search className="h-4 w-4" />
              <span>Searching: "{query.keyword}"</span>
            </div>
          )}
        </div>
      </div>

      {/* Table with Scrollbar */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto overflow-y-auto max-h-[600px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] sticky top-0 bg-white dark:bg-gray-800 z-10">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Phone
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Created Date
                </TableCell>

                 <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.length === 0 ? (
                <TableRow>
                  <td 
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No users found
                  </td>
                </TableRow>
              ) : (
                users.map((user: UserResponse) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-200">
                          {user.avatar_url ? (
                            <img
                              width={40}
                              height={40}
                              src={user.avatar_url}
                              alt={user.full_name || user.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              {(user.full_name || user.username)
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {user.full_name || user.username}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            @{user.username}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.email || "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.phone_number || "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={user.is_active ? "success" : "error"}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {user.created_date
                        ? convertDate(new Date(user.created_date).toLocaleDateString())
                        : "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Button onClick={() => handleEditUser(user)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>
                Showing page {query.page} of {totalPages}
              </span>
              <span className="hidden sm:inline">
                ({query.limit} items per page)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(query.page - 1)}
                disabled={query.page === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">{renderPageNumbers()}</div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(query.page + 1)}
                disabled={query.page === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        user={selectedUser}
      />
    </div>
  );
}
