import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useEffect, useState } from 'react';
import { LuArrowRight, LuCheck, LuX } from 'react-icons/lu';
import { PrivacyModal } from '~/components/PrivacyModal';
import { apiUrl } from '~/config';
import { useResponsive } from '~/hooks/useResponsive';
import { INQUIRY_TOPIC_LABEL, InquiryError, inquiryErrorOf, InquiryTopic, submitInquiry } from '~/lib/portfolio';
import { mkUseStyles, useTheme } from '~/utils/theme';

export type InquiryContext = {
  galleryId: string;
  imageId?: string;
  galleryTitle?: string;
  thumbUrl?: string;
};

type Fields = { name: string; email: string; phone: string; message: string };
type FieldErrors = Partial<Record<keyof Fields | 'topic' | 'privacy', string>>;

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+()-]+$/;

const ERROR_TEXT: Record<InquiryError, string> = {
  rate: 'Too many messages in a short time — please try again in a few minutes.',
  context: 'The photo or album you asked about is no longer available. Remove it and send again.',
  disabled: 'The contact form is currently unavailable — please reach out by email instead.',
  invalid: 'Some of the details look invalid — please check the form and try again.',
  error: 'Something went wrong. Please try again in a moment.',
};

const validate = (f: Fields, topic: InquiryTopic | null, acknowledged: boolean): FieldErrors => {
  const e: FieldErrors = {};
  const name = f.name.trim();
  if (!name) e.name = 'Please enter your name.';
  else if (name.length > 120) e.name = 'Name is too long.';
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Please enter a valid email.';
  if (f.phone.trim() && !PHONE_RE.test(f.phone.trim())) e.phone = 'Digits, spaces and + ( ) - only.';
  if (!topic) e.topic = 'Choose what it’s about.';
  const msg = f.message.trim();
  if (msg.length < MESSAGE_MIN) e.message = `At least ${MESSAGE_MIN} characters.`;
  else if (msg.length > MESSAGE_MAX) e.message = `At most ${MESSAGE_MAX} characters.`;
  if (!acknowledged) e.privacy = 'Please confirm you have read the privacy notice.';
  return e;
};

type InquiryFormProps = {
  /** Topics offered by the panel. */
  topics: InquiryTopic[];
  /** Visitor's locale — sent with the inquiry; the backend records that locale's notice as acknowledged. */
  locale: string;
  context?: InquiryContext;
  onClearContext?: () => void;
};

/** Always preselect a topic: a print when asking about a photo, otherwise the first one offered. */
const initialTopic = (topics: InquiryTopic[], context?: InquiryContext): InquiryTopic | null => {
  if (context?.imageId && topics.includes('PRINT')) return 'PRINT';
  return topics[0] ?? null;
};

