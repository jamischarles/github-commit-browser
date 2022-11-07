import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

export function Search() {
  const [userVal, setUserVal] = useState("");
  const [repoVal, setRepoVal] = useState("");
  const navigate = useNavigate();

  // TODO: Add basic validation and show form errors
  function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userVal || !repoVal) return navigate(`/does/not/exist`); // TODO: Change this to nicer client-side errors
    return navigate(`/${userVal}/${repoVal}`);
  }
  return (
    <div>
      <h2>Show commit history by github repository. </h2>
      <form onSubmit={handleSubmit}>
        <input
          style={inputStyle}
          data-testid="userInput"
          onChange={(e) => {
            setUserVal(e?.target?.value);
          }}
          placeholder="facebook"
          value={userVal}
        />
        <span
          style={{
            fontSize: "68px",
            position: "relative",
            fontWeight: 100,
            bottom: -19,
            color: "#e1e1e1",
          }}
        >
          /
        </span>
        <input
          style={inputStyle}
          data-testid="repoInput"
          onChange={(e) => {
            setRepoVal(e?.target?.value);
          }}
          placeholder="react"
          value={repoVal}
        />
        <button data-testid="submitButton">Get the commit history</button>
      </form>
    </div>
  );
}

const inputStyle = {
  marginLeft: 10,
  marginRight: 10,
  padding: 8,
};
