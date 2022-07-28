import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom"; // auth handler
import Functions from "./selected_participants_functions";
import Select from "react-select";

function Component({ selectedGym, setSelectedGym, selectedCoaches, setSelectedCoaches, selectedMembers, setSelectedMembers }) {
  const [auth, setAuth] = useState(true); // auth
  const [ownedGyms, setOwnedGyms] = useState([]);
  const [gymCoaches, setGymCoaches] = useState([]);
  const [gymMembers, setGymMembers] = useState([]);

  useEffect(() => {
    Functions.toLogin(setAuth);
    Functions.getOwnedGyms(setOwnedGyms);
    Functions.getUsersByGymAndRole(setGymCoaches, selectedGym.id, 2);
    Functions.getUsersByGymAndRole(setGymMembers, selectedGym.id, 1);
  }, [selectedGym, selectedCoaches, selectedMembers]);

  if (!auth) return <Navigate to="/login" />; // auth handler
  return (
    <div>
      <div>Select gym: </div>
      <Select defaultValue={selectedGym} onChange={setSelectedGym} options={ownedGyms} />
      <div>Select coaches: </div>
      <Select isMulti defaultValue={selectedCoaches} onChange={setSelectedCoaches} options={gymCoaches} />
      <div>Select members: </div>
      <Select isMulti defaultValue={selectedMembers} onChange={setSelectedMembers} options={gymMembers} />
    </div>
  );
}

export default Component;