export const InquiryForm = ({ topics, locale, context, onClearContext }: InquiryFormProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const { isMobile } = useResponsive();

  const [fields, setFields] = useState<Fields>({ name: '', email: '', phone: '', message: '' });
  const [topic, setTopic] = useState<InquiryTopic | null>(() => initialTopic(topics, context));

  // Keep a valid selection if the offered topics change (e.g. panel edit, language switch).
  useEffect(() => {
    if (!topic || !topics.includes(topic)) setTopic(initialTopic(topics, context));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics.join()]);
  const [acknowledged, setAcknowledged] = useState(false);
  const [website, setWebsite] = useState('');
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [submitError, setSubmitError] = useState<InquiryError | null>(null);

  const set = (k: keyof Fields) => (v: string) => {
    setFields((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (status === 'sending') return;
    const e = validate(fields, topic, acknowledged);
    setErrors(e);
    if (Object.values(e).some(Boolean) || !topic) return;

    setStatus('sending');
    setSubmitError(null);
    try {
      await submitInquiry({
        name: fields.name.trim(),
        email: fields.email.trim(),
        phone: fields.phone.trim() || undefined,
        topic,
        message: fields.message.trim(),
        galleryId: context?.galleryId,
        imageId: context?.imageId,
        acknowledgedPrivacyNotice: true,
        locale,
        website,
      });
      setStatus('sent');
    } catch (err) {
      setSubmitError(inquiryErrorOf(err));
      setStatus('idle');
    }
  };

  if (status === 'sent') {
    return (
      <motion.div
        style={styles.sent}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        role='status'
      >
        <span style={styles.sentIcon}>
          <LuCheck size={20} color={theme.colors.ink} />
        </span>
        <h3 style={styles.sentTitle}>Thank you — I’ll get back to you.</h3>
        <p style={styles.sentText}>Your message is on its way. I usually reply within a day or two.</p>
      </motion.div>
    );
  }

  const thumb = apiUrl(context?.thumbUrl);
  const msgLen = fields.message.trim().length;

  return (
    <form style={styles.form} onSubmit={onSubmit} noValidate>
      {context && (
        <div style={styles.context}>
          {thumb && <img src={thumb} alt='' style={styles.contextThumb} />}
          <div style={styles.contextText}>
            <span style={styles.contextEyebrow}>{context.imageId ? 'Asking about this photo' : 'Asking about'}</span>
            <span style={styles.contextTitle}>{context.galleryTitle ?? 'Selected album'}</span>
          </div>
          {onClearContext && (
            <button type='button' style={styles.contextClear} onClick={onClearContext} aria-label='Remove reference'>
              <LuX size={16} />
            </button>
          )}
        </div>
      )}

      <fieldset style={styles.fieldset}>
        <legend style={{ ...styles.label, marginBottom: theme.spacing.m }}>What is it about?</legend>
        <div style={styles.topics}>
          {topics.map((t) => {
            const active = topic === t;
            return (
              <button
                key={t}
                type='button'
                aria-pressed={active}
                onClick={() => {
                  setTopic(t);
                  setErrors((e) => ({ ...e, topic: undefined }));
                }}
                style={{
                  ...styles.topic,
                  color: active ? theme.colors.ink : theme.colors.textMuted,
                  backgroundColor: active ? theme.colors.accent : theme.colors.surface,
                }}
              >
                {INQUIRY_TOPIC_LABEL[t]}
              </button>
            );
          })}
        </div>
        {errors.topic && <span style={styles.error}>{errors.topic}</span>}
      </fieldset>

      <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
        <Field label='Name' error={errors.name}>
          <input
            className='field-input'
            style={styles.input}
            value={fields.name}
            onChange={(e) => set('name')(e.target.value)}
            autoComplete='name'
            maxLength={120}
            aria-invalid={!!errors.name}
          />
        </Field>
        <Field label='Email' error={errors.email}>
          <input
            className='field-input'
            style={styles.input}
            type='email'
            value={fields.email}
            onChange={(e) => set('email')(e.target.value)}
            autoComplete='email'
            aria-invalid={!!errors.email}
          />
        </Field>
        <Field label='Phone' optional error={errors.phone}>
          <input
            className='field-input'
            style={styles.input}
            type='tel'
            value={fields.phone}
            onChange={(e) => set('phone')(e.target.value)}
            autoComplete='tel'
            aria-invalid={!!errors.phone}
          />
        </Field>
      </div>

      <Field
        label='Message'
        error={errors.message}
        aside={
          <span style={{ ...styles.counter, color: msgLen > MESSAGE_MAX ? theme.colors.text : theme.colors.textFaint }}>
            {msgLen} / {MESSAGE_MAX}
          </span>
        }
      >
        <textarea
          className='field-input'
          style={styles.textarea}
          value={fields.message}
          onChange={(e) => set('message')(e.target.value)}
          rows={6}
          aria-invalid={!!errors.message}
        />
      </Field>

      {/* Honeypot — invisible to people, bots tend to fill it in. */}
      <div style={styles.honeypot} aria-hidden>
        <label>
          Website
          <input
            name='website'
            type='text'
            tabIndex={-1}
            autoComplete='off'
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <label style={styles.consent}>
        <input
          type='checkbox'
          checked={acknowledged}
          onChange={(e) => {
            setAcknowledged(e.target.checked);
            if (e.target.checked) setErrors((er) => ({ ...er, privacy: undefined }));
          }}
          style={styles.checkbox}
        />
        <span>
          I have read the{' '}
          <button
            type='button'
            style={styles.consentLink}
            onClick={(e) => {
              e.preventDefault();
              setPrivacyOpen(true);
            }}
          >
            privacy notice
          </button>{' '}
          and understand how my data will be used to answer this message.
        </span>
      </label>
      {errors.privacy && <span style={{ ...styles.error, marginTop: -8 }}>{errors.privacy}</span>}

      <AnimatePresence>
        {submitError && (
          <motion.p
            style={styles.submitError}
            role='alert'
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {ERROR_TEXT[submitError]}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type='submit'
        style={{ ...styles.submit, opacity: status === 'sending' ? 0.6 : 1 }}
        disabled={status === 'sending'}
        whileHover={{ backgroundColor: theme.colors.text }}
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
        <LuArrowRight size={15} style={{ marginLeft: 10 }} />
      </motion.button>
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} locale={locale} />
    </form>
  );
};

const Field = ({
  label,
  optional,
  error,
  aside,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const styles = useStyles();
  return (
    <label style={styles.field}>
      <span style={styles.labelRow}>
        <span style={styles.label}>
          {label}
          {optional && <span style={styles.optional}> — optional</span>}
        </span>
        {aside}
      </span>
      {children}
      {error && <span style={styles.error}>{error}</span>}
    </label>
  );
};

const useStyles = mkUseStyles((t) => {
  const control: React.CSSProperties = {
    width: '100%',
    backgroundColor: t.colors.surface,
    border: 'none',
    borderRadius: t.borderRadius.default,
    padding: '12px 14px',
    fontFamily: t.fonts.sans,
    fontSize: 16,
    fontWeight: 300,
    color: t.colors.text,
    outline: 'none',
  };
  return {
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: t.spacing.xl,
    },
    context: {
      display: 'flex',
      alignItems: 'center',
      gap: t.spacing.m,
      padding: t.spacing.sm,
      backgroundColor: t.colors.surface,
      borderRadius: t.borderRadius.large,
    },
    contextThumb: {
      width: 64,
      height: 64,
      objectFit: 'cover',
      borderRadius: t.borderRadius.default,
      flexShrink: 0,
    },
    contextText: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      flex: 1,
      minWidth: 0,
      paddingLeft: 4,
    },
    contextEyebrow: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: t.colors.textFaint,
    },
    contextTitle: {
      fontFamily: t.fonts.serif,
      fontSize: 20,
      color: t.colors.text,
      overflowWrap: 'anywhere',
    },
    contextClear: {
      display: 'flex',
      background: 'none',
      border: 'none',
      padding: t.spacing.s,
      color: t.colors.textFaint,
      cursor: 'pointer',
    },
    fieldset: {
      border: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: t.spacing.sm,
    },
    topics: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: t.spacing.s,
    },
    topic: {
      padding: '8px 14px',
      border: 'none',
      borderRadius: 999,
      fontFamily: t.fonts.sans,
      fontSize: 13,
      cursor: 'pointer',
      transition: 'background-color 0.2s, color 0.2s',
    },
    grid: {
      display: 'grid',
      columnGap: t.spacing.xl,
      rowGap: t.spacing.xl,
    },
    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    },
    labelRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    },
    label: {
      padding: 0,
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: t.colors.textFaint,
    },
    optional: {
      letterSpacing: '0.08em',
      textTransform: 'none',
    },
    counter: {
      fontSize: 11,
      fontVariantNumeric: 'tabular-nums',
    },
    input: control,
    textarea: {
      ...control,
      resize: 'vertical',
      minHeight: 140,
      lineHeight: 1.6,
    },
    error: {
      marginTop: 6,
      fontSize: 12,
      color: t.colors.text,
    },
    honeypot: {
      position: 'absolute',
      left: -10000,
      top: 'auto',
      width: 1,
      height: 1,
      overflow: 'hidden',
    },
    consent: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: t.spacing.sm,
      fontSize: 13,
      fontWeight: 300,
      lineHeight: 1.6,
      color: t.colors.textMuted,
      cursor: 'pointer',
    },
    consentLink: {
      background: 'none',
      border: 'none',
      padding: 0,
      font: 'inherit',
      color: t.colors.text,
      textDecoration: 'underline',
      textUnderlineOffset: 3,
    },
    checkbox: {
      width: 16,
      height: 16,
      marginTop: 3,
      flexShrink: 0,
      accentColor: t.colors.accent,
      cursor: 'pointer',
    },
    submitError: {
      padding: `${t.spacing.sm}px ${t.spacing.m}px`,
      borderRadius: t.borderRadius.default,
      backgroundColor: t.colors.surface02,
      fontSize: 13,
      color: t.colors.text,
    },
    submit: {
      alignSelf: 'flex-start',
      display: 'inline-flex',
      alignItems: 'center',
      padding: '14px 26px',
      border: 'none',
      borderRadius: 999,
      backgroundColor: t.colors.accent,
      color: t.colors.ink,
      fontFamily: t.fonts.sans,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      cursor: 'pointer',
    },
    sent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: t.spacing.sm,
      padding: 'clamp(24px, 4vw, 40px)',
      backgroundColor: t.colors.surface,
      borderRadius: t.borderRadius.large,
    },
    sentIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: t.colors.accent,
      marginBottom: t.spacing.xs,
    },
    sentTitle: {
      fontFamily: t.fonts.serif,
      fontWeight: 500,
      fontSize: 'clamp(24px, 3vw, 32px)',
      color: t.colors.text,
      margin: 0,
    },
    sentText: {
      fontSize: 14,
      fontWeight: 300,
      lineHeight: 1.6,
      color: t.colors.textMuted,
      margin: 0,
    },
  };
});
