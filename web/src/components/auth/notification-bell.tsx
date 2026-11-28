"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/components/site-header.module.css";

type NotificationCounts = {
    isAdmin: boolean;
    pendingRequestCount: number;
    unreadMessageCount: number;
    registeredActivityCount: number;
    pendingMemberApprovalCount: number;
    pendingGroupApprovalCount: number;
    unreadGroupReviewCount: number;
    totalNotificationCount: number;
};

const emptyCounts: NotificationCounts = {
    isAdmin: false,
    pendingRequestCount: 0,
    unreadMessageCount: 0,
    registeredActivityCount: 0,
    pendingMemberApprovalCount: 0,
    pendingGroupApprovalCount: 0,
    unreadGroupReviewCount: 0,
    totalNotificationCount: 0,
};

export default function NotificationBell() {
    const [counts, setCounts] =
        useState<NotificationCounts>(emptyCounts);

    useEffect(() => {
        let active = true;
        let loading = false;
        const controller = new AbortController();

        async function loadNotifications() {
            if (!active || loading) return;

            loading = true;

            try {
                const response = await fetch("/api/notifications", {
                    cache: "no-store",
                    signal: controller.signal,
                });

                if (response.status === 401 || response.status === 403) {
                    if (active) {
                        setCounts(emptyCounts);
                    }
                    return;
                }

                if (!response.ok) return;

                const contentType =
                    response.headers.get("content-type") || "";

                if (!contentType.includes("application/json")) return;

                const data: NotificationCounts = await response.json();

                if (active) {
                    setCounts(data);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error(
                        "Unable to refresh notifications:",
                        error
                    );
                }
            } finally {
                loading = false;
            }
        }

        function handleVisibilityChange() {
            if (document.visibilityState === "visible") {
                void loadNotifications();
            }
        }

        void loadNotifications();

        const interval = window.setInterval(() => {
            if (document.visibilityState === "visible") {
                void loadNotifications();
            }
        }, 5000);

        window.addEventListener("focus", loadNotifications);

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        return () => {
            active = false;
            controller.abort();
            window.clearInterval(interval);

            window.removeEventListener(
                "focus",
                loadNotifications
            );

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, []);

    const {
        isAdmin,
        pendingRequestCount,
        unreadMessageCount,
        registeredActivityCount,
        pendingMemberApprovalCount,
        pendingGroupApprovalCount,
        unreadGroupReviewCount,
        totalNotificationCount,
    } = counts;

    const hasNotifications = totalNotificationCount > 0;

    const activeLinkStyle = {
        backgroundColor: "#fff0ed",
        color: "#b94437",
        fontWeight: 700,
        borderRadius: "8px",
    };

    return (
        <details className={styles.notificationMenu}>
            <summary
                className={`${styles.notificationButton}${hasNotifications
                    ? ` ${styles.notificationButtonActive}`
                    : ""
                    }`}
                aria-label={
                    hasNotifications
                        ? `Notifications: ${totalNotificationCount} items requiring attention`
                        : "Open member notifications"
                }
                title={
                    hasNotifications
                        ? "You have notifications requiring attention"
                        : "Notifications"
                }
            >
                <svg
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M10 21h4" />
                </svg>
            </summary>

            <div className={styles.notificationDropdown}>
                <h3 className={styles.notificationHeading}>
                    Notifications
                </h3>

                {isAdmin && (
                    <>
                        <Link
                            href="/admin/review#member-approvals"
                            style={
                                pendingMemberApprovalCount > 0
                                    ? activeLinkStyle
                                    : undefined
                            }
                        >
                            Member Approval Requests
                            {pendingMemberApprovalCount > 0 &&
                                ` (${pendingMemberApprovalCount} new)`}
                        </Link>

                        <Link
                            href="/admin/review#group-approvals"
                            style={
                                pendingGroupApprovalCount > 0
                                    ? activeLinkStyle
                                    : undefined
                            }
                        >
                            Group Approval Requests
                            {pendingGroupApprovalCount > 0 &&
                                ` (${pendingGroupApprovalCount} new)`}
                        </Link>

                        <div
                            aria-hidden="true"
                            style={{
                                borderTop: "1px solid #dbe5e7",
                                margin: "8px 0",
                            }}
                        />
                    </>
                )}

                <Link
                    href="/connections"
                    style={
                        pendingRequestCount > 0
                            ? activeLinkStyle
                            : undefined
                    }
                >
                    Connection Requests
                    {pendingRequestCount > 0 &&
                        ` (${pendingRequestCount} new)`}
                </Link>

                <Link
                    href="/connections"
                    style={
                        unreadMessageCount > 0
                            ? activeLinkStyle
                            : undefined
                    }
                >
                    Unread Messages
                    {unreadMessageCount > 0 &&
                        ` (${unreadMessageCount} new)`}
                </Link>

                <Link href="/connections">
                    My Connections
                </Link>

                <Link href="/saved-activities">
                    Saved Activities
                </Link>

                <Link
                    href="/my-groups#created-groups"
                    style={
                        unreadGroupReviewCount > 0
                            ? activeLinkStyle
                            : undefined
                    }
                >
                    Group Approval Updates
                    {unreadGroupReviewCount > 0 &&
                        ` (${unreadGroupReviewCount} new)`}
                </Link>

                <Link href="/my-groups">
                    My Groups
                </Link>

                <Link href="/my-groups#create-group">
                    Create a Group
                </Link>

                <Link
                    href="/registered-activities"
                    style={
                        registeredActivityCount > 0
                            ? activeLinkStyle
                            : undefined
                    }
                >
                    Registered Activities
                    {registeredActivityCount > 0 &&
                        ` (${registeredActivityCount})`}
                </Link>
            </div>
        </details>
    );
}
