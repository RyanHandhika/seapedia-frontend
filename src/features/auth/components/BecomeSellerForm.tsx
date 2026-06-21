import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  becomeSellerSchema,
  type BecomeSellerFormValues,
} from "../types/upgrade.schemas";
import { useBecomeSeller } from "../hooks/useBecomeSeller";
import { Input } from "@components/ui/Input/Input";
import { Button } from "@components/ui/Button/Button";
import { Alert } from "@components/ui/Alert/Alert";

interface BecomeSellerFormProps {
  onCancel: () => void;
}

export function BecomeSellerForm({ onCancel }: BecomeSellerFormProps) {
  const becomeSeller = useBecomeSeller();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BecomeSellerFormValues>({
    resolver: zodResolver(becomeSellerSchema),
  });

  const onSubmit = (data: BecomeSellerFormValues) => becomeSeller.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {becomeSeller.isError && (
        <Alert type="error">
          {/* Most commonly: store name already taken — server enforces uniqueness */}
          {becomeSeller.error instanceof Error
            ? becomeSeller.error.message
            : "Gagal membuat toko."}
        </Alert>
      )}

      <Input
        label="Nama Toko"
        placeholder="contoh: Toko Elektronik Maju"
        error={errors.storeName?.message}
        hint="Nama toko akan tampil di setiap produk yang kamu jual. Pastikan unik dan mudah diingat."
        required
        autoFocus
        {...register("storeName")}
      />

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          fullWidth
          onClick={onCancel}
          disabled={becomeSeller.isPending}
        >
          Batal
        </Button>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={becomeSeller.isPending}
        >
          Buat Toko
        </Button>
      </div>
    </form>
  );
}
