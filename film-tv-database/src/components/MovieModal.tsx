import "./MovieModal.css";

interface MovieModalProps {
  title: string;
  description: string;
  onClose: () => void;
}

export default function MovieModal({ title, description, onClose }: MovieModalProps) {
  return (
    <div className="modal">
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
