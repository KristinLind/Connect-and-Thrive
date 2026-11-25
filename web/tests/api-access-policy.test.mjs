import assert from "node:assert/strict";
import test from "node:test";
import {
    canManageOwnedResource,
    getApiAccessFailure,
} from "../src/lib/auth/api-access-policy.ts";

test("API authorization distinguishes signed-out, pending, and blocked accounts", () => {
    assert.deepEqual(getApiAccessFailure({ signedIn: false }), { status: 401, error: "Sign in required." });
    assert.deepEqual(getApiAccessFailure({ signedIn: true, status: null }), { status: 403, error: "Account approval is pending." });
    assert.equal(getApiAccessFailure({ signedIn: true, status: "PENDING" })?.status, 403);
    assert.equal(getApiAccessFailure({ signedIn: true, status: "BLOCKED" })?.error, "Account access is blocked.");
});

test("only approved admins can use admin APIs", () => {
    assert.equal(getApiAccessFailure({ signedIn: true, status: "APPROVED", requireAdmin: true, isAdmin: false })?.status, 403);
    assert.equal(getApiAccessFailure({ signedIn: true, status: "APPROVED", requireAdmin: true, isAdmin: true }), null);
    assert.equal(getApiAccessFailure({ signedIn: true, status: "PENDING", requireAdmin: true, isAdmin: true })?.status, 403);
});

test("owners and admins can manage activities, but members cannot edit another member's", () => {
    assert.equal(canManageOwnedResource("member-a", "member-a", false), true);
    assert.equal(canManageOwnedResource("member-a", "member-b", false), false);
    assert.equal(canManageOwnedResource("member-a", "admin", true), true);
});
