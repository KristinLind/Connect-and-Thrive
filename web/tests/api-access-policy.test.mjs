import assert from "node:assert/strict";
import test from "node:test";
import {
    canAccessProfile,
    canManageOwnedResource,
    getStatusForAdminAction,
    getApiAccessFailure,
    getPostLoginDestination,
    isBootstrapAdmin,
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

test("registration bootstraps only verified addresses on the admin allowlist", () => {
    assert.equal(isBootstrapAdmin("  ESSODONG@example.com ", true, "admin@example.com, essodong@example.com"), true);
    assert.equal(isBootstrapAdmin("essodong@example.com", false, "essodong@example.com"), false);
    assert.equal(isBootstrapAdmin("other@example.com", true, "essodong@example.com"), false);
    assert.equal(isBootstrapAdmin("essodong@example.com", true, ""), false);
});

test("admin approval actions persist the intended access status", () => {
    assert.equal(getStatusForAdminAction("approve"), "APPROVED");
    assert.equal(getStatusForAdminAction("block"), "BLOCKED");
    assert.equal(getStatusForAdminAction("unblock"), "APPROVED");
});

test("pending members can finish their profile, while blocked or missing accounts cannot", () => {
    assert.equal(canAccessProfile("PENDING"), true);
    assert.equal(canAccessProfile("APPROVED"), true);
    assert.equal(canAccessProfile("BLOCKED"), false);
    assert.equal(canAccessProfile(null), false);
});

test("login sends each account state to the correct next screen", () => {
    assert.equal(getPostLoginDestination({ status: "BLOCKED", isAdmin: false, hasProfile: true }), "/blocked");
    assert.equal(getPostLoginDestination({ status: "PENDING", isAdmin: false, hasProfile: false }), "/register");
    assert.equal(getPostLoginDestination({ status: "PENDING", isAdmin: false, hasProfile: true }), "/pending-approval");
    assert.equal(getPostLoginDestination({ status: "APPROVED", isAdmin: true, hasProfile: false }), "/admin/review");
    assert.equal(getPostLoginDestination({ status: "APPROVED", isAdmin: false, hasProfile: false }), "/");
});

test("owners and admins can manage activities, but members cannot edit another member's", () => {
    assert.equal(canManageOwnedResource("member-a", "member-a", false), true);
    assert.equal(canManageOwnedResource("member-a", "member-b", false), false);
    assert.equal(canManageOwnedResource("member-a", "admin", true), true);
});
