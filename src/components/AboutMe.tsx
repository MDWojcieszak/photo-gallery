import { AnimatedText } from '~/components/AnimatedText';
import { mkUseStyles } from '~/utils/theme';
export const AboutMe = () => {
  const styles = useStyles();

  const paragraphDelays = [0, 6, 12];

  const text = [
    'Hi! I’m a passionate photographer who loves capturing the beauty of nature, stunning sunsets, majestic mountains and the unique atmosphere of interesting architectural spots around the world. I have a special appreciation for cityscapes at night — there’s something captivating about the way lights transform urban landscapes.',
    'I’m a big fan of Fujifilm, drawn to its amazing color science and vintage-inspired design. While I usually rely on my digital gear, I occasionally dive into analog photography.',
    'Photography isn’t just something I do — it’s how I connect with the world around me 📸 one fram at a time.',
  ];

  return (
    <div style={styles.container}>
      {text.map((paragraph, index) => (
        <AnimatedText text={paragraph} key={index} delay={paragraphDelays[index]} />
      ))}
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  container: {
    borderRadius: t.borderRadius.default,
    margin: t.spacing.m,
  },
}));
