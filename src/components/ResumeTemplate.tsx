import { ResumeData } from '@/types';

interface ResumeTemplateProps {
  data: ResumeData;
  id?: string;
}

// ATS-friendly single-column resume in pure HTML/inline styles
// Kept plain — no flex/grid, no images, no tables — for maximum ATS compatibility
export default function ResumeTemplate({ data, id = 'resume-pdf' }: ResumeTemplateProps) {
  const { name, email, phone, location, linkedin, github, summary, experience, skills, education } = data;

  const sectionHeading: React.CSSProperties = {
    fontSize: '11pt',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: '1.5px solid #1a1a2e',
    paddingBottom: '3px',
    marginTop: '18px',
    marginBottom: '10px',
    color: '#1a1a2e',
  };

  const bulletStyle: React.CSSProperties = {
    margin: '3px 0',
    paddingLeft: '14px',
    position: 'relative',
    fontSize: '10pt',
    lineHeight: '1.5',
    color: '#1a1a1a',
  };

  return (
    <div
      id={id}
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        padding: '36px 44px',
        maxWidth: '780px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        color: '#1a1a1a',
        fontSize: '10.5pt',
        lineHeight: '1.45',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '22pt', fontWeight: 800, margin: '0 0 4px 0', color: '#0f0f1a' }}>
          {name}
        </h1>
        <p style={{ fontSize: '9.5pt', color: '#444', margin: 0, lineHeight: '1.6' }}>
          {[email, phone, location, linkedin, github].filter(Boolean).join('  ·  ')}
        </p>
      </div>

      {/* Summary */}
      {summary && (
        <>
          <h2 style={sectionHeading}>Professional Summary</h2>
          <p style={{ margin: 0, fontSize: '10.5pt', lineHeight: '1.55', color: '#1a1a1a' }}>
            {summary}
          </p>
        </>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <>
          <h2 style={sectionHeading}>Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '11pt', color: '#0f0f1a' }}>
                  {exp.title}
                </strong>
                <span style={{ fontSize: '9.5pt', color: '#555', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                  {exp.duration}
                </span>
              </div>
              <div style={{ fontSize: '10pt', color: '#3d3d3d', marginBottom: '5px' }}>
                {exp.company}
              </div>
              <ul style={{ margin: '4px 0 0 0', padding: 0, listStyle: 'none' }}>
                {exp.bullets.map((b, j) => (
                  <li key={j} style={bulletStyle}>
                    <span style={{ position: 'absolute', left: 0, color: '#555' }}>▸</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <>
          <h2 style={sectionHeading}>Skills</h2>
          <p style={{ margin: 0, fontSize: '10.5pt', color: '#1a1a1a', lineHeight: '1.6' }}>
            {skills.join('  ·  ')}
          </p>
        </>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <>
          <h2 style={sectionHeading}>Education</h2>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '10.5pt', color: '#0f0f1a' }}>{edu.institution}</strong>
                <br />
                <span style={{ fontSize: '10pt', color: '#3d3d3d' }}>{edu.degree}</span>
              </div>
              <span style={{ fontSize: '9.5pt', color: '#555', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                {edu.year}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
