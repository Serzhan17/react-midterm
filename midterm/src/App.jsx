import Header from './components/Header.jsx';
import PlayersPage from './components/PlayersPage.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main className="container">
        <PlayersPage />
      </main>
      <footer className="footer">
        FootScout · demo data is generated and stored in your browser (localStorage)
      </footer>
    </>
  );
}
