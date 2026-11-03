import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Connect & Thrive</h1>

          <p>
            Building friendships, creating connections,
            and strengthening communities.
          </p>

          <p>
            Welcome to Connect & Thrive! Our mission
            is to help young adults ages 20-35 discover
            meaningful friendships through wholesome
            activities, service opportunities, and
            community events.
          </p>

          <h2>Find Your Community</h2>

          <p>
            Explore local activities, meet new friends,
            and create experiences that help everyone
            feel a sense of belonging.
          </p>
        </div>
      </main>
    </div>
  );
}
