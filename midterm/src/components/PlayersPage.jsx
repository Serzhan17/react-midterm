import { useCallback, useEffect, useState } from 'react';
import { getClubs, getPlayers, toggleShortlist } from '../api/fakeApi.js';
import useDebounce from '../hooks/useDebounce.js';
import Filters from './Filters.jsx';
import PlayerList from './PlayerList.jsx';
import PlayerDetail from './PlayerDetail.jsx';
import AddPlayerForm from './AddPlayerForm.jsx';
import Pagination from './Pagination.jsx';
import Modal from './Modal.jsx';
import StatusMessage from './StatusMessage.jsx';

const PAGE_SIZE = 12;
const DEFAULT_FILTERS = {
  search: '',
  position: '',
  club: '',
  shortlistOnly: false,
  sort: 'rating:desc',
  page: 1,
};

export default function PlayersPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [clubs, setClubs] = useState([]);
  const [players, setPlayers] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'success'
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // typing in the search box updates `filters.search` instantly;
  // the request itself is only sent after the user pauses typing
  const debouncedSearch = useDebounce(filters.search, 400);
  const { position, club, shortlistOnly, sort, page } = filters;

  useEffect(() => {
    let ignore = false;
    getClubs().then((data) => {
      if (!ignore) setClubs(data);
    });
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false; // later requests win; stale responses are dropped
    setStatus('loading');
    const [sortField, order] = sort.split(':');

    getPlayers({
      search: debouncedSearch,
      position,
      club,
      shortlistOnly,
      sort: sortField,
      order,
      page,
      pageSize: PAGE_SIZE,
    })
      .then(({ items, total: count }) => {
        if (ignore) return;
        setPlayers(items);
        setTotal(count);
        setError(null);
        setStatus('success');
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
        setStatus('error');
      });

    return () => {
      ignore = true;
    };
  }, [debouncedSearch, position, club, shortlistOnly, sort, page, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // any filter change sends the user back to page 1
  const handleFilterChange = (name, value) =>
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));

  const handleReset = () => setFilters(DEFAULT_FILTERS);
  const handlePageChange = (next) => setFilters((prev) => ({ ...prev, page: next }));
  const retry = () => setRefreshKey((k) => k + 1);

  async function handleToggleShortlist(id) {
    try {
      await toggleShortlist(id);
      setNotice(null);
      retry();
    } catch (err) {
      setNotice(err.message);
    }
  }

  function handleAdded() {
    setFormOpen(false);
    // show the new player at the top of the list
    setFilters({ ...DEFAULT_FILTERS, sort: 'id:desc' });
    retry();
  }

  const closeDetail = useCallback(() => setSelectedId(null), []);
  const closeForm = useCallback(() => setFormOpen(false), []);

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <>
      <div className="toolbar">
        <div>
          <h2 className="toolbar__title">Players</h2>
          <p className="toolbar__count" aria-live="polite">
            {status === 'success'
              ? `Showing ${rangeStart}–${rangeEnd} of ${total}`
              : 'Loading players…'}
          </p>
        </div>
        <button type="button" className="btn" onClick={() => setFormOpen(true)}>
          Add player
        </button>
      </div>

      <Filters filters={filters} clubs={clubs} onChange={handleFilterChange} onReset={handleReset} />

      {notice && (
        <p className="notice" role="alert">
          {notice}
        </p>
      )}

      {status === 'loading' && <StatusMessage type="loading" title="Loading players…" />}

      {status === 'error' && (
        <StatusMessage
          type="error"
          title="Could not load players"
          message={error}
          actionLabel="Try again"
          onAction={retry}
        />
      )}

      {status === 'success' && players.length === 0 && (
        <StatusMessage
          type="empty"
          title="No players match these filters"
          message="Try a different search, or clear the filters."
          actionLabel="Reset filters"
          onAction={handleReset}
        />
      )}

      {status === 'success' && players.length > 0 && (
        <>
          <PlayerList
            players={players}
            onOpen={setSelectedId}
            onToggleShortlist={handleToggleShortlist}
          />
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </>
      )}

      {selectedId !== null && (
        <Modal title="Player profile" onClose={closeDetail}>
          <PlayerDetail
            key={selectedId}
            id={selectedId}
            refreshKey={refreshKey}
            onToggleShortlist={handleToggleShortlist}
          />
        </Modal>
      )}

      {formOpen && (
        <Modal title="Add a player" onClose={closeForm}>
          <AddPlayerForm clubs={clubs} onAdded={handleAdded} />
        </Modal>
      )}
    </>
  );
}
