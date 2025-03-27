import Header from "../partials/Header.jsx";
import Nav from "../partials/Nav.jsx"
import DoctorContent from "../DocDash/DoctorContent.jsx";
function DoctorDashboard() {

  return (
    <div>
      {/* Scope Header */}
      <Header></Header>
      {/* Sidebar Navigation */}
      <Nav></Nav>
      {/* Main Content */}
      <DoctorContent></DoctorContent>
    </div>
  );
}

export default DoctorDashboard;
