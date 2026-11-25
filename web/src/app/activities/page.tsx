import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const categories = [
  {
    title: "Outdoor Adventures",
    description: "Explore new places and make lasting memories.",
    image: "/images/rafting.webp",
    href: "/activities/outdoor-adventures",
  },
  {
    title: "Sports & Recreation",
    description: "Stay active, have fun, and meet new friends.",
    image: "/images/beach volleyball.webp",
    href: "/activities/sports-recreation",
  },
  {
    title: "Cooking Together",
    description: "Share recipes, laughter, and delicious food.",
    image: "/images/cooking dumplings.webp",
    href: "/activities/cooking-together",
  },
  {
    title: "Games & Social Nights",
    description: "Enjoy friendly competition and great company.",
    image: "/images/billiards.webp",
    href: "/activities/games-social-nights",
  },
  {
    title: "Service Opportunities",
    description: "Make a difference while connecting with others.",
    image: "/images/service meal.webp",
    href: "/activities/service-opportunities",
  },
  {
    title: "Learning & Friendship",
    description: "Discover shared interests and grow together.",
    image: "/images/book group.webp",
    href: "/activities/learning-friendship",
  },
];

export default function ExploreActivities() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.heading}>
          <span className={styles.sectionLabel}>DISCOVER SOMETHING NEW</span>
          <h1>Find Activities You’ll Love</h1>
          <p>
            Explore your interests, try something new, and connect with people
            who enjoy the same things.
          </p>
        </div>

        <div className={styles.grid}>
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
                />
              </div>
              <div className={styles.content}>
                <h2>{category.title}</h2>
                <p>{category.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <section className={styles.localEvents}>
          <div className={styles.heading}>
            <span className={styles.sectionLabel}>NEAR YOU</span>
            <h2>Local Events in South Jordan</h2>
            <p>
              Discover upcoming activities and gatherings happening in the South Jordan area.
            </p>
          </div>

          <div className={styles.grid}>
            <article className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src="/images/community-cleanup.webp"
                  alt="Community cleanup"
                  fill
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
              </div>
              <div className={styles.content}>
                <h2>South Jordan Community Cleanup</h2>
                <p>Join neighbors for a morning of service and connection.</p>
              </div>
            </article>

            <article className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src="/images/pickleball.webp"
                  alt="Pickleball"
                  fill
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
              </div>
              <div className={styles.content}>
                <h2>Pickleball at Oquirrh Lake</h2>
                <p>Casual games and new friends every weekend.</p>
              </div>
            </article>

            <article className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src="/images/bonfire.webp"
                  alt="Bonfire"
                  fill
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
              </div>
              <div className={styles.content}>
                <h2>Evening Bonfire & S’mores</h2>
                <p>Relax, share stories, and meet people in the area.</p>
              </div>
            </article>
          </div>
        </section>
      </main>

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
