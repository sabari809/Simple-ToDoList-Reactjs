import { useEffect, useState } from "react";
import "./App.css";
import { Button, EditableText, InputGroup, Toaster } from "@blueprintjs/core";

// Initialize toaster
const AppToaster = Toaster.create({
  position: "top",
});

function App() {
  const [user, setUser] = useState([]);
  const [Newname, SetName] = useState("");
  const [NewMail, SetMail] = useState("");
  const [NewWeb, SetWeb] = useState("");

  // Fetch user 
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json()) // Convert response to JSON
      .then((json) => setUser(json)) // Set user data
      .catch((error) => {
        AppToaster.show({
          message: "Failed to fetch user data.",
          intent: "danger",
          timeout: 3000,
        });
      });
  }, []);

  // Handle upd
  function onchangeHandler(id, key, value) {
    setUser((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, [key]: value } : user
      )
    );
  }
  function updateUser(id){
         const users = user.find((users=> users.id === id));
         const name = Newname.trim();
    const Mail = NewMail.trim();
    const Web = NewWeb.trim();
    if (name && Mail && Web) {
      fetch("https://jsonplaceholder.typicode.com/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(users),
      })
        .then((response) => response.json())
        .then((newUser) => {
          setUser((prevUsers) => [...prevUsers, newUser]); // Add new user to stat
        })
    }
  }

  //Delete User 
  function DeleteUser(id){
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((newUser) => {
        setUser((prevUsers) => 
          prevUsers.filter(preUsers =>  preUsers.id !==id)); 
      })
      AppToaster.show({
        message : 'User Deleted Successfully',
        intent : 'success',
        timeout: 2000
      })
  }


  // Add a new user
  function AddUSer() {
    const name = Newname.trim();
    const Mail = NewMail.trim();
    const Web = NewWeb.trim();
    if (name && Mail && Web) {
      fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: Mail,
          website: Web,
        }),
      })
        .then((response) => response.json())
        .then((newUser) => {
          setUser((prevUsers) => [...prevUsers, newUser]); // Add new user to state
          AppToaster.show({
            message: "User Added Successfully",
            intent: "success",
            timeout: 3000,
          });
          SetName("");
          SetMail("");
          SetWeb("");
        })
        .catch((error) => {
          AppToaster.show({
            message: "Failed to add user.",
            intent: "danger",
            timeout: 3000,
          });
        });
    } else {
      AppToaster.show({
        message: "All fields are required.",
        intent: "warning",
        timeout: 3000,
      });
    }
  }

  return (
    <div className="App">
      <table className="html-table modify">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {user.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <EditableText
                  onChange={(value) =>
                    onchangeHandler(user.id, "email", value)
                  }
                  value={user.email || ""}
                />
              </td>
              <td>
                <EditableText
                  onChange={(value) =>
                    onchangeHandler(user.id, "website", value)
                  }
                  value={user.website || ""}
                />
              </td>
              <td>
                <Button intent="primary" onClick={()=> updateUser(user.id)}>Update</Button>
                &nbsp;&nbsp;
                <Button intent="danger" onClick={()=> DeleteUser(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td className="CSS-Footer">
              <InputGroup
                value={Newname}
                onChange={(e) => SetName(e.target.value)}
                placeholder="Enter the Name"
              />
            </td>
            <td>
              <InputGroup
                value={NewMail}
                onChange={(e) => SetMail(e.target.value)}
                placeholder="Enter the Mail"
              />
            </td>
            <td>
              <InputGroup
                value={NewWeb}
                onChange={(e) => SetWeb(e.target.value)}
                placeholder="Enter the Web"
              />
            </td>
            <td>
              <Button intent="success" onClick={AddUSer}>
                Add User
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
