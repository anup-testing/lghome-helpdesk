export default function StarRating({ value, onChange }) {
  return (
    <div className="star-rating" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= value ? 'on' : ''}
          aria-pressed={star <= value}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
