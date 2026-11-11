import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import UpcomingEventsBanner from "@/components/UpcomingEventsBanner";

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
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          Connect <span>&</span> Thrive
        </Link>

        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/activities">Explore Activities</Link>
          <Link href="/#about">About Us</Link>
          <Link href="/#join" className={styles.navButton}>
            Join Us
          </Link>
        </nav>
      </header>

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
      </main>
    </div>
  );
}