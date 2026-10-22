import SearchBar from './SearchBar.jsx';
import SelectField from './SelectField.jsx';
import { POSITIONS, SORT_OPTIONS } from '../utils/format.js';

export default function Filters({ filters, clubs, onChange, onReset }) {
  const clubOptions = clubs.map((c) => ({ value: c, label: c }));

  return (
    <section className="filters" aria-label="Search and filters">
      <SearchBar value={filters.search} onChange={(v) => onChange('search', v)} />
      <SelectField
        label="Position"
        value={filters.position}
        onChange={(v) => onChange('position', v)}
        options={POSITIONS}
        allLabel="All positions"
      />
      <SelectField
        label="Club"
        value={filters.club}
        onChange={(v) => onChange('club', v)}
        options={clubOptions}
        allLabel="All clubs"
      />
      <SelectField
        label="Sort by"
        value={filters.sort}
        onChange={(v) => onChange('sort', v)}
        options={SORT_OPTIONS}
      />
      <label className="check">
        <input
          type="checkbox"
          checked={filters.shortlistOnly}
          onChange={(e) => onChange('shortlistOnly', e.target.checked)}
        />
        Shortlist only
      </label>
      <button type="button" className="btn btn--ghost" onClick={onReset}>
        Reset filters
      </button>
    </section>
  );
}
