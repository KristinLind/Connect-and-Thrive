import Image from "next/image";
import Link from "next/link";
import homeStyles from "../../page.module.css";
import styles from "./page.module.css";
import UpcomingEventsBanner from "@/components/UpcomingEventsBanner";

const games = [
  {
    title: "Board Game Nights",
    description:
      "Enjoy your favorite board games, share some snacks, and spend an evening laughing and making new friends.",
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
      "Gather around the fire for s'mores, good conversations, and a relaxing evening with friends.",
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

const placeholders = [
  "More Games Coming Soon",
  "More Social Activities Coming Soon",
  "More Friendship Events Coming Soon",
];

export default function GamesSocialNightsPage() {
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
              FRIENDSHIP • FUN • CONNECTION
            </span>

            <h1>Games & Social Nights</h1>

            <p>
              Meet new friends through games,
              recreation, and fun social gatherings.
              Whether you enjoy board games, sports,
              or relaxing evenings with friends,
              there&apos;s something for everyone.
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
              Discover fun ways to meet people,
              build friendships, and make memories.
            </p>
          </div>

          <div className={styles.grid}>
            {games.map((game) => (
              <article
                key={game.title}
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                    className={styles.cardImage}
                  />
                </div>

                <div className={styles.cardContent}>
                  <h2>{game.title}</h2>
                  <p>{game.description}</p>
                </div>
              </article>
            ))}

            {placeholders.map((title) => (
              <article
                key={title}
                className={`${styles.card} ${styles.placeholderCard}`}
              >
                <div className={styles.placeholderImage}>
                  <span aria-hidden="true">+</span>
                </div>

                <div className={styles.cardContent}>
                  <h2>{title}</h2>
                  <p>
                    Another opportunity to connect,
                    have fun, and build friendships
                    will be added soon.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <UpcomingEventsBanner
        description="Discover game nights, social gatherings, and opportunities to make new friends."
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
