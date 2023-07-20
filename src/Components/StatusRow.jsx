import { getTicketCount } from "../utils/utils";
import StatusCard from "./StatusCard";

const StatusRow = ({ ticketList }) => {
  return (
    <div className="row my-5 mx-2 text-center">
      <StatusCard
        cardColor="warning"
        cardText="Open"
        cardValue={getTicketCount(ticketList, "OPEN")}
      />
      <StatusCard
        cardColor="primary"
        cardText="In progress"
        cardValue={getTicketCount(ticketList, "IN_PROGRESS")}
      />
      <StatusCard
        cardColor="success"
        cardText="Closed"
        cardValue={getTicketCount(ticketList, "CLOSED")}
      />
      <StatusCard
        cardColor="secondary"
        cardText="Blocked"
        cardValue={getTicketCount(ticketList, "BLOCKED")}
      />
    </div>
  );
};

export default StatusRow;
