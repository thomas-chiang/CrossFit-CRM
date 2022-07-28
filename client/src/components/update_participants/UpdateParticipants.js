import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom"; // auth handler
import Functions from "./update_participants_functions";
import Select from "react-select";

function Component({ selectedGym, setSelectedGym, selectedCoaches, setSelectedCoaches, selectedMembers, setSelectedMembers }) {
  const [auth, setAuth] = useState(true); // auth
  const [ownedGyms, setOwnedGyms] = useState([]);
  const [gymCoaches, setGymCoaches] = useState([]);
  const [gymMembers, setGymMembers] = useState([]);

  useEffect(() => {
    Functions.toLogin(setAuth);
    Functions.getOwnedGyms(setOwnedGyms);
    Functions.getUsersByGymAndRole(setGymCoaches, selectedGym?.id, 2);
    Functions.getUsersByGymAndRole(setGymMembers, selectedGym?.id, 1);
  }, [selectedGym]);

  if (!auth) return <Navigate to="/login" />; // auth handler
  return (
    <div>
      Select gym: <Select defaultValue={selectedGym} onChange={setSelectedGym} options={ownedGyms} />
      <div></div>
      {selectedGym ? (
        <div>
          {gymCoaches.length > 0 ? (
            <>
              <div>Select coaches: </div>
              <Select isMulti defaultValue={selectedCoaches} onChange={setSelectedCoaches} options={gymCoaches} />
            </>
          ) : (
            <></>
          )}
          {selectedMembers.length > 0 ? (
            <>
              <div>Select members: </div>
            </>
          ) : (
            <></>
          )}
          <Select isMulti defaultValue={null} onChange={setSelectedMembers} options={gymMembers} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Component;
