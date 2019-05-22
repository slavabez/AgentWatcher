import React, { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div``;

const dummySettings = {
  names: [
    {
      id: "123",
      path: "John",
      name: "Джон"
    },
    {
      id: "124",
      path: "Alex",
      name: "Алиикс"
    },
    {
      id: "125",
      path: "Emma",
      name: "Эммс"
    },
    {
      id: "126",
      path: "Peter",
      name: "Петя"
    }
  ]
};

const EditableField = props => {
  const [isEditMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(props.name);

  const handleFinishedEdit = () => {
    props.update(newName);
    setEditMode(false);
  };

  if (isEditMode) {
    return (
      <form onSubmit={handleFinishedEdit}>
        <input
          type="text"
          value={newName}
          onChange={e => {
            setNewName(e.target.value);
          }}
        />
      </form>
    );
  } else {
    return (
      <div>
        {props.path} - {props.name} -{" "}
        <button
          onClick={() => {
            setEditMode(true);
          }}
        >
          Edit
        </button>
      </div>
    );
  }
};

const DbSection = () => {
  return (
    <Wrapper>
      <h1>Настройки имен</h1>
      {dummySettings.names.map(e => (
        <EditableField
          key={e.id}
          id={e.id}
          update={newName => {
            console.log(`Called to edit ${e.id} with new ${newName}`);
          }}
          path={e.path}
          name={e.name}
        />
      ))}
    </Wrapper>
  );
};

export default DbSection;
