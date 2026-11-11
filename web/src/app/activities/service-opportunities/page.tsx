import Image from "next/image";
import Link from "next/link";
import homeStyles from "../../page.module.css";
import styles from "./page.module.css";

const services = [
  {
    title: "Service Projects & Care Kits",
    description:
      "Come together to assemble care kits, organize donations, and help individuals and families in need.",
    image: "/images/service-kits.webp",
  },
  {
    title: "Community Cleanup Projects",
    description:
      "Help beautify South Jordan through neighborhood cleanups, park projects, and community service.",
    image: "/images/community-cleanup.webp",
  },
  {
    title: "Food Drives & Donations",
    description:
      "Collect, sort, and organize food donations to support families and local organizations.",
    image: "/images/food-drive.webp",
  },
  {
    title: "Helping Neighbors",
    description:
      "Make a difference by helping neighbors with yard work, seasonal projects, and everyday needs.",
    image: "/images/helping-neighbors.webp",
  },
  {
    title: "Blankets & Handmade Donations",
    description:
      "Create blankets, cards, and thoughtful handmade gifts to bring comfort and encouragement to others.",
    image: "/images/making-blankets.webp",
  },
  {
    title: "Community Gardens & Outdoor Service",
    description:
      "Build friendships while planting, gardening, and working together on meaningful outdoor projects.",
    image: "/images/community-garden.webp",
  },
];

export default function ServiceOpportunitiesPage() {
  return (
    <div className={homeStyles.page}>
      <header className={homeStyles.header}>
        <Link href="/" className={homeStyles.logo}>
          Connect <span>&</span> Thrive
        </Link>

        <nav className={homeStyles.nav} aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/activities">Explore Activities</Link>
          <Link href="/#about">About Us</Link>
          <Link href="/#join" className={homeStyles.navButton}>
            Join Us
          </Link>
        </nav>
      </header>

      <main>
        <section className={styles.intro}>
          <span className={homeStyles.sectionLabel}>
            SERVICE • KINDNESS • CONNECTION
          </span>
          <h1>Service Opportunities</h1>
          <p>
            Make a difference while building friendships
            and strengthening your community. Discover
            meaningful ways to serve others and connect
            with people who care.
          </p>
        </section>

        <section className={homeStyles.activities}>
          <div className={homeStyles.sectionHeading}>
            <h2>Ways to Serve</h2>
            <p>
              Explore service opportunities,
              meet new people, and make a positive
              difference in your community.
            </p>
          </div>

          <div className={homeStyles.activityGrid}>
            {services.map((service) => (
              <article
                key={service.title}
                className={homeStyles.activityCard}
              >
                <div className={homeStyles.activityImage}>
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
                  />
                </div>

                <div className={homeStyles.activityContent}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.eventsSection}>
          <div className={homeStyles.sectionHeading}>
            <h2>Upcoming Events</h2>
            <p>
              Discover opportunities to serve
              your community and meet new friends.
            </p>
          </div>

          <div className={styles.eventsPlaceholder}>
            <span className={styles.calendarIcon} aria-hidden="true">
              📅
            </span>
            <h3>No upcoming events yet</h3>
            <p>
              Service events created by community
              members will appear here.
            </p>
          </div>
        </section>

        <div className={styles.backLink}>
          <Link href="/activities">
            ← Back to Explore Activities
          </Link>
        </div>
      </main>

      <footer className={homeStyles.footer}>
        <h3>Connect & Thrive</h3>
        <p>
          Building friendships. Creating connections.
          Strengthening communities.
        </p>
        <p className={homeStyles.copyright}>
          © 2026 Connect & Thrive. Senior Project.
        </p>
      </footer>
    </div>
  );
}