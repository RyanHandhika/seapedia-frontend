import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  becomeDriverSchema,
  type BecomeDriverFormValues,
} from "../types/upgrade.schemas.js";
import { useBecomeDriver } from "../hooks/useBecomeDriver.js";
import { Input } from "@components/ui/Input/Input";
import { Select } from "@components/ui/Input/Input";
import { Button } from "@components/ui/Button/Button";
import { Alert } from "@components/ui/Alert/Alert";

interface BecomeDriverFormProps {
  onCancel: () => void;
}

export function BecomeDriverForm({ onCancel }: BecomeDriverFormProps) {
  const becomeDriver = useBecomeDriver();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BecomeDriverFormValues>({
    resolver: zodResolver(becomeDriverSchema),
  });

  const onSubmit = (data: BecomeDriverFormValues) => becomeDriver.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {becomeDriver.isError && (
        <Alert type="error">
          {becomeDriver.error instanceof Error
            ? becomeDriver.error.message
            : "Gagal mendaftar sebagai pengirim."}
        </Alert>
      )}

      <Select
        label="Jenis Kendaraan"
        placeholder="Pilih jenis kendaraan"
        error={errors.vehicleType?.message}
        required
        {...register("vehicleType")}
      >
        <option value="MOTOR">Motor</option>
        <option value="MOBIL">Mobil</option>
      </Select>

      <Input
        label="Nomor SIM"
        placeholder="contoh: 1234567890123456"
        error={errors.licenseNumber?.message}
        required
        {...register("licenseNumber")}
      />

      <Input
        label="Nomor HP Aktif"
        type="tel"
        placeholder="081234567890"
        error={errors.phoneNumber?.message}
        hint="Akan dipakai pembeli/penjual untuk menghubungi kamu saat pengiriman."
        required
        {...register("phoneNumber")}
      />

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          fullWidth
          onClick={onCancel}
          disabled={becomeDriver.isPending}
        >
          Batal
        </Button>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={becomeDriver.isPending}
        >
          Daftar Sebagai Pengirim
        </Button>
      </div>
    </form>
  );
}
