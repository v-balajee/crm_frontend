import { useState, useEffect } from "react";
import { BASE_URL } from "../Constants";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import StatusRow from "../Components/StatusRow";
import MaterialTable from "@material-table/core";
import Loader from "../Components/Loader";
import { Modal, ModalBody, Button, Form, ModalFooter } from "react-bootstrap";
import { toast } from "react-toastify";
import WelcomeMsg from "../Components/WelcomeMsg";

const Admin = () => {
  const [userList, setUserList] = useState([]);
  const [isUserListLoading, setIsUserListLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [ticketList, setTicketList] = useState([]);
  const fetchUsers = async () => {
    try {
      setIsUserListLoading(true);
      const { data } = await axios.get(BASE_URL + "/crm/api/v1/users/");
      setUserList(data);
    } catch (ex) {
      toast.error("Erro occured while fetching the list of users.");
    } finally {
      setIsUserListLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/crm/api/v1/tickets/all`);
      setTicketList(data);
    } catch (ex) {
      toast.error("Error occured while fetching the ticket counts.");
    }
  };
  const updateUserDetail = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `${BASE_URL}/crm/api/v1/users/$users/${userDetail.userI}`,
        {
          userType: userDetail.userType,
          userStatus: userDetail.userStatus,
          name: userDetail.name,
          email: userDetail.email,
        }
      );
      toast.success("User details updated successfully");
      setUserList(
        userList.map((user) =>
          user.userId === userDetail.useId ? userDetail : user
        )
      );
      setShowUserModal(false);
    } catch (ex) {
      toast.error(
        "Error occured while updating use details. Please try again in a minute."
      );
    }
  };

  const handleRowClick = (event, rowData) => {
    setShowUserModal(true);
    setUserDetail({
      name: rowData.name,
      userId: rowData.userId,
      email: rowData.email,
      userStatus: rowData.userStatus,
      userType: rowData.useType,
    });
  };
  const changeUserDetails = (event) => {
    setUserDetail({
      ...userDetail,
      [event.target.name]: event.target.value,
    });
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchTickets();
    }
  }, []);
  return (
    <>
      <div className="row bg-light vh-100">
        <Sidebar />

        <div className="row bg-light">
          <div className="col my-4">
            <div className="container">
              <div>
                <WelcomeMsg
                  name={localStorage.getItem("name")}
                  userType="admin"
                />
                <StatusRow ticketList={ticketList} />
                <hr />

                {isUserListLoading ? (
                  <Loader />
                ) : (
                  <MaterialTable
                    onRowClick={handleRowClick}
                    title="USER RECORDS"
                    data={userList}
                    columns={[
                      { title: "user ID", field: "userId" },
                      {
                        title: "Name",
                        field: "name",
                      },
                      {
                        title: "Email",
                        field: "email",
                      },
                      { title: "Role", field: "userType" },
                      {
                        title: "Status",
                        field: "userStatus",
                      },
                    ]}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showUserModal}
        onHide={() => setShowUserModal(false)}
        centered
        backdrop="static"
        keyboard
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit user Details</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <form>
            <h5 className="card-subtitle mb-2 text-primary lead">
              User ID:{userDetail.userId}
            </h5>
            <div className="input-group mb-3">
              <span className="input-group-text">Name</span>
              <input
                type="text"
                className="form-control"
                name="name"
                vlaue={userDetail.name}
                onChange={changeUserDetails}
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">Email</span>
              <input
                type="text"
                className="form-control"
                name="email"
                vlaue={userDetail.email}
                onChange={changeUserDetails}
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">Type</span>
              <Form.Select
                aria-label="User Type Selection"
                value={userDetail.userType}
                onChange={changeUserDetails}
                name="userType"
              >
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="ENGINEER">ENGINEER</option>
                <option value="ADMIN">ADMIN</option>
              </Form.Select>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">Status</span>
              <Form.Select
                aria-label="User Status Selection"
                value={userDetail.userStatus}
                onChange={changeUserDetails}
                name="userStatus"
              >
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="PENDING">PENDING</option>
              </Form.Select>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={updateUserDetail}>
            Update
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default Admin;
