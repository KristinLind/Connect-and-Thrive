import Image from "next/image";
import Link from "next/link";
import homeStyles from "../../page.module.css";
import styles from "./page.module.css";
import UpcomingEventsBanner from "@/components/UpcomingEventsBanner";

const sports = [
  {
    title: "Basketball",
    description:
      "Get together for a friendly game of basketball, practice your skills, and enjoy some healthy competition.",
    image: "/images/basketball.webp",
  },
  {
    title: "Beach Volleyball",
    description:
      "Enjoy sunshine, teamwork, and friendly competition with a fun game of volleyball.",
    image: "/images/beach volleyball.webp",
  },
  {
    title: "Soccer",
    description:
      "Gather friends for an exciting soccer game, build teamwork, and stay active together.",
    image: "/images/group soccer.webp",
  },
  {
    title: "Cycling",
    description:
      "Explore scenic trails, enjoy fresh air, and discover new places while cycling with friends.",
    image: "/images/cycling.webp",
  },
  {
    title: "Football",
    description:
      "Organize a friendly football game and enjoy teamwork, laughter, and outdoor recreation.",
    image: "/images/football-game.webp",
  },
  {
    title: "Dancing",
    description:
      "Learn new dance moves, enjoy great music, and make lasting friendships through dancing.",
    image: "/images/dancing on beach.webp",
  },
  {
    title: "Mountain Climbing",
    description:
      "Challenge yourself, enjoy breathtaking mountain views, and encourage one another while reaching new heights.",
    image: "/images/mountain-climbing.webp",
  },
  {
    title: "Arch Hiking",
    description:
      "Explore beautiful trails and natural rock formations while enjoying an unforgettable hike with friends.",
    image: "/images/Arch hike.webp",
  },
  {
    title: "Cross-Country Skiing",
    description:
      "Enjoy snowy trails, fresh mountain air, and a fun winter workout while exploring the outdoors with friends.",
    image: "/images/cross-country-skiing.webp",
  },
];

export default function SportsRecreation() {
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
              GET ACTIVE TOGETHER
            </span>

            <h1>Sports &amp; Recreation</h1>

            <p>
              Stay active, have fun, and build friendships
              through sports, teamwork, and shared experiences.
            </p>

            <Link
              href="/activities"
              className={styles.backLink}
            >
              ← Back to all activities
            </Link>
          </div>
        </section>

        <section className={styles.main}>
          <div className={styles.sectionHeading}>
            <h2>Activities to Explore</h2>
            <p>
              Discover exciting ways to stay active,
              enjoy friendly competition, and build
              lasting friendships.
            </p>
          </div>

          <div className={styles.grid}>
            {sports.map((sport) => (
              <article
                key={sport.title}
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={sport.image}
                    alt={sport.title}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                    className={styles.cardImage}
                  />
                </div>

                <div className={styles.cardContent}>
                  <h2>{sport.title}</h2>
                  <p>{sport.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <UpcomingEventsBanner
          description="Find upcoming sports, recreation, and group activities for all skill levels."
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

