import './TitleScene.css';

interface Props {
  onStart: () => void;
}

export default function TitleScene({ onStart }: Props) {
  return (
    <div className="title-scene">
      <h1 className="logo">Eclipse&nbsp;Citadel</h1>
      <button className="start-btn" onClick={onStart}>
        New Game
      </button>
    </div>
  );
} 