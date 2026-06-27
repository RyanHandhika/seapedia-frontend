import { useState } from "react";
import { useSubmitReview } from "./reviewHooks";
import { StarInput } from "./StarRating";
import { Button, Modal, Textarea } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";

// The write-a-review modal. Submission is login-gated by design (anti-spam),
// so the reviewer name comes from the authenticated account, not a free field.
export function ReviewForm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const user = useAuthStore((s) => s.user);
  const submit = useSubmitReview();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setRating(0);
    setComment("");
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit() {
    if (!user) return;
    if (rating < 1) {
      setError("Please pick a star rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a short comment.");
      return;
    }
    setError(null);
    await submit.mutateAsync({
      reviewerName: user.username,
      rating,
      comment: comment.trim(),
    });
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Write a review"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={submit.isPending}>
            Submit review
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {user && (
          <p className="text-sm text-ink-500">
            Posting as{" "}
            <span className="font-medium text-ink-800">{user.username}</span>
          </p>
        )}
        <div className="flex flex-col items-center gap-2 rounded-xl bg-ink-50 py-4">
          <p className="text-sm font-medium text-ink-700">
            How would you rate the app?
          </p>
          <StarInput value={rating} onChange={setRating} />
        </div>
        <Textarea
          label="Your review"
          placeholder="Tell others what you think about SEAPEDIA…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {error && <p className="text-sm text-coral-600">{error}</p>}
      </div>
    </Modal>
  );
}
