import Link from "next/link";
import styles from "./UpcomingEventsBanner.module.css";

type UpcomingEventsBannerProps = {
    description?: string;
};

export default function UpcomingEventsBanner({
    description = "Discover upcoming activities, meet new friends, and participate in events created by our community.",
}: UpcomingEventsBannerProps) {
    return (
        <section
            className={styles.banner}
            aria-label="Upcoming community events"
        >
            <span className={styles.icon} aria-hidden="true">
                <svg
                    width="38"
                    height="38"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect
                        x="3"
                        y="5"
                        width="18"
                        height="16"
                        rx="2"
                    />
                    <path d="M16 3v4M8 3v4M3 10h18" />
                    <path d="M8 14h2M14 14h2M8 17h2M14 17h2" />
                </svg>
            </span>

            <div className={styles.content}>
                <h2>Upcoming Community Events</h2>

                <p>{description}</p>

                <p className={styles.notice}>
                    Have an activity in mind? Create your own
                    event and invite others to join you!
                </p>
            </div>

            <Link
                href="/activities/events"
                className={styles.button}
            >
                View Events →
            </Link>
        </section>
    );
}
