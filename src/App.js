import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
export default function App() {
  const [flag, setFlag] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [slectedFriend, setSelected] = useState(null);

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList initialFriends={friends} setSelected={setSelected} />
        {flag && (
          <AddFriend
            setFriends={setFriends}
            friends={friends}
            setFlag={setFlag}
          />
        )}
        {flag ? (
          <button className="button" onClick={() => setFlag(false)}>
            Close
          </button>
        ) : (
          <button className="button" onClick={() => setFlag(true)}>
            Add friend
          </button>
        )}
      </div>
      {slectedFriend && (
        <SplitBill
          friend={slectedFriend}
          friends={friends}
          setSelected={setSelected}
          setFriends={setFriends}
          key={slectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ initialFriends, setSelected }) {
  return (
    <ul>
      {initialFriends.map((f) => (
        <Friend
          name={f.name}
          balance={f.balance}
          key={f.id}
          image={f.image}
          friend={f}
          setSelected={setSelected}
        />
      ))}
    </ul>
  );
}
function Friend({ name, image, balance, friend, setSelected }) {
  const [flag, setFlag] = useState(false);
  return (
    <li>
      <img src={image} />
      <h3>{name}</h3>
      <p className={balance > 0 ? "green" : balance == 0 ? "" : "red"}>
        {balance > 0
          ? `${name} owes you ${balance}$`
          : balance == 0
          ? `You and ${name} are even`
          : `You owe ${name} ${Math.abs(balance)}$`}
      </p>
      {flag ? (
        <button
          className="button"
          onClick={() => {
            setSelected(null);
            setFlag(false);
          }}
        >
          Close
        </button>
      ) : (
        <button
          className="button"
          onClick={() => {
            setSelected(friend);
            setFlag(true);
          }}
        >
          Select
        </button>
      )}
    </li>
  );
}

function AddFriend({ friends, setFriends, setFlag }) {
  const [name, setName] = useState("");
  const [imgUrl, setImg] = useState("https://i.pravatar.cc/48");
  const handleSubmit = (e) => {
    e.preventDefault();
    const newFriend = {
      balance: 0,
      id: Date.now(),
      name: name,
      image: imgUrl,
    };
    setFriends(() => [...friends, newFriend]);
    setName("");
    setFlag(false);
  };
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Friend name</label>
      <input
        type="text"
        placeholder="Enter your friend name"
        value={name}
        required
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌄 Image URL</label>
      <input
        type="text"
        placeholder="image url"
        value={imgUrl}
        onChange={(e) => setImg(e.target.value)}
      />
      <label></label>
      <button className="button">Add</button>
    </form>
  );
}

function SplitBill({ friend, friends, setFriends, setSelected }) {
  const [bill, setBill] = useState("");
  const [yourExp, setyourExp] = useState("");

  const paidByFriend = bill ? bill - yourExp : "";

  const [paying, setPaying] = useState("You");
  console.log(friend);
  const handleClick = (e) => {
    e.preventDefault();
    let paidByUser = -yourExp;
    console.log(paidByUser);
    setFriends(() =>
      friends.map((f) => {
        if (f.id === friend.id) {
          return {
            ...f,
            balance:
              paying === "You"
                ? f.balance + paidByFriend
                : Math.abs(f.balance) + paidByUser,
          };
        }
        return f;
      })
    );

    console.log(friends);
    setBill(" ");
    setyourExp(" ");
    setSelected(null);
    setPaying("");
  };
  return (
    <form className="form-split-bill">
      <label>💰 Bill value</label>
      <input
        type="text"
        required
        value={bill}
        onChange={(e) => {
          setBill(Number(e.target.value));
        }}
      />
      <label>🧍‍♀️ Your expense</label>
      <input
        type="text"
        required
        value={yourExp}
        onChange={(e) => {
          if (bill >= Number(e.target.value)) {
            setyourExp(Number(e.target.value));
          }
        }}
      />
      <label>👫 {friend?.name} expense</label>
      <input type="Number" required value={paidByFriend} disabled />
      <label>🤑 Who is paying the bill</label>
      <select value={paying} onChange={(e) => setPaying(e.target.value)}>
        <option value="You">You</option>
        <option value={friend.name}>{friend.name}</option>
      </select>
      <label></label>
      <button className="button" onClick={handleClick}>
        Split
      </button>
    </form>
  );
}
