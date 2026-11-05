
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const activities = [
  {
    title: "Outdoor Adventures",
    description: "Explore new places and make lasting memories.",
    image: "/images/rafting.webp",
  },
  {
    title: "Sports & Recreation",
    description: "Stay active, have fun, and meet new friends.",
    image: "/images/beach volleyball.webp",
  },
  {
    title: "Cooking Together",
    description: "Share recipes, laughter, and delicious food.",
    image: "/images/cooking dumplings.webp",
  },
  {
    title: "Games & Social Nights",
    description: "Enjoy friendly competition and great company.",
    image: "/images/billiards.webp",
  },
  {
    title: "Service Opportunities",
    description: "Make a difference while connecting with others.",
    image: "/images/service meal.webp",
  },
  {
    title: "Learning & Friendship",
    description: "Discover shared interests and grow together.",
    image: "/images/book group.webp",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Navigation */}
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          Connect <span>&</span> Thrive
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/">Home</Link>
          <a href="#activities">Explore Activities</a>
          <a href="#about">About Us</a>
          <a href="#join" className={styles.navButton}>
            Join Us
          </a>
        </nav>
      </header>

      <main>
        {/* Hero section */}
        <section className={styles.hero}>
          <Image
            src="/images/dancing on beach.webp"
            alt="Friends enjoying time together at the beach"
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />

          <div className={styles.heroOverlay} />

          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>
              FRIENDSHIP • COMMUNITY • ADVENTURE
            </span>

            <h1>Find Your People. Thrive Together.</h1>

            <p>
              Discover meaningful friendships through exciting activities,
              shared interests, and opportunities to make a difference.
            </p>

            <a href="#activities" className={styles.primaryButton}>
              Explore Activities
            </a>
          </div>
        </section>

        {/* Welcome section */}
        <section id="about" className={styles.welcome}>
          <span className={styles.sectionLabel}>
            WELCOME TO CONNECT & THRIVE
          </span>

          <h2>More Than Activities. A Place to Belong.</h2>

          <p>
            Connect & Thrive is a faith-centered community where young adults
            ages 20-35 can build lasting friendships through wholesome
            activities and shared experiences. Join an activity, organize your
            own gathering, or discover new adventures with people who share
            your interests and values.
          </p>
        </section>

        {/* Activities section */}
        <section id="activities" className={styles.activities}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>
              DISCOVER SOMETHING NEW
            </span>

            <h2>Find Activities You&apos;ll Love</h2>

            <p>
              Explore your interests, try something new, and connect with
              people who enjoy the same things.
            </p>
          </div>

          <div className={styles.activityGrid}>
            {activities.map((activity) => (
              <article
                key={activity.title}
                className={styles.activityCard}
              >
                <div className={styles.activityImage}>
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
                  />
                </div>

                <div className={styles.activityContent}>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Join section */}
        <section id="join" className={styles.join}>
          <h2>Your Next Great Friendship Starts Here.</h2>

          <p>
            New experiences, meaningful connections, and a welcoming
            community are waiting for you.
          </p>

          <a href="#activities" className={styles.joinButton}>
            Discover Your Community
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <h3>Connect & Thrive</h3>

        <p>
          Building friendships. Creating connections. Strengthening
          communities.
        </p>

        <p className={styles.copyright}>
          © 2026 Connect & Thrive. Senior Project.
        </p>
      </footer>
    </div>
  );
}
