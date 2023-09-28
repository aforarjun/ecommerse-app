import { useAppSelector } from '../../redux/hook';
import Loader from '../../components/Loader';
import Header from '../../components/header/Header';
import EventCard from '../../components/events/EventCard';
import Footer from '../../components/footer/Footer';
import { Event } from '../../utils/Interfaces';

const EventsPage = () => {
  const { allEvents, isLoading } = useAppSelector((state) => state.events);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          {allEvents.length ? (
            allEvents.map((event: Event, index: number) => (
              <EventCard key={event._id + index} active={true} data={event} />
            ))
          ) : (
            <div className="grid h-[50vh]">
              <p className="m-auto">No event going on.</p>
            </div>
          )}
        </div>
      )}

      <Footer />
    </>
  );
};

export default EventsPage;
