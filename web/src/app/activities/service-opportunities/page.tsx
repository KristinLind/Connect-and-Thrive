import Image from "next/image";
import Link from "next/link";
import homeStyles from "../../page.module.css";
import styles from "./page.module.css";
import UpcomingEventsBanner from "@/components/UpcomingEventsBanner";

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
  {
    title: "Animal Shelter Volunteering",
    description:
      "Help care for shelter animals, support adoption efforts, and make a difference for pets in need.",
    image: "/images/service-animal-shelter.webp",
  },
  {
    title: "Community Meal Preparation",
    description:
      "Work with other volunteers to prepare meals and provide support for individuals and families.",
    image: "/images/service-meal-prep.webp",
  },
  {
    title: "Senior Center Volunteering",
    description:
      "Brighten someone's day through visits, activities, and meaningful conversations with older adults.",
    image: "/images/service-senior-center.webp",
  },
];

export default function ServiceOpportunitiesPage() {
  return (
    <div className={homeStyles.page}>
      <header className={homeStyles.header}>
        <Link href="/" className={homeStyles.logo}>
          Connect <span>&</span> Thrive
        </Link>

        <nav
          className={homeStyles.nav}
          aria-label="Main navigation"
        >
          <Link href="/">Home</Link>
          <Link href="/activities">
            Explore Activities
          </Link>
          <Link href="/#about">About Us</Link>
          <Link
            href="/#join"
            className={homeStyles.navButton}
          >
            Join Us
          </Link>
        </nav>
      </header>

      <main className={styles.page}>
        <section className={styles.titleBanner}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>
              SERVICE • KINDNESS • CONNECTION
            </span>

            <h1>Service Opportunities</h1>

            <p>
              Make a difference while building friendships
              and strengthening your community. Discover
              meaningful ways to serve others and connect
              with people who care.
            </p>

            <Link
              href="/activities"
              className={styles.backLink}
            >
              ← Back to Explore Activities
            </Link>
          </div>
        </section>

        <section className={styles.main}>
          <div className={styles.sectionHeading}>
            <h2>Ways to Serve</h2>
            <p>
              Explore service opportunities,
              meet new people, and make a positive
              difference in your community.
            </p>
          </div>

          <div className={styles.grid}>
            {services.map((service) => (
              <article
                key={service.title}
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                    className={styles.cardImage}
                  />
                </div>

                <div className={styles.cardContent}>
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <UpcomingEventsBanner
          description="Discover opportunities to serve your community and meet new friends."
        />
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