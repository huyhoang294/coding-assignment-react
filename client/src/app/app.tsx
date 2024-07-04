import { Routes, Route } from 'react-router-dom';
import Tickets from './tickets/tickets';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import Header from '@/components/header';
import { QueryClient, QueryClientProvider } from 'react-query';
import TicketDetails from './ticket-details/ticket-details';
const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Routes>
            <Route path="/" element={<Tickets />} />
            {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
            <Route path="/:id" element={<TicketDetails />} />
          </Routes>
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default App;
