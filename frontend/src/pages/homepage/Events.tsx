import styles from '../../styles/styles';
import { useAppSelector } from '../../redux/hook';
import EventCard from '../../components/events/EventCard';

const Events = () => {
  const { allEvents, isLoading } = useAppSelector((state) => state.events);

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>

          <div className="w-full grid">
            {allEvents.length !== 0 && (
              <EventCard data={allEvents && allEvents[0]} active={false} />
            )}
            <h4>{allEvents?.length === 0 && 'No Events have!'}</h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
