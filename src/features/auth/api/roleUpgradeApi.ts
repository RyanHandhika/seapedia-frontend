// src/features/auth/api/roleUpgradeApi.ts
//
// Raw API calls for the role-upgrade flow. Kept separate from
// authApi.ts since these operate on an already-authenticated user
// (the JWT identifies WHO is upgrading — no userId in the payload).

import { api } from "@api/client";
import { ENDPOINTS } from "@api/endpoints";
import type {
  BecomeSellerPayload,
  BecomeDriverPayload,
  RoleUpgradeResponse,
} from "../types/auth.types";

export const roleUpgradeApi = {
  becomeSeller: (payload: BecomeSellerPayload) =>
    api
      .post<{
        data: RoleUpgradeResponse;
      }>(ENDPOINTS.ROLE_UPGRADE.BECOME_SELLER, payload)
      .then((r) => r.data.data),

  becomeDriver: (payload: BecomeDriverPayload) =>
    api
      .post<{
        data: RoleUpgradeResponse;
      }>(ENDPOINTS.ROLE_UPGRADE.BECOME_DRIVER, payload)
      .then((r) => r.data.data),
};
