import Image from "next/image";
import Link from "next/link";
import homeStyles from "../page.module.css";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <div className={homeStyles.page}>
      <header className={homeStyles.header}>
        <Link href="/" className={homeStyles.logo}>
          Connect <span>&amp;</span> Thrive
        </Link>

        <nav className={homeStyles.nav} aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/activities">Explore Activities</Link>
          <Link href="/about" aria-current="page">
            About Us
          </Link>
          <Link href="/#join" className={homeStyles.navButton}>
            Join Us
          </Link>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <span className={styles.sectionLabel}>
                GET TO KNOW US
              </span>
              <h1>About Connect &amp; Thrive</h1>
              <p className={styles.tagline}>
                A place to connect. A community to belong.
              </p>
              <p className={styles.introDescription}>
                Building meaningful friendships through shared
                interests, wholesome activities, and positive
                experiences.
              </p>
            </div>

            <div className={styles.heroImage}>
              <Image
                src="/images/foodie-group.webp"
                alt="Friends enjoying a meal and conversation together"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.image}
              />
            </div>
          </div>
        </section>

        <section className={styles.aboutSection}>
          <div className={styles.content}>
            <span className={styles.sectionLabel}>
              WHAT WE BELIEVE
            </span>
            <h2>Our Mission</h2>

            <p>
              Connect &amp; Thrive is a faith-centered community
              platform helping young adults ages 20–35 meet new
              people, discover shared interests, and build lasting
              friendships.
            </p>

            <p>
              Inspired by the Christian values of The Church of
              Jesus Christ of Latter-day Saints, we encourage
              kindness, respect, integrity, service, and wholesome
              activities that bring people together.
            </p>

            <p>
              You do not need to be a member of any particular
              church to participate. We welcome young adults
              from different backgrounds who appreciate a
              positive, values-centered community.
            </p>

            <div className={styles.friendshipNote}>
              <h3>Friendship First</h3>
              <p>
                Connect &amp; Thrive is about friendship, not
                dating. Our goal is to help people develop
                genuine connections and a sense of belonging
                through shared experiences.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className={homeStyles.footer}>
        <h3>Connect &amp; Thrive</h3>
        <p>
          Building friendships. Creating connections.
          Strengthening communities.
        </p>
        <p className={homeStyles.copyright}>
          © 2026 Connect &amp; Thrive. Senior Project.
        </p>
      </footer>
    </div>
  );
}