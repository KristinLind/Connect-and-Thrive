import Image from "next/image";
import Link from "next/link";
import homeStyles from "../../page.module.css";
import styles from "./page.module.css";

const games = [
  {
    title: "Board Game Nights",
    description:
      "Enjoy your favorite board game, enjoy some snacks, and spend an evening laughing and making new friends.",
    image: "/images/boardgames.jpg",
  },
  {
    title: "Volleyball & Pickleball Nights",
    description:
      "Enjoy friendly games, meet new people, and have fun together. All skill levels are welcome!",
    image: "/images/pickleball.webp",
  },
  {
    title: "Bonfire & S'mores",
    description:
      "Gather around the fire for s'mores, good conversations and a relaxing evening with friends.",
    image: "/images/bonfire.webp",
  },
  {
    title: "Potlucks & Dessert Nights",
    description:
      "Bring something to share and enjoy delicious food, fun conversations, and new friendships.",
    image: "/images/potluck.webp",
  },
  {
    title: "Outdoor Games & Park Nights",
    description:
      "Get together for spikeball, ultimate frisbee, lawn games, and a fun evening outdoors.",
    image: "/images/group soccer.webp",
  },
  {
    title: "Movie & Popcorn Nights",
    description:
      "Grab some popcorn, watch a favorite movie, and enjoy a relaxing night with friends.",
    image: "/images/popcorn.webp",
  },
];

export default function GamesSocialNightsPage() {
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
            FRIENDSHIP • FUN • CONNECTION
          </span>
          <h1>Games & Social Nights</h1>
          <p>
            Meet new friends through games, recreation,
            and fun social gatherings. Whether you enjoy
            board games, sports, or relaxing evenings with
            friends, there's something for everyone.
          </p>
        </section>

        <section className={homeStyles.activities}>
          <div className={homeStyles.sectionHeading}>
            <h2>Activities to Explore</h2>
            <p>
              Discover fun ways to meet people,
              build friendships, and make memories.
            </p>
          </div>

          <div className={homeStyles.activityGrid}>
            {games.map((game) => (
              <article
                key={game.title}
                className={homeStyles.activityCard}
              >
                <div className={homeStyles.activityImage}>
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
                  />
                </div>

                <div className={homeStyles.activityContent}>
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.eventsSection}>
          <div className={homeStyles.sectionHeading}>
            <h2>Upcoming Events</h2>
            <p>
              Find opportunities to connect with others
              through games and social activities.
            </p>
          </div>

          <div className={styles.eventsPlaceholder}>
            <span className={styles.calendarIcon} aria-hidden="true">
              📅
            </span>
            <h3>No upcoming events yet</h3>
            <p>
              Events created by community members
              will appear here.
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