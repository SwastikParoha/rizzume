interface CoverLetterTemplateProps {
  text: string;
  name: string;
  id?: string;
}

export default function CoverLetterTemplate({ text, name, id = 'cover-letter-pdf' }: CoverLetterTemplateProps) {
  const paragraphs = text.split('\n\n').filter(Boolean);

  return (
    <div
      id={id}
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        padding: '48px 52px',
        maxWidth: '780px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        color: '#1a1a1a',
        fontSize: '11pt',
        lineHeight: '1.65',
      }}
    >
      <div style={{ marginBottom: '28px' }}>
        <strong style={{ fontSize: '14pt', color: '#0f0f1a' }}>{name}</strong>
      </div>
      {paragraphs.map((para, i) => (
        <p key={i} style={{ margin: '0 0 16px 0', color: '#1a1a1a' }}>
          {para}
        </p>
      ))}
    </div>
  );
}
