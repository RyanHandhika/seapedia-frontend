import {
  useMutation, useQuery, useQueryClient,
} from "@tanstack/react-query";
import { adminApi } from "@/api/admin";
import { qk } from "@/lib/queryClient";
import { toast } from "@/stores/toastStore";
import { ApiException } from "@/api/client";

export function useAdminDashboard() {
  return useQuery({ queryKey: qk.adminDashboard, queryFn: adminApi.dashboard });
}
export function useAdminUsers(page: number) {
  return useQuery({ queryKey: qk.adminUsers({ page }), queryFn: () => adminApi.listUsers({ page }) });
}
export function useAdminStores(page: number) {
  return useQuery({ queryKey: qk.adminStores({ page }), queryFn: () => adminApi.listStores({ page }) });
}
export function useAdminOrders(page: number, status?: string) {
  return useQuery({
    queryKey: qk.adminOrders({ page, status }),
    queryFn: () => adminApi.listOrders({ page, status }),
  });
}
export function useAdminDeliveryJobs(page: number) {
  return useQuery({ queryKey: ["admin-delivery", page], queryFn: () => adminApi.listDeliveryJobs({ page }) });
}
export function useAdminVouchers(page: number) {
  return useQuery({ queryKey: qk.adminVouchers({ page }), queryFn: () => adminApi.listVouchers({ page }) });
}
export function useAdminPromos(page: number) {
  return useQuery({ queryKey: qk.adminPromos({ page }), queryFn: () => adminApi.listPromos({ page }) });
}
export function useAdminTime() {
  return useQuery({ queryKey: qk.adminTime, queryFn: adminApi.getTime });
}

export function useCreateVoucher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createVoucher,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-vouchers"] });
      toast.success("Voucher created");
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Could not create voucher"),
  });
}
export function useCreatePromo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createPromo,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-promos"] });
      toast.success("Promo created");
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Could not create promo"),
  });
}

export function useAdvanceDay() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.advanceDay,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.adminTime });
      qc.invalidateQueries({ queryKey: qk.adminDashboard });
      toast.success("Advanced one day — overdue check ran");
    },
  });
}
export function useResetTime() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.resetTime,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.adminTime });
      qc.invalidateQueries({ queryKey: qk.adminDashboard });
      toast.success("Time reset to real time");
    },
  });
}
