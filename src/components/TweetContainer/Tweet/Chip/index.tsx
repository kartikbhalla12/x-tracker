import { FC } from "react";

import styles from "@/components/TweetContainer/Tweet/Chip/index.module.css";

interface ChipProps {
  label: string;
}

const Chip: FC<ChipProps> = ({ label }) => {
  return <div className={styles.chip}>{label}</div>;
};

export default Chip;
