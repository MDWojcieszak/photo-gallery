import { motion } from 'framer-motion';
import { mkUseStyles } from '~/utils/theme';

const splitStringUsingRegex = (inputString: string): string[] => {
  const characters: string[] = [];
  const regex = /[\s\S]/gu;

  let match;
  while ((match = regex.exec(inputString)) !== null) {
    characters.push(match[0]);
  }

  return characters;
};

type AnimatedTextProps = {
  text: string;
  delay: number;
};

export const AnimatedText = ({ text, delay }: AnimatedTextProps) => {
  const characters = splitStringUsingRegex(text);
  const styles = useStyles();
  const charVariants = {
    hidden: { opacity: 0 },
    reveal: { opacity: 1 },
  };

  return (
    <motion.p
      style={styles.p}
      initial='hidden'
      animate='reveal'
      transition={{ staggerChildren: 0.015, delayChildren: delay }}
    >
      {characters.map((char, index) => (
        <motion.span key={char + index} transition={{ duration: 0.1 }} variants={charVariants}>
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
};

const useStyles = mkUseStyles((t) => ({
  p: {
    color: t.colors.lightBlue,
    textIndent: '2em',
  },
  indent: {},
}));
