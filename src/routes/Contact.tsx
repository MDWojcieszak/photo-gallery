import { motion } from 'framer-motion';
import { ComponentType, useState } from 'react';
import { LuArrowUpRight, LuCheck, LuCopy, LuInstagram, LuMail, LuMapPin } from 'react-icons/lu';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Footer } from '~/components/Footer';
import { InquiryContext, InquiryForm } from '~/components/InquiryForm';
import { Nav } from '~/components/Nav';
import { PageBackground } from '~/components/PageBackground';
import { CONTACT, SITE } from '~/config';
import { ContactLinkState } from '~/lib/contact';
import { contactFormOpen, contactTopics } from '~/lib/portfolio';
import { useContactConfig } from '~/hooks/usePortfolio';
import { useResponsive } from '~/hooks/useResponsive';
import { useSeo } from '~/hooks/useSeo';
import { mkUseStyles, useTheme } from '~/utils/theme';

type Row = {
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  copy?: string;
};

const copyToClipboard = async (text: string) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
};

const ContactRow = ({ row, delay }: { row: Row; delay: number }) => {
  const styles = useStyles();
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!row.copy) return;
    if (await copyToClipboard(row.copy)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  const main = (
    <>
      <span style={styles.rowIcon}>
        <row.icon size={18} color={theme.colors.accentSoft} />
      </span>
      {!isMobile && <span style={styles.rowLabel}>{row.label}</span>}
      <span style={{ ...styles.rowValue, fontSize: isMobile ? 17 : 'clamp(18px, 2.4vw, 24px)' }}>{row.value}</span>
      {row.href && (
        <span style={styles.rowArrow}>
          <LuArrowUpRight size={16} color={theme.colors.textFaint} />
        </span>
      )}
    </>
  );

  return (
    <motion.div
      style={styles.row}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {row.href ? (
        <a href={row.href} style={styles.rowMain} {...(row.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
          {main}
        </a>
      ) : (
        <div style={styles.rowMain}>{main}</div>
      )}

      {row.copy && (
        <motion.button
          type='button'
          onClick={onCopy}
          style={{ ...styles.copyBtn, paddingLeft: isMobile ? theme.spacing.m : theme.spacing.l }}
          animate={{ color: copied ? theme.colors.text : theme.colors.textFaint }}
          whileHover={{ color: theme.colors.text }}
          aria-label={`Copy ${row.label.toLowerCase()}`}
          title={copied ? 'Copied' : 'Copy'}
        >
          {copied ? (
            <LuCheck size={14} style={{ marginRight: isMobile ? 0 : 6 }} />
          ) : (
            <LuCopy size={14} style={{ marginRight: isMobile ? 0 : 6 }} />
          )}
          {!isMobile && (copied ? 'Copied' : 'Copy')}
        </motion.button>
      )}
    </motion.div>
  );
};

export const Contact = () => {
  const styles = useStyles();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const linkState = (location.state ?? {}) as ContactLinkState;
  const galleryId = params.get('album');
  const context: InquiryContext | undefined = galleryId
    ? {
        galleryId,
        imageId: params.get('image') ?? undefined,
        galleryTitle: linkState.galleryTitle,
        thumbUrl: linkState.thumbUrl,
      }
    : undefined;

  // The form shows only when the panel has it enabled (and a privacy notice to acknowledge).
  const { data: contact } = useContactConfig();
  const topics = contact ? contactTopics(contact) : [];

  useSeo({
    title: `Contact — ${SITE.name}`,
    description: `Get in touch with ${SITE.name} for prints, collaborations and commissions.`,
    path: '/contact',
  });

  const rows: Row[] = [
    { icon: LuMail, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}`, copy: CONTACT.email },
    {
      icon: LuInstagram,
      label: 'Instagram',
      value: `@${CONTACT.instagramHandle}`,
      href: CONTACT.instagram,
      external: true,
      copy: CONTACT.instagram,
    },
    { icon: LuMapPin, label: 'Based in', value: CONTACT.location },
  ];

  return (
    <div style={styles.page}>
      <PageBackground />
      <Nav variant='solid' />

      <div style={styles.content}>
        <div style={styles.inner}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span style={styles.eyebrow}>Contact</span>
            <h1 style={styles.title}>Let’s work together</h1>
            <p style={styles.lead}>
              For prints, commissions or collaborations — reach out any time. I usually reply within a day or two.
            </p>
          </motion.div>

          <div style={styles.rows}>
            {rows.map((r, i) => (
              <ContactRow key={r.label} row={r} delay={i * 0.06} />
            ))}
          </div>

          {contactFormOpen(contact) && (
            <motion.section
              id='message'
              style={styles.formSection}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
            >
              <h2 style={styles.formTitle}>Send a message</h2>
              {contact.intro && <p style={styles.formIntro}>{contact.intro}</p>}
              <InquiryForm
                topics={topics}
                locale={contact.locale}
                context={context}
                onClearContext={() => setParams({}, { replace: true })}
              />
            </motion.section>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  page: { minHeight: '100svh', position: 'relative' },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  inner: {
    minHeight: '100svh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 820,
    margin: '0 auto',
    padding: 'clamp(100px, 14vh, 150px) clamp(20px, 5vw, 56px) clamp(72px, 10vh, 120px)',
  },
  eyebrow: {
    display: 'block',
    fontSize: 11,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: t.colors.textFaint,
    marginBottom: t.spacing.sm,
  },
  title: {
    fontFamily: t.fonts.serif,
    fontWeight: 500,
    fontSize: 'clamp(40px, 6vw, 72px)',
    lineHeight: 1.02,
    color: t.colors.text,
  },
  lead: {
    maxWidth: 560,
    marginTop: t.spacing.m,
    fontSize: 'clamp(15px, 1.6vw, 18px)',
    fontWeight: 300,
    lineHeight: 1.7,
    color: t.colors.textMuted,
  },
  rows: {
    marginTop: 'clamp(28px, 4vh, 48px)',
    display: 'flex',
    flexDirection: 'column',
    gap: t.spacing.s,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: t.spacing.m,
    padding: `${t.spacing.m}px 0`,
  },
  rowMain: {
    display: 'flex',
    alignItems: 'center',
    gap: t.spacing.m,
    flex: 1,
    minWidth: 0,
    color: t.colors.text,
    textDecoration: 'none',
  },
  rowIcon: {
    display: 'flex',
    width: 24,
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowLabel: {
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: t.colors.textFaint,
    width: 96,
    flexShrink: 0,
  },
  rowValue: {
    flex: 1,
    minWidth: 0,
    overflowWrap: 'anywhere',
    fontFamily: t.fonts.serif,
    fontSize: 'clamp(18px, 2.4vw, 24px)',
    color: t.colors.text,
  },
  rowArrow: {
    display: 'flex',
    flexShrink: 0,
  },
  formSection: {
    marginTop: 'clamp(56px, 9vh, 96px)',
    scrollMarginTop: 96,
  },
  formIntro: {
    maxWidth: 560,
    marginTop: `-${t.spacing.m}px`,
    marginBottom: 'clamp(24px, 4vh, 40px)',
    fontSize: 15,
    fontWeight: 300,
    lineHeight: 1.7,
    color: t.colors.textMuted,
    whiteSpace: 'pre-line',
  },
  formTitle: {
    fontFamily: t.fonts.serif,
    fontWeight: 500,
    fontSize: 'clamp(30px, 4vw, 44px)',
    lineHeight: 1.05,
    color: t.colors.text,
    marginBottom: 'clamp(24px, 4vh, 40px)',
  },
  copyBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    background: 'none',
    border: 'none',
    padding: `6px 0 6px ${t.spacing.l}px`,
    fontFamily: t.fonts.sans,
    fontSize: 10,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: t.colors.textFaint,
    cursor: 'pointer',
  },
}));
