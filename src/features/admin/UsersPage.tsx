import { useState } from "react";
import { useAdminUsers } from "./hooks";
import { Card, Badge, Pagination, Table, type Column } from "@/components/ui";
import { formatDate, ROLE_LABEL } from "@/lib/utils";
import type { AdminUser, Role } from "@/types";

const ROLE_TONE: Record<Role, "violet" | "red" | "blue" | "green"> = {
  ADMIN: "violet", SELLER: "red", DRIVER: "blue", BUYER: "green",
};

export function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers(page);

  const columns: Column<AdminUser>[] = [
    { key: "username", header: "Username", render: (u) => <span className="font-medium text-ink-900">{u.username}</span> },
    { key: "email", header: "Email", render: (u) => <span className="text-ink-600">{u.email}</span> },
    {
      key: "roles",
      header: "Roles",
      render: (u) => (
        <div className="flex flex-wrap gap-1">
          {u.userRoles.map((r) => <Badge key={r.role} tone={ROLE_TONE[r.role]}>{ROLE_LABEL[r.role]}</Badge>)}
        </div>
      ),
    },
    { key: "createdAt", header: "Joined", render: (u) => <span className="text-ink-500">{formatDate(u.createdAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-900">Users</h1>
      <Card className="border-0 bg-transparent shadow-none">
        <Table columns={columns} data={data?.data ?? []} isLoading={isLoading} rowKey={(u) => u.id} />
        {data && <Pagination page={page} totalPages={data.pagination.totalPages} total={data.pagination.total} onPageChange={setPage} />}
      </Card>
    </div>
  );
}
