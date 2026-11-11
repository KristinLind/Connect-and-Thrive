import Link from "next/link";
import styles from "./page.module.css";

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
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>
            GET ACTIVE TOGETHER
          </span>

          <h1>Sports &amp; Recreation</h1>

          <p>
            Stay active, have fun, and build friendships through
            sports, teamwork, and shared experiences.
          </p>

          <Link href="/activities" className={styles.backLink}>
            ← Back to all activities
          </Link>
        </div>

        <div className={styles.grid}>
          {sports.map((sport) => (
            <article key={sport.title} className={styles.card}>
              <img
                src={sport.image}
                alt={sport.title}
                className={styles.cardImage}
              />

              <div className={styles.cardContent}>
                <h2>{sport.title}</h2>
                <p>{sport.description}</p>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
