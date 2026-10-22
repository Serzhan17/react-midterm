import { useState } from 'react';
import { addPlayer } from '../api/fakeApi.js';
import { POSITIONS } from '../utils/format.js';

const EMPTY = {
  name: '',
  age: '',
  position: 'MF',
  club: '',
  nationality: '',
  rating: '',
  marketValue: '',
};

function validate(v) {
  const errors = {};
  if (v.name.trim().length < 3) errors.name = 'Enter a name of at least 3 characters.';
  const age = Number(v.age);
  if (!v.age || !Number.isInteger(age) || age < 16 || age > 45) errors.age = 'Age must be 16–45.';
  if (!v.club) errors.club = 'Choose a club.';
  if (!v.nationality.trim()) errors.nationality = 'Enter a country.';
  const rating = Number(v.rating);
  if (!v.rating || !Number.isInteger(rating) || rating < 40 || rating > 99) {
    errors.rating = 'Rating must be 40–99.';
  }
  const value = Number(v.marketValue);
  if (v.marketValue === '' || !Number.isFinite(value) || value < 0 || value > 200000) {
    errors.marketValue = 'Value must be 0–200000 (in €K).';
  }
  return errors;
}

export default function AddPlayerForm({ clubs, onAdded }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const player = await addPlayer({
        name: values.name,
        age: Number(values.age),
        position: values.position,
        club: values.club,
        nationality: values.nationality,
        rating: Number(values.rating),
        marketValue: Number(values.marketValue),
      });
      onAdded(player);
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  }

  const field = (name, label, props = {}) => (
    <label className="field">
      <span className="field__label">{label}</span>
      <input
        className={`input ${errors[name] ? 'input--error' : ''}`}
        name={name}
        value={values[name]}
        onChange={handleChange}
        {...props}
      />
      {errors[name] && <span className="field__error">{errors[name]}</span>}
    </label>
  );

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {field('name', 'Full name')}
      <div className="form__row">
        {field('age', 'Age', { type: 'number', inputMode: 'numeric' })}
        <label className="field">
          <span className="field__label">Position</span>
          <select className="input" name="position" value={values.position} onChange={handleChange}>
            {POSITIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span className="field__label">Club</span>
        <select
          className={`input ${errors.club ? 'input--error' : ''}`}
          name="club"
          value={values.club}
          onChange={handleChange}
        >
          <option value="">Choose a club</option>
          {clubs.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.club && <span className="field__error">{errors.club}</span>}
      </label>
      {field('nationality', 'Country')}
      <div className="form__row">
        {field('rating', 'Rating (40–99)', { type: 'number', inputMode: 'numeric' })}
        {field('marketValue', 'Value (€K)', { type: 'number', inputMode: 'numeric' })}
      </div>

      {submitError && (
        <p className="field__error" role="alert">
          {submitError}
        </p>
      )}
      <button type="submit" className="btn btn--block" disabled={submitting}>
        {submitting ? 'Saving…' : 'Add player'}
      </button>
    </form>
  );
}
