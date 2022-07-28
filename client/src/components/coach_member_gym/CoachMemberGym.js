import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom"; // auth handler
import Functions from "./coach_member_gym_functions";
import Select from "react-select";

function Component() {
  const [update, setUpdate] = useState(Date());
  const [auth, setAuth] = useState(true); // auth
  const [ownedGyms, setOwnedGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [selectedGymUsers, setSelectedGymUsers] = useState([]);
  const [target, setTarget] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    Functions.getOwnedGyms(setOwnedGyms);
    Functions.getUsersByGymAndRole(setSelectedGymUsers, selectedGym?.id, target);
  }, [update, selectedGym]);

  if (!auth) return <Navigate to="/login" />; // auth handler
  return (
    <div>
      Select gym: <Select defaultValue={selectedGym} onChange={setSelectedGym} options={ownedGyms} />
      <div>
        <button
          onClick={() => {
            setTarget(2);
            setUpdate(Date());
          }}
        >
          manage coaches
        </button>
        <button
          onClick={() => {
            setTarget(1);
            setUpdate(Date());
          }}
        >
          manage members
        </button>
      </div>
      {selectedGym && target ? (
        <div>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <button
            type="email"
            onClick={() => {
              Functions.addMember(selectedGym.id, email, setUpdate, setAuth);
            }}
          >
            Add {target == 1 ? "member" : "coach"}
          </button>
          <br />
          {selectedGymUsers.length > 0 ? (
            <>
              <div>gym {target == 1 ? "members" : "coaches"}: </div>
              {selectedGymUsers.map((user, index) => (
                <div key={index}>
                  {user.name} {user.email}
                  <button
                    onClick={() => {
                      Functions.deleteUserByGym(user.id, selectedGym.id, setUpdate, setAuth);
                    }}
                  >
                    delete
                  </button>
                </div>
              ))}
            </>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Component;
