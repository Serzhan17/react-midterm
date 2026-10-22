export default function SearchBar({ value, onChange }) {
  return (
    <label className="field field--grow">
      <span className="field__label">Search</span>
      <input
        type="search"
        className="input"
        placeholder="Name, club or country"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
