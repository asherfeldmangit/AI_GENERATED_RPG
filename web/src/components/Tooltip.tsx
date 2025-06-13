import { ReactNode, useState } from 'react';

interface Props {
  text: string;
  children: ReactNode;
}

export default function Tooltip({ text, children }: Props) {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#222',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            fontSize: '0.75rem',
            zIndex: 1000,
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
} 