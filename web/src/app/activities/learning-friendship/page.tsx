import Image from "next/image";
import Link from "next/link";
import homeStyles from "../../page.module.css";
import styles from "./page.module.css";
import UpcomingEventsBanner from "@/components/UpcomingEventsBanner";

const activities = [
  {
    title: "Cooking & Baking Classes",
    description:
      "Learn new recipes, share favorite dishes, and build friendships while cooking and baking together.",
    image: "/images/cooking-class.webp",
  },
  {
    title: "Arts & Crafts Nights",
    description:
      "Get creative with painting, crafting, and hands-on projects. All experience levels are welcome!",
    image: "/images/arts-crafts.webp",
  },
  {
    title: "Book Clubs & Discussions",
    description:
      "Discover great books, share ideas, and enjoy thoughtful conversations with new friends.",
    image: "/images/book-club.webp",
  },
  {
    title: "Gospel Study & Discussions",
    description:
      "Connect through uplifting gospel discussions, scripture study, and meaningful conversations.",
    image: "/images/gospel-study.webp",
  },
  {
    title: "Life Skills Workshops",
    description:
      "Learn practical skills like budgeting, meal planning, and everyday problem-solving together.",
    image: "/images/life-skills.webp",
  },
  {
    title: "Music & Talent Nights",
    description:
      "Share your talents, enjoy music, and discover new interests in a welcoming environment.",
    image: "/images/music-night.webp",
  },
];

const placeholders = [
  "More Learning Activities Coming Soon",
  "More Creative Activities Coming Soon",
  "More Friendship Activities Coming Soon",
];

export default function LearningFriendshipPage() {
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
              LEARNING • FRIENDSHIP • GROWTH
            </span>

            <h1>Learning & Friendship</h1>

            <p>
              Learn something new, share your talents,
              and build lasting friendships. Discover
              activities that bring people together
              through learning and shared interests.
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
            <h2>Activities to Explore</h2>
            <p>
              Discover new interests, develop skills,
              and build friendships through shared experiences.
            </p>
          </div>

          <div className={styles.grid}>
            {activities.map((activity) => (
              <article
                key={activity.title}
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                    className={styles.cardImage}
                  />
                </div>

                <div className={styles.cardContent}>
                  <h2>{activity.title}</h2>
                  <p>{activity.description}</p>
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
                    Another opportunity to learn,
                    share interests, and build
                    friendships will be added soon.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <UpcomingEventsBanner
          description="Find opportunities to learn new skills, share interests, and build friendships."
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

