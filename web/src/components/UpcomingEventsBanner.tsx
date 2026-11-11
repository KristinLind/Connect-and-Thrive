
import Link from "next/link";
import styles from "./UpcomingEventsBanner.module.css";

type UpcomingEventsBannerProps = {
    description?: string;
};

export default function UpcomingEventsBanner({
    description = "Discover upcoming activities and opportunities to connect with new friends.",
}: UpcomingEventsBannerProps) {
    return (
        <section
            className={styles.banner}
            aria-label="Upcoming events"
        >
            <span className={styles.icon} aria-hidden="true">
                📅
            </span>

            <div className={styles.content}>
                <h2>Upcoming Events</h2>
                <p>{description}</p>
                <p className={styles.notice}>
                    New events will appear here when
                    community members create them.
                </p>
            </div>

            <Link href="/events" className={styles.button}>
                View Events →
            </Link>
        </section>
    );
}
