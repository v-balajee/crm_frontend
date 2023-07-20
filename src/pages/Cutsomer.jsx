import MaterialTable from "@material-table/core";
import axios from "axios";
import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { toast } from "react-toastify";

import Loader from "../Components/Loader";
import Sidebar from "../Components/Sidebar";
import StatusRow from "../Components/StatusRow";
import UpdateTicketModal from "../Components/UpdateTicketModal";
import WelcomeMsg from "../Components/WelcomeMsg";
import { BASE_URL } from "../Constants";
import useAuth from "../hooks/use-auth";
import useTickets from "../hooks/use-tickets";

const Customer = () => {
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const closeCreateTicketModal = () => setShowCreateTicketModal(false);
  const [ticketCreationData, setTicketCreationData] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [ticketDetail, setTicketDetail] = useState({});
  const [isLoading, ticketList, setTicketList] = useTickets();

  useAuth();

  const handleTicketCreateFormChange = (event) => {
    console.log(event);
    setTicketCreationData({
      ...ticketCreationData,
      [event.target.name]: event.target.value,
    });
  };

  const handleRowClick = (event, rowData) => {
    setShowModal(true);
    setTicketDetail(rowData);
  };

  const changeTicketDetails = (event) => {
    setTicketDetail({
      ...ticketDetail,
      [event.target.name]: event.target.value,
    });
  };

  const createTicket = async (event) => {
    event.preventDefault();
    const data = {
      title: ticketCreationData.title,
      description: ticketCreationData.description,
    };

    try {
      await axios.post(`${BASE_URL}/crm/api/v1/tickets`, data);

      toast.success("Created a new ticket!");
      setShowCreateTicketModal(false);
      setTicketCreationData({});
    } catch (ex) {
      toast.error("Error while creating a new ticket!");
    }
  };

  return (
    <>
      <div className="row bg-light vh-100">
        <Sidebar />
        <div className="col my-4 ">
          <div className="container">
            <div>
              <WelcomeMsg name={localStorage.getItem("name")} userType="user" />
              <StatusRow ticketList={ticketList} />
              <hr />
              {isLoading ? (
                <Loader />
              ) : (
                <MaterialTable
                  onRowClick={handleRowClick}
                  title="Tickets created by me"
                  data={ticketList}
                  actions={[
                    {
                      icon: () => <i class="bi bi-plus-circle"></i>,
                      tooltip: "Create a new ticket",
                      isFreeAction: true,
                      onClick: () => setShowCreateTicketModal(true),
                    },
                  ]}
                  columns={[
                    { title: "Ticket ID", field: "id" },
                    {
                      title: "Title",
                      field: "title",
                    },
                    {
                      title: "Description",
                      field: "description",
                    },
                    {
                      title: "Reporter",
                      field: "reporter",
                    },
                    {
                      title: "Priority",
                      field: "ticketPriority",
                    },
                    {
                      title: "Assignee",
                      field: "assignee",
                    },
                    {
                      title: "Status",
                      field: "status",
                    },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showCreateTicketModal}
        onHide={closeCreateTicketModal}
        centered
        backdrop="static"
        keyboard
      >
        <ModalHeader closeButton>
          <ModalTitle>Create Ticket</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={createTicket}>
            <div className="p-1">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  placeholder="Title"
                  value={ticketCreationData.title}
                  onChange={handleTicketCreateFormChange}
                  required
                />
              </div>
            </div>
            <div className="p-1">
              <div className="input-group">
                <textarea
                  type="text"
                  className="form-control md-textarea"
                  rows={3}
                  name="description"
                  placeholder="Description"
                  value={ticketCreationData.description}
                  onChange={handleTicketCreateFormChange}
                  required
                />
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowCreateTicketModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={createTicket}>
            Create
          </Button>
        </ModalFooter>
      </Modal>
      <UpdateTicketModal
        showModal={showModal}
        setShowModal={setShowModal}
        ticketDetail={ticketDetail}
        changeTicketDetails={changeTicketDetails}
        ticketList={ticketList}
        setTicketList={setTicketList}
        statusOptions={["OPEN", "CLOSED"]}
      />
    </>
  );
};

export default Customer;
