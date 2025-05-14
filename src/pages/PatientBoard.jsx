
import PatientProfile from "../PatientDash/PatrientProfile";
import PatientNav from "../partials/PatientNav"
import Header from "../partials/Header";

function PatientBoard() {
  return (
    <div>
      <Header></Header>
      <PatientNav></PatientNav>
      <PatientProfile></PatientProfile>
    </div>

  );
}
export default PatientBoard;
