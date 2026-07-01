import Image from "next/image";
import { HOME_IMAGE_ALT, HOME_IMAGE_PATH } from "../constants";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <Image
        src={HOME_IMAGE_PATH}
        alt={HOME_IMAGE_ALT}
        width={99}
        height={97}
        priority
      />
    </main>
  );
}
