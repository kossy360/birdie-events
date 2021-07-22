
import AppThemeProvider from './components/AppThemeProvider';
import ReactQueryProvider from './components/ReactQueryProvider';
import Home from './views/Home';

function App() {
  return (
    <ReactQueryProvider>
      <AppThemeProvider>
        <Home />
      </AppThemeProvider>
    </ReactQueryProvider>
  );
}

export default App;
