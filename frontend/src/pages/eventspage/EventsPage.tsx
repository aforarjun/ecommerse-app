import { useAppSelector } from "../../redux/hook";
import Loader from "../../components/Loader";
import Header from "../../components/header/Header";
import EventCard from "../../components/events/EventCard";
import Footer from "../../components/footer/Footer";

const EventsPage = () => {
    const { allEvents, isLoading } = useAppSelector((state) => state.events);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <Header activeHeading={4} />

                    <EventCard active={true} data={allEvents && allEvents[0]} />
                </div>
            )}

            <Footer />
        </>
    );
};

export default EventsPage;