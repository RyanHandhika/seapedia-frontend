import {
  useMutation, useQuery, useQueryClient,
} from "@tanstack/react-query";
import { driverApi } from "@/api/driver";
import { qk } from "@/lib/queryClient";
import { toast } from "@/stores/toastStore";
import { ApiException } from "@/api/client";

export function useAvailableJobs(page: number) {
  return useQuery({
    queryKey: qk.driverAvailable(page),
    queryFn: () => driverApi.listAvailable(page),
  });
}

export function useActiveJob() {
  return useQuery({
    queryKey: qk.driverActive,
    queryFn: driverApi.getActive,
    // The active job changes when the driver takes/completes — keep it fresh.
    refetchInterval: 15_000,
  });
}

export function useJobHistory(page: number) {
  return useQuery({
    queryKey: qk.driverHistory(page),
    queryFn: () => driverApi.getHistory(page),
  });
}

export function useDriverEarnings() {
  return useQuery({ queryKey: qk.driverEarnings, queryFn: driverApi.getEarnings });
}

export function useTakeJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => driverApi.takeJob(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["driver-available"] });
      qc.invalidateQueries({ queryKey: qk.driverActive });
      toast.success("Job accepted — head to pickup!");
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Could not take job"),
  });
}

export function useCompleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => driverApi.completeJob(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: qk.driverActive });
      qc.invalidateQueries({ queryKey: ["driver-history"] });
      qc.invalidateQueries({ queryKey: qk.driverEarnings });
      toast.success(`Delivery complete! You earned ${res.earning.toLocaleString("id-ID")} IDR`);
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Could not complete job"),
  });
}
