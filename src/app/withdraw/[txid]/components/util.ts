export enum WithdrawalStatus {
  pending = "pending",
  // Remapping reprocessing to pending to keep things simple
  reprocessing = "pending",
  accepted = "accepted",
  confirmed = "confirmed",
  failed = "failed",
}
