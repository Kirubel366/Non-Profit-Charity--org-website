import test from "node:test";
import assert from "node:assert/strict";

import { getDonationNotificationCount } from "./donationCounts.ts";

test("counts both material pledges and transfer proofs together", () => {
  assert.equal(getDonationNotificationCount(4, 3), 7);
  assert.equal(getDonationNotificationCount(0, 0), 0);
});
